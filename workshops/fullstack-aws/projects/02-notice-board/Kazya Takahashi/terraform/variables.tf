variable "student_name" {
  description = "Your name in lowercase with hyphens (e.g. john-smith). Used to prefix all resources."

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.student_name))
    error_message = "student_name must be lowercase letters, numbers, and hyphens only."
  }
}

variable "project_name" {
  description = "Project name — combined with student_name to form resource names."
  default     = "notice-board"
}

variable "aws_region" {
  description = "AWS region to deploy into."
  default     = "us-east-1"
}

variable "mongo_host" {
  description = "EC2 public IP (or private IP if Lambda is in the same VPC) running MongoDB."
}

variable "created_date" {
  description = "Creation date for the 'date' tag (e.g. 31-Jul-2026)."
  type        = string
  default     = "31-Jul-2026"
}

variable "lambda_role_arn" {
  description = "ARN of the shared Lambda execution role provided by the instructor."
  type        = string
}
