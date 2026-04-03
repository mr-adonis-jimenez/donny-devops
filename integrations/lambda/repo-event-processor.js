import AWS from "aws-sdk";

export const handler = async (event) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    console.log("Processing event:", body);

    if (body.action === "deploy") {
      console.log(`Triggering deployment workflow for ${body.repo}`);
    }

    if (body.action === "security-scan") {
      console.log(`Triggering security scan for ${body.repo}`);
    }
  }

  return { status: "processed" };
};
