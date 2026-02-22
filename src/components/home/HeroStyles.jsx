export default function HeroStyles() {
  return (
    <style>{`
      :root {
        --accent: #f97316;
        --accent-light: #fb923c;
        --accent-dark: #ea580c;
        --bg-soft: rgba(20, 20, 20, 0.74);
      }

      .gradient-text {
        background: linear-gradient(100deg, var(--accent), var(--accent-light), var(--accent-dark), var(--accent));
        background-size: 240% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 4s linear infinite;
      }

      @keyframes shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }

      .glass-card {
        backdrop-filter: blur(20px) saturate(180%);
        background: var(--bg-soft);
        border: 1px solid rgba(249, 115, 22, 0.26);
        box-shadow: 0 12px 36px rgba(3, 3, 3, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .glass-card:hover {
        transform: translateY(-6px);
        border-color: rgba(249, 115, 22, 0.46);
        box-shadow: 0 20px 52px rgba(3, 3, 3, 0.46), 0 0 28px rgba(249, 115, 22, 0.14);
      }

      .project-card {
        backdrop-filter: blur(12px);
        background: linear-gradient(160deg, rgba(22, 22, 22, 0.82), rgba(12, 12, 12, 0.72));
        border: 1px solid rgba(249, 115, 22, 0.2);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.24);
      }

      .project-card:hover {
        transform: translateX(8px) translateY(-3px);
        border-color: rgba(249, 115, 22, 0.5);
        background: linear-gradient(160deg, rgba(30, 30, 30, 0.92), rgba(18, 18, 18, 0.84));
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.36);
      }

      .skill-tag {
        display: inline-block;
        padding: 8px 14px;
        margin: 5px;
        background: rgba(249, 115, 22, 0.12);
        border: 1px solid rgba(249, 115, 22, 0.34);
        border-radius: 20px;
        font-size: 0.86rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.92);
        transition: all 0.3s ease;
      }

      .skill-tag:hover {
        background: rgba(249, 115, 22, 0.22);
        border-color: rgba(249, 115, 22, 0.6);
        transform: translateY(-2px) scale(1.02);
      }
    `}</style>
  )
}
