import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.post("/trigger", (req, res) => {
  const { repo, workflow } = req.body;

  if (!repo || !workflow) {
    return res.status(400).json({ error: "repo and workflow required" });
  }

  exec(`gh workflow run ${workflow} -R ${repo}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }

    res.json({ status: "triggered", output: stdout });
  });
});

app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "donny-devops MCP" });
});

app.listen(3000, () => {
  console.log("Donny DevOps MCP running on port 3000");
});
