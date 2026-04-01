---
name: reverse-proxy
description: Use when working with Nginx, Traefik, or HAProxy — setup, config debugging, SSL termination, routing
---

# Reverse Proxy

## Mode Detection

- **Repo mode** — templates in `tooling/network/`. Scaffold or modify proxy configs.
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
| 504 Gateway Timeout | Increase `proxy_read_timeout` and `proxy_connect_timeout` |
| 413 Request Too Large | Increase `client_max_body_size` |
| SSL handshake error | Check cert validity, check `ssl_protocols` |
| `connect() failed (111: Connection refused)` | Wrong upstream port or service not running |

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

- `tooling/network/nginx/` — nginx.conf templates, reverse proxy configs
- `tooling/network/traefik/` — traefik.yml, dynamic configs
- `tooling/network/haproxy/` — haproxy.cfg templates
- `tooling/network/starters/` — full reverse proxy + SSL setups
