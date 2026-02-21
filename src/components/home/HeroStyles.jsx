export default function HeroStyles() {
  return (
    <style>{`
      .gradient-text {
        background: linear-gradient(90deg, #f97316, #fb923c, #ea580c, #f97316);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 3s linear infinite;
      }

      @keyframes shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }

      .glass-card {
        backdrop-filter: blur(20px) saturate(180%);
        background: rgba(20, 20, 20, 0.85);
        border: 1px solid rgba(249, 115, 22, 0.3);
        box-shadow: 0 8px 32px 0 rgba(249, 115, 22, 0.15);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .glass-card:hover {
        transform: translateY(-8px);
        border-color: rgba(249, 115, 22, 0.5);
        box-shadow: 0 16px 48px 0 rgba(249, 115, 22, 0.25);
      }

      .project-card {
        backdrop-filter: blur(12px);
        background: rgba(20, 20, 20, 0.7);
        border: 1px solid rgba(249, 115, 22, 0.2);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }

      .project-card:hover {
        transform: translateX(10px);
        border-color: rgba(249, 115, 22, 0.5);
        background: rgba(30, 30, 30, 0.9);
      }

      .skill-tag {
        display: inline-block;
        padding: 8px 16px;
        margin: 5px;
        background: rgba(249, 115, 22, 0.15);
        border: 1px solid rgba(249, 115, 22, 0.4);
        border-radius: 20px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }

      .skill-tag:hover {
        background: rgba(249, 115, 22, 0.3);
        border-color: rgba(249, 115, 22, 0.6);
        transform: translateY(-2px);
      }
    `}</style>
  )
}
