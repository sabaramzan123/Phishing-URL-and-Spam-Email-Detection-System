variable "aws_region" {
  description = "AWS region for deploying cloud infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name prefix used across AWS resources"
  type        = string
  default     = "phishguard"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}
