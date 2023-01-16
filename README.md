# CI/CD Kubernetes
This is a guide for creating CI/CD Kubernetes. We use GitOps pull-based model. 

Tech Stack:
- GitLab
- ArgoCD
- Kubernetes
- Kustomize
- SOPS

### Workflow

1. Developer make changes, PR and merge.
2. GitLab CI triggered
   - Build Docker Image
   - Push Docker Image to Docker Registry
   - Clone Kubernetes Manifest Repository
   - Update Image Tag in manifest
   - Commit and Push to Kubernetes Manifest Repository
3. Argo CD Synchronize and Deploy Manifest

The workflow is like the diagram below. (We don't use HELM, we use Kustomize).
![alt text](https://miro.medium.com/max/1400/1*9q37KuHZFWC7XOZRSQpJ6Q.png)

### Repository
There are 2 repo:
- application repo which is store content of nodejsapp directory.
- manifest repo which is store content of kubemanifest directory.

### Security
We use variables in gitlab to store credentials used by the gitlab pipeline. <br>
For kubernetes secret manifest/file, we secure it using SOPS and AWS KMS.

### Testing
We can use kind (kubernetes in docker) for testing

Create Cluster and Ingress Controller Component using Kind (https://kind.sigs.k8s.io/docs/user/ingress/)
```
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```
Apply Ingress Controller
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```
Finally apply content of kubemanifest, apply argocd manifest is enough (other application will autosync).
```
cd infra/argocd
kubectl create ns argocd
kustomize build --enable-alpha-plugins . | kubectl apply -f -
```

I also have another post/article regarding Kubernetes CI/CD (https://medium.com/@didil.mfs).
- CI/CD Kubernetes using kubectl (https://medium.com/@didil.mfs/belajar-ci-cd-sederhana-gitlab-dan-kubernetes-part-1-9091c508d183)
- CI/CD Kubernetes using Helm (https://medium.com/@didil.mfs/belajar-ci-cd-sederhana-gitlab-dan-kubernetes-part-2-325f621be907)
- CI/CD Kubernetes using Flux CD (https://medium.com/@didil.mfs/belajar-ci-cd-sederhana-gitlab-dan-kubernetes-part-3-c57526f6f7f8)
