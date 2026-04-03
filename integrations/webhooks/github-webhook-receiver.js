import crypto from "crypto";
import express from "express";
import { publishEvent, buildRepoEvent } from "../events/sns-publisher.js";

const app = express();
app.use(express.json({ verify: rawBodySaver }));

function rawBodySaver(req, _res, buf) {
  req.rawBody = buf;
}

function verifyGitHubSignature(secret, rawBody, signature) {
  const digest = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")}`;

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature || ""));
}

app.post("/webhooks/github", async (req, res) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const signature = req.header("x-hub-signature-256");
  const eventName = req.header("x-github-event");

  if (!secret || !verifyGitHubSignature(secret, req.rawBody, signature)) {
    return res.status(401).json({ error: "invalid signature" });
  }

  const repo = req.body?.repository?.full_name;
  const action = `${eventName}:${req.body?.action || "received"}`;

  await publishEvent(process.env.REPO_EVENTS_TOPIC_ARN, buildRepoEvent(repo, action));

  res.json({ status: "accepted", repo, action });
});

app.listen(3100, () => {
  console.log("GitHub webhook receiver listening on 3100");
});
