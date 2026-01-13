# TODO List

## Features

- [ ] **Add full Google OAuth implementation**
  - Fix TypeScript issues in oauth.ts
  - Complete Google OAuth flow
  - Add error handling and session management

## Infrastructure & Learning

- [ ] **Add Kubernetes configurations (for learning)**
  - [ ] Create basic K8s Deployments and Services for all services
    - Backend deployment and service
    - Frontend deployment and service
    - ML service deployment and service
  - [ ] Add ConfigMaps and Secrets for environment variables
  - [ ] Create Ingress configuration for routing
  - [ ] Add PostgreSQL StatefulSet or external DB config
  - [ ] Configure liveness and readiness probes
  - [ ] Set resource requests and limits for pods
  - [ ] Write K8s deployment documentation
    - Setup instructions for minikube/kind
    - kubectl commands reference
    - Troubleshooting guide

---

## Notes

- Kubernetes setup is for local learning (minikube/kind)
- Current production deployment uses Railway + Vercel
- K8s tasks build progressively from basic to advanced concepts
