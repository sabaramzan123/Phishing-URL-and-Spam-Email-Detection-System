output "backend_ecr_repository_url" {
  description = "The URL of the Backend Amazon ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repository_url" {
  description = "The URL of the Frontend Amazon ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecs_cluster_name" {
  description = "The name of the Amazon ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.ecs_sg.id
}
