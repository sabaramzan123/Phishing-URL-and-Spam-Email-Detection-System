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
  description = "VPC ID where Target Groups reside"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs to attach the ALB across multiple AZs"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security Group ID for the ALB"
  type        = string
}

variable "frontend_port" {
  description = "Port of the frontend target service"
  type        = number
  default     = 3000
}

variable "backend_port" {
  description = "Port of the backend API target service"
  type        = number
  default     = 8000
}
