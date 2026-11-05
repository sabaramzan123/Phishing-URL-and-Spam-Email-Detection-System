output "alb_public_url" {
  description = "Public HTTP URL of the Application Load Balancer to access PhishGuard"
  value       = "http://${aws_lb.main.dns_name}"
}

output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "backend_ecr_repository_url" {
  description = "The URL of the Backend Amazon ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repository_url" {
  description = "The URL of the Frontend Amazon ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "vpc_id" {
  description = "The ID of the custom VPC"
  value       = aws_vpc.main.id
}

output "ecs_cluster_name" {
  description = "The name of the Amazon ECS cluster"
  value       = aws_ecs_cluster.main.name
}
