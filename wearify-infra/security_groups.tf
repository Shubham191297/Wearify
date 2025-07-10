# Defined both Master node & Worker node security group

resource "aws_security_group" "wearify_master_sg" {
  name        = "Wearify app master SG"
  description = "Security group for master node of wearify app"
  vpc_id      = aws_vpc.wearify_vpc.id
  tags = {
    name = "Wearify master public SG"
  }
}

resource "aws_security_group" "wearify_worker_sg" {
  name        = "Wearify app worker SG"
  description = "Security group for worker node of wearify app"
  vpc_id      = aws_vpc.wearify_vpc.id
  tags = {
    name = "Wearify worker public SG"
  }
}


#################### Master Node Security group rules ###################

resource "aws_security_group_rule" "ssh_master_access" {
  security_group_id = aws_security_group.wearify_master_sg.id
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "prometheus_ui_access_inbound_master" {
  security_group_id = aws_security_group.wearify_master_sg.id
  type              = "ingress"
  from_port         = 30900
  to_port           = 30900
  protocol          = "tcp"
  cidr_blocks       = ["204.107.141.245/32"]
}

resource "aws_security_group_rule" "etcd_master_inbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "ingress"
  from_port                = 6443
  to_port                  = 6443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "kubelet_master_outbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "egress"
  from_port                = 10250
  to_port                  = 10250
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "flannel_master_inbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "ingress"
  from_port                = 8472
  to_port                  = 8472
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "flannel_master_outbound_access" {
  security_group_id = aws_security_group.wearify_master_sg.id
  type              = "egress"
  from_port         = 8472
  to_port           = 8472
  protocol          = "udp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "coredns_udp_master_inbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "ingress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "coredns_udp_master_outbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "egress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "coredns_tcp_master_inbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "ingress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "coredns_tcp_master_outbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "egress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "master_internet_access_http" {
  security_group_id = aws_security_group.wearify_master_sg.id
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = var.wearify_frontend_access_ip_cidr
}

resource "aws_security_group_rule" "master_internet_access_https" {
  security_group_id = aws_security_group.wearify_master_sg.id
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = var.wearify_frontend_access_ip_cidr
}

resource "aws_security_group_rule" "ssh_master_bastion_worker" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "egress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "mongo_master_inbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "egress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "postgre_master_inbound_access" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "allow_icmp_master_ingress" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "ingress"
  from_port                = -1
  to_port                  = -1
  protocol                 = "icmp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "allow_icmp_master_egress" {
  security_group_id = aws_security_group.wearify_master_sg.id
  type              = "egress"
  from_port         = -1
  to_port           = -1
  protocol          = "icmp"
  cidr_blocks       = ["0.0.0.0/0"]
}







################## Worker node security group rules ######################

resource "aws_security_group_rule" "ssh_worker_access" {
  security_group_id = aws_security_group.wearify_worker_sg.id
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  # cidr_blocks       = ["0.0.0.0/0"]
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "etcd_worker_outbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 6443
  to_port                  = 6443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "nodeport_services_inbound_access" {
  security_group_id = aws_security_group.wearify_worker_sg.id
  type              = "ingress"
  from_port         = 30000
  to_port           = 32767
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "kubelet_worker_inbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 10250
  to_port                  = 10250
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "flannel_worker_inbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 8472
  to_port                  = 8472
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "flannel_worker_outbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 8472
  to_port                  = 8472
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "coredns_tcp_worker_inbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "coredns_tcp_worker_outbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "coredns_udp_worker_inbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "coredns_udp_worker_outbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 53
  to_port                  = 53
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "worker_internet_access_http" {
  security_group_id = aws_security_group.wearify_worker_sg.id
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = var.wearify_frontend_access_ip_cidr
}

resource "aws_security_group_rule" "worker_internet_access_https" {
  security_group_id = aws_security_group.wearify_worker_sg.id
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = var.wearify_frontend_access_ip_cidr
}

resource "aws_security_group_rule" "mongo_clusterip_services_inbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "postgre_clusterip_services_inbound_access" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "postgres_inbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "mongodb_inbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}


resource "aws_security_group_rule" "postgres_master_inbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "mongodb_master_inbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}

resource "aws_security_group_rule" "react_worker_inbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "react_worker_outbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "node_worker_inbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 5000
  to_port                  = 5000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "node_worker_outbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 5000
  to_port                  = 5000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}


resource "aws_security_group_rule" "nginx_worker_inbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "nginx_80_worker_inbound" {
  security_group_id = aws_security_group.wearify_worker_sg.id
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "nginx_worker_outbound" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "egress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "allow_icmp_worker_ingress" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = -1
  to_port                  = -1
  protocol                 = "icmp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "allow_icmp_worker_egress" {
  security_group_id = aws_security_group.wearify_worker_sg.id
  type              = "egress"
  from_port         = -1
  to_port           = -1
  protocol          = "icmp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "flannel_worker_ingress_self" {
  security_group_id        = aws_security_group.wearify_worker_sg.id
  type                     = "ingress"
  from_port                = 8472
  to_port                  = 8472
  protocol                 = "udp"
  source_security_group_id = aws_security_group.wearify_worker_sg.id
}

resource "aws_security_group_rule" "flannel_worker_egress_self" {
  security_group_id = aws_security_group.wearify_worker_sg.id
  type              = "egress"
  from_port         = 8472
  to_port           = 8472
  protocol          = "udp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "node_exporter_for_all" {
  security_group_id        = aws_security_group.wearify_master_sg.id
  type                     = "ingress"
  from_port                = 9100
  to_port                  = 9100
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.wearify_master_sg.id
}
