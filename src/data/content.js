export const projects = [
  {
    id: "agentic-ledger",
    title: "AGENTIC LEDGER",
    tagline: "Autonomous multi-agent financial engine.",
    description: "Built on Phinite OS. Leverages PyTorch LSTMs and FastAPI to dynamically underwrite SMB micro-loans and prevent transaction fraud in real-time.",
    tech: ["PyTorch", "FastAPI", "Python", "Phinite OS"],
    metrics: ["Real-time fraud prevention", "Dynamic underwriting"],
    link: "https://github.com/Vaibhav8075/Agentic-Ledger",
    github: "https://github.com/Vaibhav8075/Agentic-Ledger",
    type: "AI/SYSTEMS",
    featured: true
  },
  {
    id: "physics-cnn",
    title: "PHYSICS-AUGMENTED 1D-CNN",
    tagline: "Industrial fault diagnosis system.",
    description: "Engineered a predictive maintenance and condition monitoring model using a physics-informed 1D Convolutional Neural Network for industrial bearing analysis.",
    tech: ["Python", "TensorFlow", "Deep Learning", "Signal Processing"],
    metrics: ["Condition Monitoring", "Predictive Maintenance"],
    link: "https://github.com/Vaibhav8075/-Physics-Augmented-1D-CNN",
    github: "https://github.com/Vaibhav8075/-Physics-Augmented-1D-CNN",
    type: "ML/RESEARCH",
    featured: true
  },
  {
    id: "audict",
    title: "FINANCIAL AUDIO AI",
    tagline: "End-to-end AI speech pipeline.",
    description: "Architected an asynchronous FastAPI backend utilizing Celery and Redis to process audio streams via OpenAI Whisper for custom NLP risk-signal detection.",
    tech: ["FastAPI", "Celery", "Redis", "Whisper", "NLP"],
    metrics: ["Asynchronous processing", "Risk-signal detection"],
    link: "https://github.com/Vaibhav8075/Audict-audio-Technology",
    github: "https://github.com/Vaibhav8075/Audict-audio-Technology",
    type: "BACKEND/AI",
    featured: true
  },
  {
    id: "iot-ml",
    title: "IoT SMART MONITORING",
    tagline: "Edge ML telemetry network.",
    description: "Integrated a Random Forest classifier with ESP32 hardware to process sensor data locally, reducing false alarms by 25% with real-time cloud connectivity.",
    tech: ["ESP32", "Python", "Random Forest", "IoT"],
    metrics: ["25% false alarm reduction", "Real-time edge inference"],
    link: "https://github.com/Vaibhav8075/IOT-ML-Project",
    github: "https://github.com/Vaibhav8075/IOT-ML-Project",
    type: "HARDWARE/ML",
    featured: true
  },
  {
    id: "semantic-seg",
    title: "AUTONOMOUS VISION",
    tagline: "Semantic segmentation for road scenes.",
    description: "Trained and evaluated deep learning models for autonomous driving capable of classifying each pixel of an image into meaningful categories in real-time.",
    tech: ["Deep Learning", "Computer Vision", "Python"],
    metrics: ["Real-time interpretation", "Pixel-level classification"],
    link: "https://github.com/Vaibhav8075/Semantic-Segmentation-for-Autonomous-Driving-",
    github: "https://github.com/Vaibhav8075/Semantic-Segmentation-for-Autonomous-Driving-",
    type: "CV/AI",
    featured: false
  },
  {
    id: "mossx",
    title: "MOSSX PLATFORM",
    tagline: "Frontend architecture & UI/UX engineering.",
    description: "Modular React component architectures and high-performance interactive interfaces sustaining 60 FPS animation pipelines via Framer Motion and Zustand.",
    tech: ["React", "Framer Motion", "Zustand", "Tailwind"],
    metrics: ["60 FPS performance", "40% code reusability increase"],
    link: "https://github.com/Moss-X/Website",
    github: "https://github.com/Moss-X/Website",
    type: "FRONTEND",
    featured: false
  }
];

export const experience = [
  {
    id: "mossx-dev",
    role: "FRONTEND DEVELOPER",
    company: "MOSSX",
    period: "2025.06 — PRESENT",
    description: "Engineered modular React component architectures, improving code reusability by 40%. Built sustained 60 FPS animation pipelines using Framer Motion and implemented Zustand global state."
  },
  {
    id: "dcm",
    role: "SOFTWARE ENGINEERING INTERN",
    company: "DCM SHRIRAM LTD.",
    period: "2026.05 — 2026.07",
    description: "Architected an enterprise audit management platform. Handled database migrations (SQLite to PostgreSQL) and configured Linux networking (MPLS, VPN). Deployed production servers via Nginx and Uvicorn."
  },
  {
    id: "aarvasa",
    role: "FRONTEND DEVELOPER INTERN",
    company: "AARVASA",
    period: "2026.01 — 2026.05",
    description: "Delivered over 20 responsive components with high-fidelity design accuracy. Built highly interactive interfaces using GSAP and optimized REST API integrations."
  },
  {
    id: "sammard",
    role: "SOFTWARE DIVISION MEMBER",
    company: "TEAM SAMMARD (VIT ROCKETRY)",
    period: "2025.05 — 2025.10",
    description: "Built a real-time Ground Control Station (GCS) telemetry dashboard via WebSocket pipelines. Integrated hardware-level ESP32 avionics streams into flight simulation frameworks."
  }
];

export const skills = {
  languages: ["Python", "C++", "TypeScript", "SQL"],
  frontend: ["React", "Next.js", "Three.js", "Tailwind CSS", "Framer Motion"],
  backend: ["FastAPI", "Node.js", "PostgreSQL", "Redis", "Celery"],
  systems: ["Linux", "Nginx", "Docker", "ESP32", "WebSockets"],
  ai: ["PyTorch", "Scikit-Learn", "Computer Vision", "Whisper NLP"]
};
