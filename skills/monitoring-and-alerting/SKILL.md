---
name: monitoring-and-alerting
description: Use when setting up or debugging Prometheus, Grafana, logging, or alerting
---

# Monitoring & Alerting

## Mode Detection

- **Repo mode** — inspect the installed metrics stack. Check `tooling/README.md`; monitoring templates are not bundled. Generate and validate configs against actual metric names and labels.
- **Chat mode** — user pastes metrics, alert config, or dashboard JSON. Review and suggest fixes.

## Prometheus

### Key concepts
- **Scrape config** — defines where Prometheus pulls metrics from
- **Alert rules** — conditions that trigger alerts
- **Recording rules** — precomputed expensive queries

### Useful PromQL queries
```promql
# CPU cores used by pod (exclude infra/empty containers)
sum by (namespace, pod) (rate(container_cpu_usage_seconds_total{container!="",container!="POD"}[5m]))

# Memory usage
container_memory_working_set_bytes / container_spec_memory_limit_bytes

# HTTP error fraction by service; zero when traffic has no 5xx series.
# No traffic yields no result. Missing scrapes need a separate availability alert.
(
  (sum by (service) (rate(http_requests_total{status=~"5.."}[5m]))
   or 0 * sum by (service) (rate(http_requests_total[5m])))
  / sum by (service) (rate(http_requests_total[5m]))
) and on (service) (sum by (service) (rate(http_requests_total[5m])) > 0)

# Pod restarts
increase(kube_pod_container_status_restarts_total[1h])
```

### Alerting rules example
```yaml
groups:
  - name: app-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          (
            (sum by (service) (rate(http_requests_total{status=~"5.."}[5m]))
             or 0 * sum by (service) (rate(http_requests_total[5m])))
            / sum by (service) (rate(http_requests_total[5m]))
          ) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "HTTP 5xx fraction above 5% on {{ $labels.service }}"
```

These examples assume a `service` label and `status` codes. Adapt both to the exporter before use. Aggregate away status, instance, and route labels before division. Unit-test normal traffic, >5% errors, no 5xx series, and zero traffic with `promtool test rules`; schema validity alone does not prove alert behavior.

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

- `tooling/monitoring/starters/` — guidance only. No scrape configs, dashboards, or observability stacks are bundled.
