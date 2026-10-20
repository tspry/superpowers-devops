---
name: infrastructure-provisioning
description: Use when working with Terraform, Ansible, Pulumi, or any IaC tool — enforces plan-before-apply discipline
---

# Infrastructure Provisioning

## The Iron Law

```
NEVER APPLY WITHOUT REVIEWING THE PLAN FIRST
```

Always run `terraform plan` / `ansible --check` / `pulumi preview` and review output before applying. A plan does not prove runtime permissions, dependency health, provider behavior at apply time, or successful rollout. Ansible check mode is incomplete for modules or tasks that do not support it.

## Mode Detection

- **Repo mode** — inspect the project's IaC and state/backend conventions. Check `tooling/README.md` before scaffolding; no Terraform, Ansible, or Pulumi modules are bundled.
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

Saved Terraform plans can contain sensitive values in cleartext even when terminal output redacts them. Store them with restricted access, use them only for the reviewed apply, and remove them according to the project's retention policy.

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

## Terraform state locking

For the S3 backend, prefer `use_lockfile = true` when every state writer uses a compatible Terraform version. Enable S3 bucket versioning for state recovery. Grant the state object only the permissions it needs; the `<key>.tflock` object additionally requires `s3:GetObject`, `s3:PutObject`, and `s3:DeleteObject`.

`dynamodb_table` locking is deprecated. During migration, configure both lock mechanisms while older writers remain, verify every workstation and automation runner supports the S3 lockfile, then remove DynamoDB locking. Do not remove the table or its permissions first.

Never run `terraform force-unlock` until the exact backend/workspace, lock ID, owning operation, and operator are identified and the operation is confirmed stopped. Unlocking an active writer can corrupt state.

## Existing remote resources

`ResourceAlreadyExists` does not imply import. Establish who owns the object, whether another state or stack manages it, the intended Terraform address, and whether adoption is authorized. Before import, back up state with `terraform state pull`; after import, run a plan and reject unexpected changes. If ownership is wrong, coordinate with the owning system instead of creating split management.

## Tooling Templates

`tooling/iac/terraform/` contains guidance only. Generate project-specific IaC and validate with the project's tools; do not present missing modules or starters as copy-ready assets.

## Common Mistakes

| Mistake | Prevention |
|---|---|
| Applying without reviewing plan | Always read the plan output fully |
| Local state in production | Use remote state (S3, GCS, Terraform Cloud) |
| Hardcoded values | Use variables and `.tfvars` files |
| No state locking | For a compatible S3 backend, enable `use_lockfile = true`; migrate legacy DynamoDB locking only after every writer is compatible |
| Over-privileged IAM roles | Use least-privilege, scope to specific resources |
