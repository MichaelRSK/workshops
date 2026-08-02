terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name = "student-${var.student_name}-notice-board"
}

# ---------------------------------------------------------------------------
# TIER 1 TODOs
# ---------------------------------------------------------------------------

# TODO: aws_lambda_function
#   - filename = "${path.module}/../backend/lambda.zip"
#   - handler  = "lambda_function.lambda_handler"
#   - runtime  = "python3.12"
#   - environment.variables = { MONGO_HOST = var.mongo_host, MONGO_PORT = var.mongo_port }
#   - needs an aws_iam_role with the AWSLambdaBasicExecutionRole policy attached

# TODO: aws_apigatewayv2_api (HTTP API)
#   - protocol_type = "HTTP"

# TODO: aws_apigatewayv2_integration
#   - integration_type = "AWS_PROXY", connects the api to the lambda

# TODO: aws_apigatewayv2_route x3
#   - "GET /notices", "POST /notices", "DELETE /notices/{id}"

# TODO: aws_apigatewayv2_stage
#   - name = "$default", auto_deploy = true

# TODO: aws_lambda_permission
#   - allows apigateway.amazonaws.com to invoke the lambda function

# TODO: aws_s3_bucket (bucket = local.name)

# TODO: aws_s3_bucket_public_access_block
#   - all block_* = false (Tier 1) -> flip to true in Tier 3 once CloudFront is added

# TODO: aws_s3_bucket_policy
#   - Principal "*", Action "s3:GetObject" (Tier 1) -> replace with CloudFront OAC policy in Tier 3

# TODO: aws_s3_bucket_website_configuration
#   - index_document { suffix = "index.html" }

# ---------------------------------------------------------------------------
# TIER 3 TODOs (add once Tier 1 is verified working)
# ---------------------------------------------------------------------------

# TODO: aws_cloudfront_origin_access_control

# TODO: aws_cloudfront_distribution
#   - origin points at the S3 bucket via OAC (not the website endpoint)

# ---------------------------------------------------------------------------
# TIER 4 TODOs (optional, do after Tiers 1-3 are live)
# ---------------------------------------------------------------------------

# TODO: aws_cloudwatch_log_group x2 (lambda, apigw access logs)
# TODO: aws_cloudwatch_metric_alarm x2 (lambda errors, apigw 5xx)
# TODO: aws_cloudwatch_dashboard
