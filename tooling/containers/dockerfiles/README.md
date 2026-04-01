# Base Dockerfiles

Multi-stage Dockerfiles by runtime. All use pinned base image versions and run as non-root.

## Available

- `node.Dockerfile` — Node.js app (Alpine, non-root, multi-stage)
- `python.Dockerfile` — Python app (slim, non-root, multi-stage)
- `go.Dockerfile` — Go app (scratch final stage, minimal image)
- `java.Dockerfile` — Java/Spring Boot app (JRE only in final stage)
- `nginx.Dockerfile` — Static files served by Nginx

Copy and customize for your project.
