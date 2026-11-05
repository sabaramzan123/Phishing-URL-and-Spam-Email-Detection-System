terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "phishguard-tfstate-562825149788"
    key            = "environments/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "phishguard-tfstate-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# ------------------------------------------------------------------------------
# 1. VPC Module (Networking, Subnets, Internet Gateway, Route Tables)
# ------------------------------------------------------------------------------
module "vpc" {
  source = "../../modules/vpc"

  app_name             = var.app_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_1_cidr = var.public_subnet_1_cidr
  public_subnet_2_cidr = var.public_subnet_2_cidr
  az_1                 = var.az_1
  az_2                 = var.az_2
}

# ------------------------------------------------------------------------------
# 2. ECR Module (Container Registries with Vulnerability Scan on Push)
# ------------------------------------------------------------------------------
module "ecr" {
  source = "../../modules/ecr"

  app_name    = var.app_name
  environment = var.environment
}

# ------------------------------------------------------------------------------
# 3. Security Module (Zero-Trust Security Groups & Least-Privilege IAM Roles)
# ------------------------------------------------------------------------------
module "security" {
  source = "../../modules/security"

  app_name      = var.app_name
  environment   = var.environment
  vpc_id        = module.vpc.vpc_id
  frontend_port = var.frontend_port
  backend_port  = var.backend_port
}

# ------------------------------------------------------------------------------
# 4. ALB Module (Multi-AZ Load Balancer & Path-Based Routing)
# ------------------------------------------------------------------------------
module "alb" {
  source = "../../modules/alb"

  app_name              = var.app_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  alb_security_group_id = module.security.alb_security_group_id
  frontend_port         = var.frontend_port
  backend_port          = var.backend_port
}

# ------------------------------------------------------------------------------
# 5. ECS Module (Fargate Spot Microservices & CloudWatch Logging)
# ------------------------------------------------------------------------------
module "ecs" {
  source = "../../modules/ecs"

  app_name                    = var.app_name
  environment                 = var.environment
  aws_region                  = var.aws_region
  public_subnet_ids           = module.vpc.public_subnet_ids
  ecs_security_group_id       = module.security.ecs_security_group_id
  ecs_task_execution_role_arn = module.security.ecs_task_execution_role_arn
  backend_image_url           = module.ecr.backend_repository_url
  frontend_image_url          = module.ecr.frontend_repository_url
  backend_port                = var.backend_port
  frontend_port               = var.frontend_port
  backend_target_group_arn    = module.alb.backend_target_group_arn
  frontend_target_group_arn   = module.alb.frontend_target_group_arn
  enable_fargate_spot         = var.enable_fargate_spot
}
