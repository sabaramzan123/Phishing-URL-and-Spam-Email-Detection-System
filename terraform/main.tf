terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ------------------------------------------------------------------------------
# 1. AWS Provider (Region: us-east-1)
# ------------------------------------------------------------------------------
provider "aws" {
  region = var.aws_region
}

# ------------------------------------------------------------------------------
# 2. Amazon ECR: Private Docker Registries with DevSecOps Vulnerability Scanning
# ------------------------------------------------------------------------------
resource "aws_ecr_repository" "backend" {
  name                 = "${var.app_name}-backend"
  image_tag_mutability = "MUTABLE"

  # DevSecOps: Automatically scan images for known security vulnerabilities on push
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.app_name}-backend-ecr"
    Environment = var.environment
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "${var.app_name}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.app_name}-frontend-ecr"
    Environment = var.environment
  }
}

# ------------------------------------------------------------------------------
# 3. Amazon ECS (Elastic Container Service) Cluster
# ------------------------------------------------------------------------------
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"

  tags = {
    Name        = "${var.app_name}-ecs-cluster"
    Environment = var.environment
  }
}

# ------------------------------------------------------------------------------
# 4. Networking: Default VPC & Security Group
# ------------------------------------------------------------------------------
resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}

resource "aws_security_group" "ecs_sg" {
  name        = "${var.app_name}-ecs-sg"
  description = "Security firewall rules for PhishGuard containers"
  vpc_id      = aws_default_vpc.default.id

  # Allow inbound traffic to Frontend on port 3000
  ingress {
    description = "Frontend Next.js web dashboard"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound traffic to Backend on port 8000
  ingress {
    description = "Backend FastAPI threat analysis API"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic (for downloading dependencies and packages)
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.app_name}-security-group"
    Environment = var.environment
  }
}

# ------------------------------------------------------------------------------
# 5. IAM Role: Least-Privilege Task Execution Role for ECS Fargate
# ------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.app_name}-ecs-iam-role"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_attach" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
