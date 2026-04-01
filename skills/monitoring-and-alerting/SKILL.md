---
name: monitoring-and-alerting
description: Use when setting up or debugging Prometheus, Grafana, logging, or alerting
---

# Monitoring & Alerting

## Mode Detection

- **Repo mode** — templates in `tooling/monitoring/`. Scaffold scrape configs, dashboards, alert rules.
- **Chat mode** — user pastes metrics, alert config, or dashboard JSON. Review and suggest fixes.

## Prometheus

### Key concepts
- **Scrape config** — defines where Prometheus pulls metrics from
- **Alert rules** — conditions that trigger alerts
- **Recording rules** — precomputed expensive queries

### Useful PromQL queries
```promql
# CPU usage by pod
rate(container_cpu_usage_seconds_total[5m])

# Memory usage
container_memory_working_set_bytes / container_spec_memory_limit_bytes

# HTTP error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# Pod restarts
increase(kube_pod_container_status_restarts_total[1h])
```

### Alerting rules example
```yaml
groups:
  - name: app-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.service }}"
```

## Grafana

### Debugging dashboards
- Check data source connection: Configuration → Data Sources → Test
- Check query in Explore tab before adding to panel
- Check time range — many "missing data" issues are time range mismatches

## Logging

### What good logs look like
```json
{
  "timestamp": "2026-04-01T10:00:00Z",
  "level": "error",
  "message": "Database connection failed",
  "service": "api",
  "trace_id": "abc123",
  "error": "connection refused"
}
```

### Log querying
```bash
# Kubernetes logs
kubectl logs -l app=myapp --since=1h
kubectl logs -l app=myapp --tail=100

# Journald
journalctl -u myservice -f
journalctl -u myservice --since "1 hour ago"
```

## Tooling Templates

- `tooling/monitoring/prometheus/` — scrape configs, alert rules
- `tooling/monitoring/grafana/` — dashboard JSONs
- `tooling/monitoring/starters/` — full observability stack
