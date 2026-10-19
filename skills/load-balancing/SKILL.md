---
name: load-balancing
description: Use when working with load balancer configuration, upstream health checks, or traffic distribution
---

# Load Balancing

## Mode Detection

- **Repo mode** — inspect existing load balancer configs and generate changes for the installed platform. Check `tooling/README.md`; load balancer templates are not bundled.
- **Chat mode** — user pastes config or describes traffic issue. Diagnose and provide corrected config.

## Core Concepts

| Algorithm | When to use |
|---|---|
| Round robin | Stateless services, equal capacity upstreams |
| Least connections | Long-lived connections, variable request duration |
| IP hash | Session affinity needed (sticky sessions) |
| Weighted | Upstreams with different capacities |

## Nginx Upstream Config

```nginx
upstream myapp {
    least_conn;
    server 10.0.0.1:3000 weight=3;
    server 10.0.0.2:3000 weight=1;
    server 10.0.0.3:3000 backup;      # only used if others fail

    keepalive 32;                       # reuse upstream connections
}

server {
    location / {
        proxy_pass http://myapp;
        proxy_next_upstream error timeout http_502 http_503;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}
```

## Health Checks

**Passive (Nginx default):** marks upstream as failed after N consecutive errors.
```nginx
upstream myapp {
    server 10.0.0.1:3000 max_fails=3 fail_timeout=30s;
}
```

**Active (Nginx Plus / OpenResty):** proactively polls upstream health endpoint.

**Kubernetes readinessProbe:**
```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```

## Debugging Traffic Distribution

```bash
# Check Nginx upstream status (if status module enabled)
curl http://localhost/nginx_status

# Watch access logs to verify distribution
tail -f /var/log/nginx/access.log | awk '{print $7}'

# Test upstream directly
curl -v http://10.0.0.1:3000/health
curl -v http://10.0.0.2:3000/health
```

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| All traffic to one upstream | Sticky sessions / IP hash | Check algorithm config |
| Upstream marked down incorrectly | Health check too aggressive | Increase `fail_timeout`, check health endpoint |
| 502 during deploy | Old connections to stopped pod | Use `proxy_next_upstream` to retry |
| Uneven distribution | Weight mismatch or keepalive skewing | Review weights and keepalive settings |
