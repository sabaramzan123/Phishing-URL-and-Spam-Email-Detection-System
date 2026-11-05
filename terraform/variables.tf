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

variable "vpc_cidr" {
  description = "CIDR block for the custom VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  description = "CIDR block for public subnet in AZ 1"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "CIDR block for public subnet in AZ 2"
  type        = string
  default     = "10.0.2.0/24"
}

variable "az_1" {
  description = "First Availability Zone for ALB redundancy"
  type        = string
  default     = "us-east-1a"
}

variable "az_2" {
  description = "Second Availability Zone for ALB redundancy"
  type        = string
  default     = "us-east-1b"
}

variable "backend_port" {
  description = "Port on which FastAPI backend listens"
  type        = number
  default     = 8000
}

variable "frontend_port" {
  description = "Port on which Next.js frontend listens"
  type        = number
  default     = 3000
}
