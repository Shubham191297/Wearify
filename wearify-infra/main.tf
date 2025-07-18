# Networking part of Wearify app infrastructure

resource "aws_vpc" "wearify_vpc" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "Wearify VPC"
  }
}

resource "aws_internet_gateway" "wearify_igw" {
  vpc_id     = aws_vpc.wearify_vpc.id
  depends_on = [aws_vpc.wearify_vpc]
  tags = {
    Name = "Wearify Internet GateWay"
  }
}


resource "aws_route_table" "wearify-public-rt" {
  vpc_id = aws_vpc.wearify_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.wearify_igw.id
  }

  tags = {
    Name = "Wearify Public Subnet RouteTable"
  }
}
resource "aws_subnet" "wearify_public_subnet" {
  vpc_id                  = aws_vpc.wearify_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = var.wearify_az

  tags = {
    Name = "Public subnet for wearify app"
  }
}

resource "aws_route_table_association" "wearify_public_subnet_association" {
  subnet_id      = aws_subnet.wearify_public_subnet.id
  route_table_id = aws_route_table.wearify-public-rt.id
}

# Instance for Wearify app infra

resource "tls_private_key" "wearify_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "wearify_public_key" {
  key_name   = var.wearify_aws_keypair
  public_key = tls_private_key.wearify_key.public_key_openssh
}

resource "local_file" "wearify_private_key_pem" {
  content         = tls_private_key.wearify_key.private_key_pem
  filename        = "${path.module}/wearify_keys/${var.wearify_aws_keypair}.pem"
  file_permission = "0400"
}

resource "aws_instance" "wearify_master_node" {
  ami                         = var.aws_ec2_wearify_image
  instance_type               = "t3.large"
  key_name                    = aws_key_pair.wearify_public_key.key_name
  subnet_id                   = aws_subnet.wearify_public_subnet.id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.wearify_master_sg.id]

  root_block_device {
    volume_size = 40    # Disk size in GB
    volume_type = "gp2" # General Purpose SSD
  }

  depends_on = [aws_key_pair.wearify_public_key, aws_security_group.wearify_master_sg]

  tags = {
    Name = "Wearify master node"
  }
}

resource "aws_instance" "wearify_worker_node" {
  ami                         = var.aws_ec2_wearify_image
  count                       = 2
  instance_type               = "t3.large"
  key_name                    = aws_key_pair.wearify_public_key.key_name
  subnet_id                   = aws_subnet.wearify_public_subnet.id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.wearify_worker_sg.id]

  depends_on = [aws_key_pair.wearify_public_key, aws_security_group.wearify_worker_sg]

  root_block_device {
    volume_size = 30    # Disk size in GB
    volume_type = "gp2" # General Purpose SSD
  }

  tags = {
    Name = "Wearify worker node ${count.index + 1}"
  }
}
