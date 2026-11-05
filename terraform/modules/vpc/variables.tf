variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "phishguard"
}

variable "environment" {
  description = "Target deployment environment (e.g. dev, prod)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
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
  description = "Availability Zone 1"
  type        = string
  default     = "us-east-1a"
}

variable "az_2" {
  description = "Availability Zone 2"
  type        = string
  default     = "us-east-1b"
}

