output "alb_dns_name" {
  description = "The public Application Load Balancer DNS URL"
  value       = module.alb.alb_dns_name
}

output "application_url" {
  description = "Clickable HTTP URL for the Application"
  value       = "http://${module.alb.alb_dns_name}"
}

output "backend_ecr_url" {
  description = "Amazon ECR Registry URL for Backend Docker image"
  value       = module.ecr.backend_repository_url
}

output "frontend_ecr_url" {
  description = "Amazon ECR Registry URL for Frontend Docker image"
  value       = module.ecr.frontend_repository_url
}

output "ecs_cluster_name" {
  description = "Name of the Amazon ECS Fargate cluster"
  value       = module.ecs.cluster_name
}

