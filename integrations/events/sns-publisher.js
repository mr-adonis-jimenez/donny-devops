import AWS from "aws-sdk";

const sns = new AWS.SNS({ region: "us-east-1" });

export async function publishEvent(topicArn, payload) {
  return sns
    .publish({
      TopicArn: topicArn,
      Message: JSON.stringify(payload)
    })
    .promise();
}

export function buildRepoEvent(repo, action) {
  return {
    source: "donny-devops",
    repo,
    action,
    timestamp: new Date().toISOString()
  };
}
