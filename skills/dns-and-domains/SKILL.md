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
| NXDOMAIN | Record, delegation, or negative cache does not resolve | Compare authoritative SOA/record data with resolver answers and negative TTL |
| Old answer after update | A resolver may still hold an answer for the TTL published before the change | Compare TTLs and authoritative/current resolver answers; wait only for the measured cache lifetime |
| Networks disagree | Resolver caches, split-horizon DNS, delegation, DNSSEC, or stale authoritative servers differ | Query the affected resolver and each authoritative server; do not substitute a generic propagation wait |
| CNAME conflict | CNAME is incompatible with another record at the same owner name | Use a provider-supported apex alias only when its semantics fit |
| Certificate error after DNS change | Traffic may reach different endpoints or serve a mismatched certificate | Resolve from affected networks and inspect the certificate served by each resulting endpoint |

## Propagation Checking

```bash
# Check from multiple locations
dig @8.8.8.8 example.com      # Google
dig @1.1.1.1 example.com      # Cloudflare
dig @9.9.9.9 example.com      # Quad9

# Local DNS cache flush (only after capturing the stale answer)
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
# Linux with systemd-resolved
sudo resolvectl flush-caches
# Older systemd releases may use: sudo systemd-resolve --flush-caches
# Windows
ipconfig /flushdns
```

For stale answers, record the queried name/type, old and new values, previous TTL, authoritative nameservers, SOA negative-caching values, delegation, and the exact affected resolver. Query authoritative servers directly, then compare recursive resolvers. Flushing one client cache cannot change upstream resolver caches.

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

- **Before making changes:** choose a TTL from the change risk, rollback target, query load, and provider limits. Lower it far enough in advance for the previously published TTL to expire.
- **After changes are confirmed:** restore the approved operational TTL after authoritative data and affected recursive resolvers return the intended answer.
- **During incidents:** do not treat a TTL edit as an immediate cache purge. Existing positive and negative cache entries can remain until their current TTL expires; a lower TTL affects subsequent answers and increases authoritative query load.
