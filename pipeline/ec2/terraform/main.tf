terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "jenkins_sg" {
  name        = "jenkins-security-group"
  description = "Allow Jenkins access"

  ingress {
    description = "Allow Jenkins UI"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "ec2_role" {
  name = "ec2-s3-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "s3_policy" {
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject"]
      Resource = "arn:aws:s3:::jenkins-shubham/*"
    }]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  role = aws_iam_role.ec2_role.name
}

resource "aws_instance" "jenkins_server" {
  ami           = "ami-0a7d80731ae1b2435"
  instance_type = "t3.medium"
  key_name      = aws_key_pair.jenkins_public_key.key_name

  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]

  # user_data = file("jenkins_setup.sh")

  root_block_device {
    volume_size = 20
  }

  tags = {
    Name = "jenkins-server"
  }
}

resource "tls_private_key" "jenkins_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "jenkins_public_key" {
  key_name   = "jenkins_key"
  public_key = tls_private_key.jenkins_key.public_key_openssh
}

resource "local_file" "jenkins_private_key_pem" {
  content         = tls_private_key.jenkins_key.private_key_pem
  filename        = "${path.module}/keys/jenkins_key.pem"
  file_permission = "0400"
}

output "jenkins_server_ip" {
  value = aws_instance.jenkins_server.public_ip
}
