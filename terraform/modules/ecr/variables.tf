variable "app_name" {
  description = "Application name prefix"
  type        = string
  default     = "phishguard"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}
