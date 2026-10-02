// ============================================
// Skills Data
// ============================================

export const skills = {
  programming_backend: [
    { name: 'Python' },
    { name: 'SQL' },
    { name: 'Flask' },
    { name: 'FastAPI' },
    { name: 'REST APIs' }
  ],
  software_engineering: [
    { name: 'OOP' },
    { name: 'Data Structures & Algorithms' },
    { name: 'SDLC' },
    { name: 'Unit Testing' },
    { name: 'Debugging' },
    { name: 'Troubleshooting' }
  ],
  cloud: [
    { name: 'AWS' },
    { name: 'EC2' },
    { name: 'EKS' },
    { name: 'VPC' },
    { name: 'IAM' }
  ],
  devops_cicd: [
    { name: 'Linux' },
    { name: 'Docker' },
    { name: 'Docker Hub' },
    { name: 'Jenkins' },
    { name: 'CI/CD' },
    { name: 'Containerization' },
    { name: 'Deployment Workflows' }
  ],
  kubernetes: [
    { name: 'Kubernetes Architecture' },
    { name: 'Pods' },
    { name: 'Deployments' },
    { name: 'ReplicaSets' },
    { name: 'Services' },
    { name: 'ConfigMaps' },
    { name: 'Secrets' },
    { name: 'Health Probes' },
    { name: 'Scaling' },
    { name: 'Troubleshooting' }
  ],
  monitoring_observability: [
    { name: 'Prometheus' },
    { name: 'Grafana' },
    { name: 'Application Monitoring' },
    { name: 'Infrastructure Monitoring' }
  ],
  version_control: [
    { name: 'Git' },
    { name: 'GitHub' }
  ],
  ai_ml: [
    { name: 'Machine Learning' },
    { name: 'Deep Learning' },
    { name: 'PyTorch' },
    { name: 'Vision Transformers (ViT)' },
    { name: 'Transfer Learning' },
    { name: 'ECAPA-TDNN' },
    { name: 'SHAP' }
  ]
};

// ============================================
// Projects Data
// ============================================

export const projects = [
  {
    title: 'OncoAI',
    description: 'Engineered a deep learning pipeline using Vision Transformers and transfer learning to classify histopathological images, achieving 91% accuracy on a dataset of 10,000+ images. Optimized model performance through data augmentation, preprocessing, and fine-tuning; built efficient feature extraction and evaluation pipeline.',
    stack: ['Computer Vision', 'Transfer Learning', 'PyTorch', 'ViT', 'Data Augmentation'],
    githubUrl: 'https://github.com/kruthikargowdar',
    liveUrl: null,
  },
  {
    title: 'EchoSphere',
    description: 'Deployed a real-time deepfake audio detection system using ECAPA-TDNN speaker embeddings and an MLP classifier via a FastAPI REST API. Integrated SHAP explainability for interpretable predictions.',
    stack: ['NLP', 'FastAPI', 'REST API', 'Python', 'PyTorch', 'SHAP'],
    githubUrl: 'https://github.com/kruthikargowdar',
    liveUrl: null,
  },
  {
    title: 'AI Resume Analyzer',
    description: 'Developed and deployed a robust CI/CD pipeline for an AI Resume Analyzer. Built containerized environments, configured automated Jenkins workflows for testing and deployment, orchestrated the application on Kubernetes, and established full observability using Prometheus and Grafana.',
    stack: ['Python', 'Flask', 'Docker', 'Jenkins', 'Kubernetes', 'Prometheus', 'Grafana', 'GitHub'],
    githubUrl: 'https://github.com/kruthikargowdar',
    liveUrl: null,
  }
];
