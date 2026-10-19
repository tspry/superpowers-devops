---
name: network-operations
description: Use when working with IPs, ports, firewall rules, routing, or diagnosing network connectivity issues
---

# Network Operations

## Mode Detection

- **Repo mode** — can read and modify firewall configs, network manifests, cloud security group definitions.
- **Chat mode** — user describes connectivity issue or pastes output. Provide diagnosis and commands.

## Connectivity Debugging Toolkit

```bash
# Is the port open and listening?
ss -tlnp | grep <port>
netstat -tlnp | grep <port>

# Can you reach the host?
ping <host>
traceroute <host>

# Is the port reachable?
telnet <host> <port>
nc -zv <host> <port>
curl -v http://<host>:<port>/health

# DNS resolution
dig <hostname>
nslookup <hostname>
host <hostname>

# What's using a port?
lsof -i :<port>
fuser <port>/tcp
```

## Firewall (Linux — iptables / ufw / firewalld)

Before changing rules or routes, confirm the host/account and authorized source CIDRs, save the current rules, review the diff, and obtain approval. For remote hosts, keep the current SSH session, verify an alternate console/recovery path, and test a second SSH connection before closing the first. Preserve management access; never deny SSH or flush rules as a generic fix. Provide a tool-specific rollback and test allowed **and denied** traffic from the intended sources.

```bash
# ufw (Ubuntu)
ufw status verbose
ufw allow 443/tcp
ufw reload

# firewalld (CentOS/RHEL)
firewall-cmd --list-all
firewall-cmd --add-port=443/tcp --permanent
firewall-cmd --reload

# iptables (direct)
iptables -L -n -v
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## Cloud Security Groups

**AWS:**
```bash
# List security group rules
aws ec2 describe-security-groups --group-ids sg-xxxxxxxx

# Add inbound rule only after scope/approval review; replace with the actual source CIDR
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp --port 443 --cidr <approved-source-cidr>
```

**GCP:**
```bash
gcloud compute firewall-rules list
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 --source-ranges <approved-source-cidr> --target-tags <target-tag>
```

## Common Network Issues

| Symptom | Diagnosis |
|---|---|
| Connection refused | Service not running or wrong port |
| Connection timed out | Firewall blocking, wrong IP, routing issue |
| No route to host | Routing table, VPC/subnet misconfiguration |
| Intermittent drops | MTU mismatch, packet loss — run `mtr` |
| DNS not resolving | DNS server unreachable, wrong search domain |

## IP & Routing

```bash
ip addr show                     # list interfaces and IPs
ip route show                    # routing table
ip route add 10.0.0.0/8 via <gateway>  # add route

# For Kubernetes pod networking
kubectl get pods -o wide          # pod IPs
kubectl get svc                   # service IPs and ports
kubectl get networkpolicy         # network policies
```
