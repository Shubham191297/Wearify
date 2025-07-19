output "wearify_vpc" {
  description = "VPC id of Wearify app"
  sensitive   = false
  value       = aws_vpc.wearify_vpc.id
}

output "master_node_subnet" {
  description = "Subnet id of Wearify master node"
  sensitive   = false
  value       = aws_subnet.wearify_public_subnet.id
}

output "worker_node_subnet" {
  description = "Subnet id of Wearify worker node"
  sensitive   = false
  value       = aws_subnet.wearify_public_subnet.id
}

output "wearify_master_node_ipv4_addr" {
  description = "Master node IP address for access"
  value       = aws_instance.wearify_master_node.public_ip
}

output "wearify_worker_nodes_ipv4_addr" {
  description = "Worker node(s) IP addresses for access"

  value = [for instance in aws_instance.wearify_worker_node : instance.private_ip]
}

output "wearify_master_node_arn" {
  description = "Public DNS hostname for master node of wearify"
  value       = aws_instance.wearify_master_node.public_dns
}

output "wearify_worker_node_arn" {
  description = "Public DNS hostname for worker node of wearify"
  value       = [for instance in aws_instance.wearify_worker_node : instance.public_dns]
}

output "wearify_workers_public_ips" {
  value     = [for i in aws_instance.wearify_worker_node : i.public_ip]
  sensitive = true
}

output "wearify_keypair" {
  description = "Wearify key used for Nodes"
  sensitive   = true
  value       = tls_private_key.wearify_key.private_key_pem
}

output "wearify_key_location" {
  description = "Wearify key location"
  value       = local_file.wearify_private_key_pem.filename
}
