---
name: reverse-proxy
description: Use when working with Nginx, Traefik, or HAProxy — setup, config debugging, SSL termination, routing
---

# Reverse Proxy

## Mode Detection

- **Repo mode** — inspect existing proxy configs; check `tooling/README.md` before scaffolding. Proxy templates are not bundled.
- **Chat mode** — user pastes config or error. Diagnose and provide corrected config.

## Nginx

### Test and reload config (never restart)
```bash
nginx -t                        # test config syntax
nginx -s reload                 # reload without downtime
systemctl reload nginx          # alternative
```

### Basic reverse proxy config
```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt
```bash
certbot --nginx -d example.com
certbot renew --dry-run          # test auto-renewal
```

### Debugging common errors

| Error | First check |
|---|---|
| 502 Bad Gateway | Is the upstream running? `curl localhost:3000` |
| 504 Gateway Timeout | Compare timestamps/traces across DNS, connect, TLS, queue, application, dependency, and response-read phases |
| 413 Request Too Large | Increase `client_max_body_size` |
| SSL handshake error | Check cert validity, check `ssl_protocols` |
| `connect() failed (111: Connection refused)` | Wrong upstream port or service not running |

A larger timeout is not a default fix. Establish the end-to-end latency budget, identify the phase that exhausted it, and correct that cause. Change a proxy timeout only when the intended request duration exceeds the current budget; bound the change, consider concurrency/resource impact, verify latency and error rates, and retain the previous value for rollback.

### Useful debug commands
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
nginx -T                         # dump full merged config
```

## Traefik

### Dynamic config check
```bash
# Traefik dashboard (if enabled): http://localhost:8080
# Check router/service status in dashboard
```

### Common issues
| Issue | Fix |
|---|---|
| Router not matching | Check `rule` syntax — Host, Path, PathPrefix |
| TLS not working | Check `certResolver` name matches static config |
| Service unreachable | Check `loadBalancer.servers[].url` format |

## HAProxy

### Test and reload config
```bash
haproxy -c -f /etc/haproxy/haproxy.cfg    # test config
systemctl reload haproxy                   # reload
```

## Tooling Templates

- `tooling/network/nginx/` — guidance only. Generate Nginx, Traefik, or HAProxy configs for the installed version and validate them; no proxy starters are bundled.
