output "cloudfront_url" {
  description = "CloudFront frontend URL — open this in your browser"
  value       = "https://${aws_cloudfront_distribution.cdn.domain_name}"
}

output "api_url" {
  description = "API Gateway invoke URL — set as VITE_API_URL when building the frontend"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "s3_bucket" {
  description = "S3 bucket name — used when uploading the frontend build"
  value       = aws_s3_bucket.frontend.bucket
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used to invalidate cache after deploy"
  value       = aws_cloudfront_distribution.cdn.id
}
