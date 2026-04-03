provider "aws" {
  region = "us-east-1"
}

resource "aws_sqs_queue" "repo_events_buffer" {
  name                       = "donny-devops-repo-events-buffer"
  visibility_timeout_seconds = 60
  message_retention_seconds  = 345600

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.repo_events_dlq.arn
    maxReceiveCount     = 5
  })

  tags = {
    Project = "donny-devops"
    Layer   = "event-buffer"
  }
}

resource "aws_sqs_queue" "repo_events_dlq" {
  name = "donny-devops-repo-events-dlq"

  tags = {
    Project = "donny-devops"
    Layer   = "event-buffer"
    Type    = "dead-letter"
  }
}

resource "aws_sns_topic" "repo_events" {
  name = "donny-devops-repo-events"

  tags = {
    Project = "donny-devops"
    Layer   = "event-bus"
  }
}

resource "aws_sns_topic_subscription" "repo_events_to_sqs" {
  topic_arn            = aws_sns_topic.repo_events.arn
  protocol             = "sqs"
  endpoint             = aws_sqs_queue.repo_events_buffer.arn
  raw_message_delivery = true
}

resource "aws_sqs_queue_policy" "repo_events_buffer_policy" {
  queue_url = aws_sqs_queue.repo_events_buffer.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "Allow-SNS-SendMessage"
        Effect    = "Allow"
        Principal = "*"
        Action    = "sqs:SendMessage"
        Resource  = aws_sqs_queue.repo_events_buffer.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.repo_events.arn
          }
        }
      }
    ]
  })
}
