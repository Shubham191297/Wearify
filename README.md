# 🚀 Wearify

Wearify is a full-stack deployment project built on MERN stack + Postgres and deployed on kubeadm based kubernetes cluster running on EC2 instance

The project demonstrates automated infrastructure provisioning followed by k8s cluster configuration and app deployment within same pipeline. Also it has separate pipeline deploying infrastructure monitoring.

---

## 🏗 Deployment Architecture

Jenkins EC2 instance
Terraform → EC2 Instance Creation → Jenkins volume configure (s3) → Jenkins restart

Jenkins pipelines
There are 3 jenkins pipelines configured on jenkins node:

1. wearify-pipeline - infra provisioning, k8s setup, app deployment.
2. wearify-monitoring - deploy infra monitoring
3. wearify-demolish - destroy the infra, cleanup

wearify-pipeline - multistage
Terraform → AWS infrastructure → kubeadm cluster configuration → Deploy app manifests

---

## 📂 Repository Structure

```
├── backend
│   ├── Dockerfile
│   ├── app.js
│   ├── controllers
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── shop.js
│   ├── data
│   │   ├── invoices
│   │   │   ├── invoices-6707a64064b678e740b8ae9c.pdf
│   │   │   ├── invoices-6707a65c64b678e740b8aeb5.pdf
│   │   │   ├── invoices-6707af1ded5a4e9601858d1d.pdf
│   │   │   ├── invoices-6721054d8c0c6e677edd8cef.pdf
│   │   │   └── invoices-686bccc71ffbb59c4da7ad46.pdf
│   │   └── pdfGenerator.js
│   ├── extras
│   │   ├── README.md
│   │   ├── auth_session_based
│   │   │   ├── app.js
│   │   │   └── utils
│   │   │       └── session-db.js
│   │   ├── controllers_filebased
│   │   │   ├── admin.js_old
│   │   │   └── shop.js_old
│   │   ├── data
│   │   │   ├── cart.json
│   │   │   └── products.json
│   │   ├── models_filebased
│   │   │   ├── cart.js_new
│   │   │   ├── cart.js_old
│   │   │   └── product.js_old
│   │   └── mongodb_code
│   │       ├── bag.js
│   │       ├── controllers
│   │       │   ├── admin.js
│   │       │   ├── app.js
│   │       │   └── shop.js
│   │       ├── database
│   │       │   ├── mongo-database.js
│   │       │   └── pgsql-database.js
│   │       ├── order.js
│   │       ├── product.js
│   │       └── user.js
│   ├── images
│   │   ├── wearify-blackjeans.jpg
│   │   ├── wearify-blacksportshoes.jpg
│   │   ├── wearify-bluewristwatch.jpg
│   │   ├── wearify-greentshirt.jpg
│   │   ├── wearify-images.jpeg
│   │   ├── wearify-pinkkurti.jpg
│   │   ├── wearify-pinkpurse.jpg
│   │   ├── wearify-redshirt.jpeg
│   │   └── wearify-whitesneakershoes.jpeg
│   ├── middleware
│   │   ├── is-admin.js
│   │   └── is-auth.js
│   ├── models
│   │   ├── bag.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── user.js
│   ├── node_upload.sh
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── shop.js
│   ├── utils
│   │   ├── db-url.js
│   │   ├── file.js
│   │   ├── pgsql-database.js
│   │   ├── secretKey.js
│   │   ├── sendgridSecretKey.js
│   │   ├── serverURL.js
│   │   └── session-db.js
│   ├── validation
│   │   ├── colorsList.js
│   │   ├── productValidation.js
│   │   └── signupValidation.js
│   └── wearify.json
├── dockerfiles
│   ├── mongo
│   │   ├── Dockerfile
│   │   ├── collections
│   │   │   ├── init-db.sh
│   │   │   ├── wearify.orders.json
│   │   │   ├── wearify.products.json
│   │   │   └── wearify.shoppingbags.json
│   │   └── mongo_upload.sh
│   └── pgsql
│       ├── Dockerfile
│       ├── init-db.sh
│       ├── pgsql_upload.sh
│       └── wearify.pgsql
├── frontend
│   ├── package-lock.json
│   ├── package.json
│   └── wearify
│       ├── Dockerfile
│       ├── README.md
│       ├── config
│       │   └── default.conf
│       ├── package-lock.json
│       ├── package.json
│       ├── public
│       │   ├── favicon.ico
│       │   ├── index.html
│       │   ├── logo192.png
│       │   ├── logo512.png
│       │   ├── manifest.json
│       │   └── robots.txt
│       ├── src
│       │   ├── App.css
│       │   ├── App.js
│       │   ├── components
│       │   │   ├── AddProduct.js
│       │   │   ├── EditProduct.js
│       │   │   ├── NavBar.js
│       │   │   ├── OrdersOverview.js
│       │   │   ├── ProductDetails.js
│       │   │   ├── ProductForm.js
│       │   │   ├── ProductList.js
│       │   │   ├── ProductOverview.js
│       │   │   ├── ShoppingBagItems.js
│       │   │   └── ShoppingBagOverview.js
│       │   ├── context
│       │   │   └── auth.js
│       │   ├── extra
│       │   │   ├── NewProductFormat.txt
│       │   │   └── ProductsPage.old
│       │   ├── guest
│       │   │   └── GuestBag.js
│       │   ├── icons
│       │   │   ├── BagIcon.js
│       │   │   ├── DeleteIcon.js
│       │   │   ├── EditIcon.js
│       │   │   ├── NextPageIcon.js
│       │   │   └── PrevPageIcon.js
│       │   ├── index.css
│       │   ├── index.js
│       │   ├── layouts
│       │   │   ├── ChangePassword.js
│       │   │   ├── CheckoutSuccess.js
│       │   │   ├── CustomError.js
│       │   │   ├── ErrorPage.js
│       │   │   ├── Pagination.js
│       │   │   ├── ResetPage.js
│       │   │   └── RootLayout.js
│       │   ├── pages
│       │   │   ├── HomePage.js
│       │   │   ├── LoginPage.js
│       │   │   ├── NoOrders.js
│       │   │   ├── NoProductsBag.js
│       │   │   ├── OrdersPage.js
│       │   │   ├── ProductsPage.js
│       │   │   ├── ShoppingBagPage.js
│       │   │   └── SignupPage.js
│       │   └── utils
│       │       ├── backendURL.js
│       │       └── imagePath.js
│       ├── tailwind.config.js
│       └── upload_image.sh
├── kubernetes
│   ├── backup
│   │   ├── cilium_setup.sh
│   │   └── oldbackend_deployment.old
│   ├── deployments
│   │   ├── backend_deployment.yaml
│   │   ├── deployServices.sh
│   │   ├── frontend_deployment.yaml
│   │   ├── makeVolumes.sh
│   │   ├── mongodb_deployment.yaml
│   │   ├── postgres_deployment.yaml
│   │   └── removeServices.sh
│   ├── master_node_setup.sh
│   ├── monitoring
│   │   ├── alert-manager.yaml
│   │   ├── alerting-rules-config.yaml
│   │   ├── alerting-rules.yaml
│   │   ├── alertmanager-config.yaml
│   │   ├── deployMonitoring.sh
│   │   ├── node_exporter_ds.yaml
│   │   ├── prom.txt
│   │   ├── prometheus-clusterrole.yaml
│   │   ├── prometheus-clusterrolebinding.yaml
│   │   ├── prometheus-configmap.yaml
│   │   ├── prometheus-serviceaccount.yaml
│   │   ├── prometheus.yaml
│   │   └── prometheus_server.yaml
│   └── worker_node_setup.sh
├── package-lock.json
├── package.json
├── pipeline
│   ├── Jenkinsfile
│   ├── container
│   │   ├── Dockerfile
│   │   ├── configureJenkins.sh
│   │   └── wearify_Jenkins_CICD.sh
│   ├── ec2
│   │   └── terraform
│   │       ├── main.tf
│   │       ├── provisioner.tf
│   │       ├── terraform.tfstate
│   │       └── terraform.tfstate.backup
│   ├── monitoring
│   │   └── Jenkinsfile
│   └── trash
│       ├── Jenkinsfile
│       └── extra
└── wearify-infra
    ├── extras
    │   └── Old_resources_code.txt
    ├── file_provisioners.tf
    ├── main.tf
    ├── outputs.tf
    ├── providers.tf
    ├── security_groups.tf
    ├── terraform.tfstate
    ├── variables.tf
    └── worker_private_ips.txt
```

---

## ⚙️ Deployment Workflow

### 1️⃣ Jenkins Provisioning

Go into pipeline/ec2/terraform and run below

```bash
terraform init
terraform apply --auto-approve
```

Terraform does:

- provision EC2 instance
- Install jenkins on instance
- Download jenkins volume from S3 and attaches
- Restarts jenkins

---

### 2️⃣ Deploying infra, app and monitoring - One time deployment

Login to jenkins UI and run wearify-pipeline followed by wearify-monitoring. But real infrastructure is first deployed by wearify-pipeline and then other pipeline.

First pipeline does below:

- Provisions aws infrastructure using terraform
- Configures kubeadm cluster on ec2 nodes using Automation scripts
- Deploys app manifest configurations files
- App starts running

Second pipeline:

- Only deploys monitoring for k8s cluster setup in 1st pipeline

---

### 3️⃣ Demolish deployment

- Run wearify-demolish pipeline to destroy the infrastructure which will wipe out whole cluster within one click

---

## Pre-requisites

- My terraform has my aws creds so it will work but you have to configure yours in the environment
- Same creds have to be fed into jenkins in credentials so pipeline can use while running terraform
- alertmanager config should be updated with right slack webhook URL that is yours
- For wearify application, Sengrid API key and Stripe API keys should be updated with yours else wont work.

## 🌐 Port Configuration

- `32000` → Application UI - Worker IP to be used
- `30900` → Prometheus UI - Master node IP
- `30903` → Alertmanager UI - Master node IP

---

## 🛠 Tech Stack

- Terraform
- Jenkins
- Kubeadm
- Promethus
- MERN
- PostgreSQL

---

## 🔄 CI/CD Status

✔ This is One Time Deployment OR bootstrap.
✔ CICD is implemented for monitoring pipeline but webhook is not enabled.
