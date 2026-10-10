export const profile = {
  name: "Vaibhav Goel",
  email: "vaibhav.goel0531@gmail.com",
  github: "https://github.com/Vaibhav8075",
  linkedin: "https://www.linkedin.com/in/vaibhav-goel-23983b344",
  resume: "/Vaibhav-Goel-Resume.pdf"
};

export const projects = [
  {
    id: "agentic-ledger",
    title: "AGENTIC LEDGER",
    tagline: "Autonomous multi-agent financial engine.",
    description: "Four Phinite OS agents for Paytm merchants: they catch fake-payment spoofs in under 200 ms and use a PyTorch LSTM revenue forecast to underwrite instant micro-loans for supplier bills.",
    tech: ["PyTorch", "FastAPI", "Python", "Docker", "Phinite OS"],
    metrics: ["94% revenue-forecast accuracy", "<200 ms spoof check"],
    github: "https://github.com/Vaibhav8075/Agentic-Ledger",
    type: "AI/SYSTEMS",
    domains: ["ai", "backend"]
  },
  {
    id: "physics-1d-cnn",
    title: "PHYSICS-AUGMENTED 1D-CNN",
    tagline: "An honest evaluation of bearing-fault diagnosis.",
    description: "A dual-stream 1D-CNN with a physics-based residual filter, tested under leakage-free protocols on the CWRU and Paderborn datasets. The ~99% accuracies common in the literature collapse once the test bearings are truly unseen.",
    tech: ["PyTorch", "Python", "Scikit-Learn", "ONNX", "Signal Processing"],
    metrics: ["3 protocols, 2 datasets, 9 models", "0.30 ms INT8 inference on CPU"],
    github: "https://github.com/Vaibhav8075/-Physics-Augmented-1D-CNN",
    type: "ML/RESEARCH",
    domains: ["ai"]
  },
  {
    id: "banking-call-intelligence",
    title: "BANKING CALL INTELLIGENCE",
    tagline: "Hybrid rules + AI analysis of financial calls.",
    description: "Transcribes banking calls with Whisper, runs a deterministic rule engine for intent, risk and PII masking, and layers an AI verifier on top that falls back to the rules whenever its confidence is low.",
    tech: ["FastAPI", "Whisper", "React", "Python"],
    metrics: ["Rule-based fallback for every decision", "PII masking, JWT auth, rate limiting"],
    github: "https://github.com/Vaibhav8075/Financial-Technology",
    type: "BACKEND/AI",
    domains: ["ai", "backend"]
  },
  {
    id: "iot-fire-detection",
    title: "IoT FIRE DETECTION",
    tagline: "Multi-sensor fire detection with a digital twin.",
    description: "Fuses five sensors on an ESP32-S3 and classifies each reading as normal, warning or fire with a Random Forest trained on 367,550 real sensor rows, streamed to a live Dash digital twin.",
    tech: ["ESP32", "Python", "Scikit-Learn", "Flask", "Dash"],
    metrics: ["94.93% test accuracy", "98% fire recall"],
    github: "https://github.com/Vaibhav8075/IOT-ML-Project",
    type: "HARDWARE/ML",
    domains: ["ai", "hardware"]
  },
  {
    id: "road-segmentation",
    title: "ROAD SCENE SEGMENTATION",
    tagline: "Pixel-level perception for autonomous driving.",
    description: "Labels every pixel of a road scene with one of seven classes. Four interchangeable architectures (U-Net, ResNet50-UNet, DeepLabV3+, SegFormer) train with a combined CE + Dice + Focal loss, plus Grad-CAM explanations and ONNX export.",
    tech: ["PyTorch", "Computer Vision", "Python", "ONNX"],
    metrics: ["4 architectures, 7 classes", "Grad-CAM explainability"],
    github: "https://github.com/Vaibhav8075/Semantic-Segmentation-for-Autonomous-Driving-",
    type: "CV/AI",
    domains: ["ai"]
  },
  {
    id: "mossx",
    title: "MOSSX PLATFORM",
    tagline: "Frontend for a full-stack e-commerce platform.",
    description: "Reusable React components across 6–8 production features of an e-commerce platform with guest carts, coupons, Stripe and Razorpay checkout and admin analytics. Framer Motion views hold 60 FPS and Zustand manages the async dashboard data.",
    tech: ["React", "Framer Motion", "Zustand", "Tailwind CSS"],
    metrics: ["40% more code reuse", "60 FPS animated views"],
    github: "https://github.com/Moss-X/Website",
    live: "https://mossx.in/",
    type: "FRONTEND",
    domains: ["frontend"]
  }
];

export const domains = [
  { id: "ai", label: "AI / ML" },
  { id: "backend", label: "Backend" },
  { id: "hardware", label: "Hardware" },
  { id: "frontend", label: "Frontend" }
];

export const experience = [
  {
    id: "mossx-dev",
    role: "FRONTEND DEVELOPER",
    company: "MOSSX",
    period: "2025.06 — PRESENT",
    description: "Engineered modular React component architectures, improving code reusability by 40%. Built sustained 60 FPS animation pipelines using Framer Motion and implemented Zustand global state.",
    tech: ["React", "Framer Motion", "Zustand"]
  },
  {
    id: "dcm",
    role: "SOFTWARE ENGINEERING INTERN",
    company: "DCM SHRIRAM LTD.",
    period: "2026.05 — 2026.07",
    description: "Architected an enterprise audit management platform. Handled database migrations (SQLite to PostgreSQL) and configured Linux networking (MPLS, VPN). Deployed production servers via Nginx and Uvicorn.",
    tech: ["PostgreSQL", "SQLite", "Linux", "Nginx", "Uvicorn"]
  },
  {
    id: "aarvasa",
    role: "FRONTEND DEVELOPER INTERN",
    company: "AARVASA",
    period: "2026.01 — 2026.05",
    description: "Delivered over 20 responsive components with high-fidelity design accuracy. Built highly interactive interfaces using GSAP and optimized REST API integrations.",
    tech: ["GSAP", "REST APIs"]
  },
  {
    id: "sammard",
    role: "SOFTWARE DIVISION MEMBER",
    company: "TEAM SAMMARD (VIT ROCKETRY)",
    period: "2025.05 — 2025.10",
    description: "Built a real-time Ground Control Station (GCS) telemetry dashboard via WebSocket pipelines. Integrated hardware-level ESP32 avionics streams into flight simulation frameworks.",
    tech: ["WebSockets", "ESP32"]
  }
];

export const skills = {
  languages: ["Python", "C++", "TypeScript", "SQL"],
  frontend: ["React", "Next.js", "Three.js", "Tailwind CSS", "Framer Motion"],
  backend: ["FastAPI", "Node.js", "PostgreSQL", "Redis", "Celery"],
  systems: ["Linux", "Nginx", "Docker", "ESP32", "WebSockets"],
  ai: ["PyTorch", "Scikit-Learn", "Computer Vision", "Whisper"]
};
