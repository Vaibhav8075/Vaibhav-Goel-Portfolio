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
    id: "call-audit-platform",
    title: "CALL AUDIT PLATFORM",
    tagline: "AI-assisted call QA, shipped to production at DCM Shriram.",
    description: "Admins upload call recordings; Whisper transcribes them and Llama 3.3 scores quality, CSAT and sentiment. Agents self-evaluate and HODs rate compliance. Audio only streams through JWT-authenticated blobs and is purged on a schedule.",
    tech: ["React", "FastAPI", "PostgreSQL", "Whisper", "Nginx"],
    metrics: ["Production move from SQLite to PostgreSQL", "3 roles, no public audio URLs"],
    github: "https://github.com/Vaibhav8075/Audict-audio-Technology",
    type: "FULL-STACK/AI",
    domains: ["backend", "frontend", "ai"]
  },
  {
    id: "java-safe-cpp",
    title: "JAVA-SAFE C++",
    tagline: "A memory-safe compiler and VM for a subset of C++.",
    description: "A from-scratch compiler in C++17 with a lexer, recursive-descent parser, semantic analysis and code generator. It injects null checks, bounds checks and reference counting into custom bytecode for a stack-based VM.",
    tech: ["C++", "Compilers", "Virtual Machines", "CMake"],
    metrics: ["No LLVM, Lex or Yacc", "4 injected safety opcodes"],
    github: "https://github.com/Vaibhav8075/Compiler",
    type: "SYSTEMS",
    domains: ["systems"]
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
  { id: "frontend", label: "Frontend" },
  { id: "systems", label: "Systems" }
];

export const experience = [
  {
    id: "mossx-dev",
    role: "FRONTEND DEVELOPER",
    company: "MOSSX",
    period: "2025.06 — PRESENT",
    description: "Organised reusable React components for 6–8 production features (dashboards, API pages and responsive layouts), improving code reuse by 40%. Built Framer Motion animations that hold 60 FPS in complex views, with async dashboard data managed in Zustand.",
    tech: ["React", "Framer Motion", "Zustand"]
  },
  {
    id: "dcm",
    role: "SOFTWARE ENGINEERING INTERN",
    company: "DCM SHRIRAM LTD.",
    period: "2026.05 — 2026.07",
    description: "Built and supported an audit management system in React, FastAPI and PostgreSQL for secure call-audio handling and QA reviews. Moved production from SQLite to PostgreSQL, deployed on Ubuntu with Nginx and Uvicorn, and added role-based auth, protected audio storage and automatic retention. Also gained hands-on exposure to MPLS, VPN and Linux networking.",
    tech: ["React", "FastAPI", "PostgreSQL", "Nginx", "Linux"],
    caseStudy: "call-audit-platform"
  },
  {
    id: "aarvasa",
    role: "FRONTEND DEVELOPER INTERN",
    company: "AARVASA",
    period: "2026.01 — 2026.05",
    description: "Produced 20+ React and Tailwind CSS components from Figma (navigation, heroes, forms, cards, dashboards and tables) across mobile, tablet and desktop. Integrated REST APIs and GSAP/Framer Motion animations with the backend and design teams without compatibility breaks.",
    tech: ["React", "Tailwind CSS", "GSAP", "Framer Motion", "REST APIs"]
  },
  {
    id: "sammard",
    role: "SOFTWARE TEAM MEMBER",
    company: "TEAM SAMMARD (VIT ROCKET TEAM)",
    period: "2025.05 — 2025.10",
    description: "Developed a Ground Control Station dashboard for ground and flight tests, streaming live altitude, velocity and multi-sensor telemetry over WebSockets, and fed ESP32 avionics data into the simulation pipeline.",
    tech: ["WebSockets", "ESP32"]
  }
];

export const skills = {
  languages: ["Python", "C++", "JavaScript", "TypeScript"],
  frontend: ["React", "Next.js", "Tailwind CSS", "Three.js", "Framer Motion", "GSAP", "Zustand"],
  backend: ["FastAPI", "Node.js", "PostgreSQL", "REST APIs", "Redis", "Celery"],
  systems: ["Linux", "Nginx", "Docker", "ESP32", "WebSockets", "MPLS / VPN"],
  ai: ["PyTorch", "Scikit-Learn", "Whisper", "Computer Vision", "ONNX"]
};
