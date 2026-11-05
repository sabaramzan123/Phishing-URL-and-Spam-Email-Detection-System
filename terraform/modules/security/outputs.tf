output "alb_security_group_id" {
  description = "The ID of the ALB Security Group"
  value       = aws_security_group.alb_sg.id
}

output "ecs_security_group_id" {
  description = "The ID of the ECS Security Group"
  value       = aws_security_group.ecs_sg.id
}

output "ecs_task_execution_role_arn" {
  description = "The ARN of the ECS task execution IAM role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}
