// ============================================
// Skills Data
// ============================================

export const skills = {
  software_engineering: [
    { name: 'Python' },
    { name: 'SQL' },
    { name: 'Data Structures' },
    { name: 'OOP' },
    { name: 'Data Pipeline' }
  ],
  backend_apis: [
    { name: 'FastAPI' },
    { name: 'Flask' },
    { name: 'REST API' },
    { name: 'HTML' },
    { name: 'CSS' },
    { name: 'Streamlit' }
  ],
  cloud_devops: [
    { name: 'AWS' },
    { name: 'Linux' },
    { name: 'Docker' },
    { name: 'Kubernetes' },
    { name: 'CI/CD' }
  ],
  version_control: [
    { name: 'Git' },
    { name: 'GitHub' },
    { name: 'Agile' }
  ],
  ai_ml: [
    { name: 'Machine Learning' },
    { name: 'Deep Learning' },
    { name: 'Computer Vision' },
    { name: 'NLP' },
    { name: 'Transfer Learning' },
    { name: 'Model Deployment' },
    { name: 'PyTorch' },
    { name: 'Scikit-learn' },
    { name: 'Pandas' },
    { name: 'NumPy' },
    { name: 'SHAP' },
    { name: 'Explainable AI' }
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
    description: 'Trained a logistic regression model on historical student data; applied SHAP feature importance analysis to identify the top placement drivers. Delivered an interactive Streamlit UI enabling recruiters and students to explore predictions in real time.',
    stack: ['Machine Learning', 'Streamlit', 'Explainable AI', 'Scikit-learn', 'SHAP'],
    githubUrl: 'https://github.com/kruthikargowdar',
    liveUrl: null,
  }
];
