---
name: code-optimization
description: Use when analyzing code for performance issues, memory leaks, inefficient loops, blocking calls, and resource waste
---

# Code Optimization

## Works In Both Modes

- **Repo mode** — analyze actual source files
- **Chat mode** — analyze pasted code snippets

## What to Look For

### Memory Leaks

- Connections opened but never closed (DB, HTTP, file handles)
- Event listeners added but never removed
- Unbounded in-memory caches or queues (grows forever)
- Objects held in global scope that should be request-scoped
- Circular references preventing garbage collection

### Inefficient Loops & Algorithms

- N+1 query patterns (DB query inside a loop)
- Nested loops over large datasets (O(n²) or worse)
- Repeated computation of the same value inside a loop (move outside)
- Sorting inside a loop (sort once, outside)
- Linear search where a map/set lookup would be O(1)

### Blocking Operations

- Synchronous file I/O in an async/event-driven service
- Blocking network calls on the main thread
- CPU-intensive work blocking an event loop (Node.js, Python asyncio)
- Long-running DB queries without timeout

### Container & Infrastructure Waste

- Oversized Docker images (unnecessary packages, dev deps in prod image)
- Redundant image layers (multiple `RUN` commands that could be combined)
- CPU/memory limits set far above actual usage
- Idle replicas with no autoscaling configured
- Logs written to disk inside container instead of stdout

### Common Language Patterns

**Python:**
- `list.append()` in a loop where a list comprehension would do
- `+` string concatenation in a loop (use `join`)
- Reading entire file into memory when streaming is possible

**JavaScript/Node:**
- `Promise` chains that could run in parallel (`Promise.all`)
- `console.log` left in hot paths
- Synchronous `fs` methods (`fs.readFileSync`) in async handlers

**Go:**
- Goroutine leaks (goroutines started but never terminated)
- Mutex held too long — narrow the critical section
- Unnecessary allocations in hot paths

## Reporting Format

For each finding:

```
[SEVERITY] Type — Description
  Location: file:line or "pasted code, line X"
  Impact: what this costs (memory, CPU, latency, etc.)
  Fix: specific change to make
  Example:
    Before: <bad code>
    After:  <fixed code>
```

Severity: **HIGH** (causes real degradation), **MEDIUM** (wastes resources), **LOW** (minor improvement).
