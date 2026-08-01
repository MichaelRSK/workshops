variable "student_name" {
  description = "Your slug in lowercase letters, numbers, and hyphens."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.student_name))
    error_message = "student_name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "aws_region" {
  description = "AWS region for the Notice Board resources."
  type        = string
  default     = "us-east-1"
}

variable "mongo_host" {
  description = "Public IP address of the EC2 instance running MongoDB."
  type        = string
}

variable "lambda_role_arn" {
  description = "ARN of the existing Lambda execution role."
  type        = string
}
