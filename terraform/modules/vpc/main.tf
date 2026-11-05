# Custom VPC with DNS support enabled
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.app_name}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway for Public Internet connectivity
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.app_name}-igw"
    Environment = var.environment
  }
}

# Multi-AZ Public Subnet 1 (e.g. us-east-1a)
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_1_cidr
  availability_zone       = var.az_1
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.app_name}-public-subnet-1"
    Environment = var.environment
  }
}

# Multi-AZ Public Subnet 2 (e.g. us-east-1b)
resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_2_cidr
  availability_zone       = var.az_2
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.app_name}-public-subnet-2"
    Environment = var.environment
  }
}

# Public Route Table sending all 0.0.0.0/0 traffic to Internet Gateway
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name        = "${var.app_name}-public-route-table"
    Environment = var.environment
  }
}

# Route Table Association for Subnet 1
resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

# Route Table Association for Subnet 2
resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

