---
name: infrastructure-provisioning
description: Use when working with Terraform, Ansible, Pulumi, or any IaC tool — enforces plan-before-apply discipline
---

# Infrastructure Provisioning

## The Iron Law

```
NEVER APPLY WITHOUT REVIEWING THE PLAN FIRST
```

Always run `terraform plan` / `ansible --check` / `pulumi preview` and review output before applying.

## Mode Detection

- **Repo mode** — IaC files available in `tooling/iac/`. Scaffold, modify, and run commands.
- **Chat mode** — user pastes IaC code or error output. Provide inline review and corrected snippets.

## Process

### 1. Understand the change
- What resource is being created, modified, or destroyed?
- What are the dependencies?
- Is this change reversible?

### 2. Plan before apply
```bash
# Terraform
terraform init
terraform plan -out=tfplan
# Review tfplan carefully before proceeding

# Ansible
ansible-playbook site.yml --check --diff

# Pulumi
pulumi preview
```

### 3. Review the plan
Look for:
- Unexpected destroys (a `destroy` when you expected an `update`)
- Resources being replaced vs updated in-place
- Sensitive value changes
- Count of resources affected — does it match expectations?

### 4. Apply with confirmation
```bash
terraform apply tfplan
# or
pulumi up
```

### 5. Verify after apply
- Check resources exist in the cloud console or CLI
- Run `terraform show` / `pulumi stack` to confirm state
- Test that dependent services still work

## Tooling Templates

Generic modules: `tooling/iac/terraform/`, `tooling/iac/ansible/`, `tooling/iac/pulumi/`
Opinionated starters: `tooling/iac/starters/`

## Common Mistakes

| Mistake | Prevention |
|---|---|
| Applying without reviewing plan | Always read the plan output fully |
| Local state in production | Use remote state (S3, GCS, Terraform Cloud) |
| Hardcoded values | Use variables and `.tfvars` files |
| No state locking | Enable state locking (DynamoDB for AWS) |
| Over-privileged IAM roles | Use least-privilege, scope to specific resources |
