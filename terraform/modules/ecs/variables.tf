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

variable "aws_region" {
  description = "AWS region for CloudWatch logs"
  type        = string
  default     = "us-east-1"
}

variable "public_subnet_ids" {
  description = "Public subnet IDs where Fargate tasks will run"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "Security group ID allowing traffic strictly from ALB"
  type        = string
}

variable "ecs_task_execution_role_arn" {
  description = "IAM Role ARN for task execution"
  type        = string
}

variable "backend_image_url" {
  description = "ECR Image URL for backend"
  type        = string
}

variable "frontend_image_url" {
  description = "ECR Image URL for frontend"
  type        = string
}

variable "backend_port" {
  description = "Port exposed by backend"
  type        = number
  default     = 8000
}

variable "frontend_port" {
  description = "Port exposed by frontend"
  type        = number
  default     = 3000
}

variable "backend_target_group_arn" {
  description = "ARN of the backend ALB target group"
  type        = string
}

variable "frontend_target_group_arn" {
  description = "ARN of the frontend ALB target group"
  type        = string
}

variable "enable_fargate_spot" {
  description = "Whether to use Fargate Spot for up to 70% AWS cost savings"
  type        = bool
  default     = true
}

