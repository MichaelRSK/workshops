variable "students_csv" {
  type        = string
  default     = "students.csv"
  description = "Path to the student roster CSV. Required column: username (lowercase, alphanumeric + hyphens). Optional: full_name, email."
}

variable "region" {
  type        = string
  default     = "us-west-2"
  description = "AWS region for the lab."
}

variable "created_date" {
  type        = string
  description = "Batch creation date for the `date` tag, format dd-mmm-yyyy (e.g. 12-Jul-2026). Pass with -var at apply time."
}
