---
name: dns-and-domains
description: Use when working with DNS records, propagation debugging, or domain routing
---

# DNS & Domains

## Debugging DNS

```bash
# Basic lookup
dig example.com
dig example.com A        # A record (IPv4)
dig example.com AAAA     # IPv6
dig example.com CNAME    # CNAME
dig example.com MX       # mail
dig example.com TXT      # text records (SPF, DKIM, etc.)
dig example.com NS       # nameservers

# Query a specific DNS server
dig @8.8.8.8 example.com

# Check propagation (query authoritative nameserver directly)
dig example.com NS                          # get nameservers
dig @<nameserver> example.com               # query authoritative NS

# Reverse lookup (IP → hostname)
dig -x 1.2.3.4
```

## Common DNS Issues

| Symptom | Cause | Fix |
|---|---|---|
| NXDOMAIN | Record doesn't exist | Create the record |
| Old IP after update | TTL not expired yet | Wait, or lower TTL before changes |
| Works on some networks, not others | Propagation still in progress | Wait up to 48h |
| CNAME conflict | CNAME at root/apex (not allowed) | Use ALIAS/ANAME record instead |
| SSL cert error after DNS change | Old IP cached | Flush local DNS cache |

## Propagation Checking

```bash
# Check from multiple locations
dig @8.8.8.8 example.com      # Google
dig @1.1.1.1 example.com      # Cloudflare
dig @9.9.9.9 example.com      # Quad9

# Local DNS cache flush
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
# Linux
sudo systemd-resolve --flush-caches
# Windows
ipconfig /flushdns
```

## DNS Record Types Quick Reference

| Type | Use |
|---|---|
| `A` | Maps hostname → IPv4 address |
| `AAAA` | Maps hostname → IPv6 address |
| `CNAME` | Alias of another hostname (not at root) |
| `MX` | Mail server for the domain |
| `TXT` | Text data — SPF, DKIM, verification tokens |
| `NS` | Nameservers for the domain |
| `SOA` | Start of authority — zone metadata |
| `PTR` | Reverse DNS (IP → hostname) |

## TTL Strategy

- **Before making changes:** lower TTL to 300s (5 min) — wait for old TTL to expire first
- **After changes are confirmed:** raise TTL back to 3600s (1h) or higher
- **During incidents:** low TTL allows fast rollback
