# WRITE IPs LOCALLY

resource "null_resource" "write_worker_ips" {
  depends_on = [aws_instance.wearify_worker_node]

  provisioner "local-exec" {
    command = <<EOT
echo "${join("\n", aws_instance.wearify_worker_node[*].private_ip)}" > worker_private_ips.txt
EOT
  }
}


# COPY IPs and Master node setup file to master 

resource "null_resource" "send_setup_script_and_yaml_files_to_master" {
  depends_on = [aws_instance.wearify_master_node, aws_instance.wearify_worker_node, null_resource.write_worker_ips]

  # File provisioner for worker IPs
  provisioner "file" {
    source      = "${path.module}/worker_private_ips.txt"
    destination = "/home/ubuntu/worker_private_ips.txt"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

  provisioner "file" {
    source      = "${path.module}/wearify_keys/wearify_keypair.pem"
    destination = "/home/ubuntu/.ssh/wearify_keypair.pem"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

  # File provisioner for master node script
  provisioner "file" {
    source      = "${path.module}/../kubernetes/master_node_setup.sh"
    destination = "/home/ubuntu/master_node_setup.sh"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir -p /home/ubuntu/k8s-manifests",
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "chmod 400 /home/ubuntu/.ssh/wearify_keypair.pem"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

  # File provisioner for app deployment yaml files
  provisioner "file" {
    source      = "${path.module}/../kubernetes/deployments"
    destination = "/home/ubuntu/k8s-manifests/deployments"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

  provisioner "file" {
    source      = "${path.module}/../kubernetes/monitoring"
    destination = "/home/ubuntu/k8s-manifests/monitoring"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /home/ubuntu/master_node_setup.sh",
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.wearify_key.private_key_pem
      host        = aws_instance.wearify_master_node.public_ip
    }
  }

}


# COPY Worker node setup script to worker
resource "null_resource" "copy_to_worker_nodes_via_master" {
  count = length(aws_instance.wearify_worker_node)

  depends_on = [
    aws_instance.wearify_master_node,
    aws_instance.wearify_worker_node
  ]

  provisioner "file" {
    source      = "${path.module}/../kubernetes/worker_node_setup.sh"
    destination = "/home/ubuntu/worker_node_setup.sh"

    connection {
      type                = "ssh"
      user                = "ubuntu"
      private_key         = tls_private_key.wearify_key.private_key_pem
      host                = aws_instance.wearify_worker_node[count.index].private_ip
      bastion_host        = aws_instance.wearify_master_node.public_ip
      bastion_user        = "ubuntu"
      bastion_private_key = tls_private_key.wearify_key.private_key_pem
    }
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /home/ubuntu/worker_node_setup.sh",
    ]

    connection {
      type                = "ssh"
      user                = "ubuntu"
      private_key         = tls_private_key.wearify_key.private_key_pem
      host                = aws_instance.wearify_worker_node[count.index].private_ip
      bastion_host        = aws_instance.wearify_master_node.public_ip
      bastion_user        = "ubuntu"
      bastion_private_key = tls_private_key.wearify_key.private_key_pem
    }
  }
}
