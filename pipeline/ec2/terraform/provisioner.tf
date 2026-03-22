resource "null_resource" "mount_existing_jenkins_volume" {
  depends_on = [aws_instance.jenkins_server]

  provisioner "remote-exec" {
    inline = [
      "#!/bin/bash",
      "sudo apt-get update",
      "sudo apt-get install fontconfig openjdk-21-jre unzip -y",
      "java -version",
      "curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg",
      "echo 'deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com bookworm main' | sudo tee /etc/apt/sources.list.d/hashicorp.list",
      "sudo apt-get update",
      "sudo apt-get install terraform -y",
      "sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key",
      "echo 'deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/' | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null",
      "sudo apt-get update",
      "sudo apt-get install jenkins -y",
      "curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'",
      "unzip awscliv2.zip",
      "sudo ./aws/install",
      "aws s3 cp s3://jenkins-shubham/jenkins_home.tgz /home/ubuntu/jenkins_home.tgz",
      "sudo systemctl stop jenkins || true",
      "sudo rm -rf /var/lib/jenkins/*",
      "sudo tar -xzf /home/ubuntu/jenkins_home.tgz -C /var/lib/jenkins --strip-components=1",
      "sudo chown jenkins:jenkins /var/lib/jenkins",
      "sudo systemctl start jenkins"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.jenkins_key.private_key_pem
      host        = aws_instance.jenkins_server.public_ip
    }
  }
}
