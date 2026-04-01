# Nginx Templates

nginx.conf templates and reverse proxy configs.

## Available

- `reverse-proxy.conf` — Basic reverse proxy to upstream service
- `reverse-proxy-ssl.conf` — Reverse proxy with SSL termination
- `load-balancer.conf` — Upstream load balancer with health checks
- `static-site.conf` — Static file serving
- `websocket.conf` — WebSocket proxy config

## Usage

1. Copy the template that matches your use case
2. Replace `UPSTREAM_HOST`, `UPSTREAM_PORT`, `SERVER_NAME` with your values
3. Test: `nginx -t`
4. Reload: `nginx -s reload`
