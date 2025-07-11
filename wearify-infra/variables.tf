variable "aws_region" {
  type        = string
  description = "Wearify deployment region"
  default     = "us-east-1"
}

variable "aws_ec2_wearify_image" {
  type    = string
  default = "ami-0a7d80731ae1b2435"
}

variable "wearify_ssh_access_ip_cidr" {
  type    = list(string)
  default = ["152.59.2.166/32", "106.215.44.109/32", "122.175.72.96/32", "106.214.124.239/32", "204.107.141.245/32"]
}

variable "wearify_frontend_access_ip_cidr" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

variable "wearify_aws_keypair" {
  type    = string
  default = "wearify_keypair"
}

variable "wearify_az" {
  type    = string
  default = "us-east-1a"
}
