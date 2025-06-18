variable "aws_region" {
  type        = string
  description = "Wearify deployment region"
  default     = "us-east-1"
}

variable "aws_ec2_wearify_image" {
  type    = string
  default = "ami-020cba7c55df1f615"
}

variable "wearify_ssh_access_ip_cidr" {
  type    = list(string)
  default = ["152.59.2.166/32", "106.215.44.109/32", "122.175.72.96/32"]
}

variable "wearify_frontend_access_ip_cidr" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

variable "wearify_aws_keypair" {
  type    = string
  default = "wearify_keypair"
}
