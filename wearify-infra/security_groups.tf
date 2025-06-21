# Security Group

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
