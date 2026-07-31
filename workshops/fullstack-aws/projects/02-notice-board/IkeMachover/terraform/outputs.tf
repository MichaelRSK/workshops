output "api_url" {
  description = "API Gateway URL to use as VITE_API_URL."
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "s3_bucket" {
  description = "S3 bucket that hosts the frontend files."
  value       = aws_s3_bucket.frontend.bucket
}

output "s3_website_url" {
  description = "Public S3 static website URL."
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "lambda_function_name" {
  description = "Lambda function name."
  value       = aws_lambda_function.api.function_name
}
