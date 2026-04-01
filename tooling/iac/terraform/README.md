# Terraform Modules

Reusable Terraform modules organized by resource type.

## Structure

```
terraform/
├── aws/
│   ├── vpc/           VPC with public/private subnets
│   ├── eks/           EKS cluster
│   ├── ecs/           ECS cluster + service
│   ├── rds/           RDS instance with parameter group
│   └── s3/            S3 bucket with versioning + encryption
├── gcp/
│   ├── gke/           GKE cluster
│   └── cloud-run/     Cloud Run service
└── azure/
    └── aks/           AKS cluster
```

## Usage

```hcl
module "vpc" {
  source = "./aws/vpc"
  name   = "my-vpc"
  cidr   = "10.0.0.0/16"
}
```

See each module's `variables.tf` for required inputs.
