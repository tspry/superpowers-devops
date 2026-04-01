# Observability Starters

Full observability stacks ready to deploy.

## Available

- `prometheus-grafana/` — Prometheus + Grafana + Alertmanager on Docker Compose
- `prometheus-grafana-k8s/` — Same stack on Kubernetes via Helm (kube-prometheus-stack)
- `loki-grafana/` — Loki + Promtail + Grafana for log aggregation

## Quick Start (Docker Compose)

```bash
cd prometheus-grafana
docker compose up -d
# Grafana: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9090
```
