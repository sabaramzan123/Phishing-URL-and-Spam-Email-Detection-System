# ------------------------------------------------------------------------------
# 1. CloudWatch Log Groups (7-Day Retention to Eliminate Idle Storage Costs)
# ------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.app_name}-backend"
  retention_in_days = 7

  tags = {
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.app_name}-frontend"
  retention_in_days = 7

  tags = {
    Environment = var.environment
  }
}

# ------------------------------------------------------------------------------
# 2. ECS Cluster with Fargate & Fargate Spot Providers
# ------------------------------------------------------------------------------
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"

  tags = {
    Name        = "${var.app_name}-ecs-cluster"
    Environment = var.environment
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = var.enable_fargate_spot ? "FARGATE_SPOT" : "FARGATE"
    weight            = 100
  }
}

# ------------------------------------------------------------------------------
# 3. ECS Task Definitions (Minimal CPU/RAM for Budget Friendliness)
# ------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.app_name}-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${var.backend_image_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = var.backend_port
          hostPort      = var.backend_port
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "backend"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.app_name}-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "${var.frontend_image_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = var.frontend_port
          hostPort      = var.frontend_port
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "frontend"
        }
      }
    }
  ])
}

# ------------------------------------------------------------------------------
# 4. ECS Services (Fargate Spot Attached to ALB Target Groups)
# ------------------------------------------------------------------------------
resource "aws_ecs_service" "backend" {
  name            = "${var.app_name}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = var.enable_fargate_spot ? "FARGATE_SPOT" : "FARGATE"
    weight            = 100
  }

  network_configuration {
    subnets          = var.public_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "backend"
    container_port   = var.backend_port
  }

  depends_on = [aws_ecs_cluster_capacity_providers.main]
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.app_name}-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = var.enable_fargate_spot ? "FARGATE_SPOT" : "FARGATE"
    weight            = 100
  }

  network_configuration {
    subnets          = var.public_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend"
    container_port   = var.frontend_port
  }

  depends_on = [aws_ecs_cluster_capacity_providers.main]
}

