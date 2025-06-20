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

resource "aws_eip" "wearify_nat_ip_addr" {
  domain = "vpc"
}
resource "aws_nat_gateway" "wearify_ngw" {
  allocation_id = aws_eip.wearify_nat_ip_addr.id
  subnet_id     = aws_subnet.wearify_public_subnet.id
  depends_on    = [aws_vpc.wearify_vpc]
  tags = {
    Name = "Wearify NAT GateWay"
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

resource "aws_route_table" "wearify-private-rt" {
  vpc_id = aws_vpc.wearify_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.wearify_ngw.id
  }

  tags = {
    Name = "Wearify Private Subnet RouteTable"
  }
}

resource "aws_subnet" "wearify_public_subnet" {
  vpc_id                  = aws_vpc.wearify_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "Public subnet for wearify app"
  }
}

resource "aws_subnet" "wearify_private_subnet" {
  vpc_id                  = aws_vpc.wearify_vpc.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "Private subnet for wearify app"
  }

  lifecycle {
    ignore_changes = [
      tags["Name"]
    ]
  }
}

resource "aws_route_table_association" "wearify_public_subnet_association" {
  subnet_id      = aws_subnet.wearify_public_subnet.id
  route_table_id = aws_route_table.wearify-public-rt.id
}

resource "aws_route_table_association" "wearify_private_subnet_association" {
  subnet_id      = aws_subnet.wearify_private_subnet.id
  route_table_id = aws_route_table.wearify-private-rt.id
}

# Security Group and Instance for Wearify app infra

resource "aws_security_group" "wearify_master_public_sg" {
  name        = "Wearify app master SG"
  description = "Allow traffic from and to Worker node - wearify"
  vpc_id      = aws_vpc.wearify_vpc.id

  ingress {
    description = "SSH access for master node"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.wearify_ssh_access_ip_cidr
  }

  # Kubernetes rules for Wearify master node
  ingress {
    description = "Master node kube api server access"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "Master node - etcd server client API"
    from_port   = 2379
    to_port     = 2380
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "Master node - Kubelet API"
    from_port   = 10250
    to_port     = 10250
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "Master node - Kube scheduler & Kube controller manager"
    from_port   = 10257
    to_port     = 10259
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    from_port   = 179
    to_port     = 179
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    from_port   = 8472
    to_port     = 8472
    protocol    = "udp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    from_port   = 6783
    to_port     = 6784
    protocol    = "udp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "Allow ICMP for ping from VPC"
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Wearify master node SG"
  }
}

resource "aws_security_group" "wearify_workers_private_sg" {
  name        = "Wearify app worker SG"
  description = "Allow traffic from and to Master node & public - wearify"
  vpc_id      = aws_vpc.wearify_vpc.id

  ingress {
    description = "SSH access for worker nodes"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = concat(var.wearify_ssh_access_ip_cidr, ["10.0.1.0/24"])
  }

  ingress {
    description = "Frontend port access for Wearify"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = var.wearify_frontend_access_ip_cidr
  }

  ingress {
    description = "Backend port access for Wearify"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # Kubernetes rules for Wearify worker node
  ingress {
    description = "Worker node - Kubelet API"
    from_port   = 10250
    to_port     = 10250
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "Worker node - Kubeproxy"
    from_port   = 10256
    to_port     = 10256
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "Worker node - NodePort Services"
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    from_port   = 179
    to_port     = 179
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    from_port   = 8472
    to_port     = 8472
    protocol    = "udp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    from_port   = 6783
    to_port     = 6784
    protocol    = "udp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "Allow ICMP for ping from VPC"
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # Connect to master node kubeadm
  egress {
    description = "Allow all outbound traffic to the internet (e.g., to pull images, access AWS services)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = ["0.0.0.0/0"]
  }

  # DB access rules for PGSQL and Mongo DB
  egress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.2.0/24"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.2.0/24"]
  }

  # For NAT gateway internet access only
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 53
    to_port     = 53
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "Wearify worker node SG"
  }
}

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

  vpc_security_group_ids = [aws_security_group.wearify_master_public_sg.id]

  root_block_device {
    volume_size = 30    # Disk size in GB
    volume_type = "gp2" # General Purpose SSD
  }

  depends_on = [aws_key_pair.wearify_public_key]

  user_data = <<-EOF
              #!/bin/bash
              mkdir -p /home/ubuntu/.ssh
              cat <<EOKEY > /home/ubuntu/.ssh/wearify-key.pem
              ${replace(tls_private_key.wearify_key.private_key_pem, "\n", "\\n")}
              EOKEY
              chmod 400 /home/ubuntu/.ssh/wearify-key.pem
              chown ubuntu:ubuntu /home/ubuntu/.ssh/wearify-key.pem
            EOF

  tags = {
    Name = "Wearify master node"
  }
}

resource "aws_instance" "wearify_worker_node" {
  ami                         = var.aws_ec2_wearify_image
  count                       = 2
  instance_type               = "t3.medium"
  key_name                    = aws_key_pair.wearify_public_key.key_name
  subnet_id                   = aws_subnet.wearify_private_subnet.id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.wearify_workers_private_sg.id]

  depends_on = [aws_key_pair.wearify_public_key]

  root_block_device {
    volume_size = 20    # Disk size in GB
    volume_type = "gp2" # General Purpose SSD
  }

  tags = {
    Name = "Wearify worker node ${count.index + 1}"
  }
}
