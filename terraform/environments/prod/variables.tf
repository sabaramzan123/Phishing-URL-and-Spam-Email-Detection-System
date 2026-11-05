variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

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

variable "vpc_cidr" {
  description = "CIDR block for the custom VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  description = "CIDR block for public subnet 1"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "CIDR block for public subnet 2"
  type        = string
  default     = "10.0.2.0/24"
}

variable "az_1" {
  description = "First Availability Zone"
  type        = string
  default     = "us-east-1a"
}

variable "az_2" {
  description = "Second Availability Zone"
  type        = string
  default     = "us-east-1b"
}

variable "backend_port" {
  description = "Container port for FastAPI backend"
  type        = number
  default     = 8000
}

variable "frontend_port" {
  description = "Container port for Next.js frontend"
  type        = number
  default     = 3000
}

variable "enable_fargate_spot" {
  description = "Enable Fargate Spot capacity provider for 70% cost reduction"
  type        = bool
  default     = true
}
