terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket            = "wearify-app-infra-state-bucket"
    key               = "env/dev/terraform.tfstate"
    region            = "us-east-1"
    availability_zone = "us-east-1a"
  }
}

provider "aws" {
  region = var.aws_region
}
