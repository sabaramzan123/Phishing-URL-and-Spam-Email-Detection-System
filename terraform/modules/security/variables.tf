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

variable "vpc_id" {
  description = "VPC ID where security groups will be attached"
  type        = string
}

variable "frontend_port" {
  description = "Port used by Frontend container"
  type        = number
  default     = 3000
}

variable "backend_port" {
  description = "Port used by Backend API container"
  type        = number
  default     = 8000
}
