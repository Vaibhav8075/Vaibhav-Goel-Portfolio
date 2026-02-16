import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { HiMail, HiLocationMarker, HiPaperAirplane, HiCheckCircle } from "react-icons/hi"
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa"
import { theme } from "../../theme"

const SOCIAL_LINKS = [
  { icon: FaGithub, href: "https://github.com/Vaibhav8075", label: "GitHub", color: "#fff" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/vaibhav-goel-23983b344", label: "LinkedIn", color: "#0077b5" },
  { icon: FaTwitter, href: "https://twitter.com/yourusername", label: "Twitter", color: "#1da1f2" },
  { icon: FaInstagram, href: "https://instagram.com/yourusername", label: "Instagram", color: "#e4405f" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
}

export default function Reachout() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormState({ name: "", email: "", message: "" })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }, 2000)
  }

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section
      id="contact"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem)",
        background: "linear-gradient(180deg, #0a0a0a 0%, #000000 100%)",
        pointerEvents: "auto",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 'clamp(200px, 30vw, 400px)',
          height: 'clamp(200px, 30vw, 400px)',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: 'clamp(250px, 35vw, 500px)',
          height: 'clamp(250px, 35vw, 500px)',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <h2 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: "800",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #f97316, #fb923c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            lineHeight: "1.1"
          }}>
            Let's Create Together
          </h2>
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            color: "rgba(255, 255, 255, 0.7)",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Have a project in mind? I'm always excited to collaborate on innovative ideas and bring them to life.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
          gap: "clamp(2rem, 4vw, 3rem)",
          alignItems: "start"
        }}>
          
          {/* Left Side - Contact Info */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Email Card */}
            <motion.a
              variants={item}
              href="mailto:vaibhav@example.com"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "clamp(1.25rem, 3vw, 1.75rem)",
                background: "linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05))",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                textDecoration: "none",
                cursor: "pointer"
              }}
            >
              <div style={{
                width: "clamp(50px, 12vw, 60px)",
                height: "clamp(50px, 12vw, 60px)",
                background: "linear-gradient(135deg, #f97316, #fb923c)",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 8px 24px rgba(249, 115, 22, 0.3)"
              }}>
                <HiMail size={clamp(24, 28)} style={{ color: "#fff" }} />
              </div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>
                  Email me at
                </p>
                <p style={{ 
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)", 
                  fontWeight: "700", 
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  vaibhav.goel0531@gmail.com
                </p>
              </div>
            </motion.a>

            {/* Location Card */}
            <motion.div
              variants={item}
              whileHover={{ scale: 1.02, y: -5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "clamp(1.25rem, 3vw, 1.75rem)",
                background: "linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.05))",
                border: "1px solid rgba(251, 146, 60, 0.3)",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <div style={{
                width: "clamp(50px, 12vw, 60px)",
                height: "clamp(50px, 12vw, 60px)",
                background: "linear-gradient(135deg, #fb923c, #ea580c)",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 8px 24px rgba(251, 146, 60, 0.3)"
              }}>
                <HiLocationMarker size={clamp(24, 28)} style={{ color: "#fff" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>
                  Based in
                </p>
                <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", fontWeight: "700", color: "#fff" }}>
                  India
                </p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={item}
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                flexWrap: "wrap"
              }}
            >
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    backgroundColor: `${color}20`
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: "clamp(50px, 12vw, 60px)",
                    height: "clamp(50px, 12vw, 60px)",
                    background: "rgba(249, 115, 22, 0.1)",
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f97316",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    textDecoration: "none"
                  }}
                  aria-label={label}
                >
                  <Icon size={clamp(20, 24)} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "clamp(2rem, 5vw, 3rem)",
                background: "rgba(15, 15, 15, 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(249, 115, 22, 0.2)",
                borderRadius: "24px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
              }}
            >
              {/* Success Message */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    style={{
                      marginBottom: "1.5rem",
                      padding: "1rem 1.25rem",
                      background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1))",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}
                  >
                    <HiCheckCircle size={24} style={{ color: "#22c55e", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: "600", color: "#fff", marginBottom: "2px" }}>
                        Message Sent Successfully!
                      </p>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)" }}>
                        I'll get back to you as soon as possible.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name Input */}
              <motion.div variants={item} style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    marginBottom: "10px",
                    color: "#fff",
                    letterSpacing: "0.02em"
                  }}
                >
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: `2px solid ${focusedField === "name" ? "#f97316" : "rgba(249, 115, 22, 0.2)"}`,
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </motion.div>

              {/* Email Input */}
              <motion.div variants={item} style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    marginBottom: "10px",
                    color: "#fff",
                    letterSpacing: "0.02em"
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="john@example.com"
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: `2px solid ${focusedField === "email" ? "#f97316" : "rgba(249, 115, 22, 0.2)"}`,
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </motion.div>

              {/* Message Textarea */}
              <motion.div variants={item} style={{ marginBottom: "2rem" }}>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    marginBottom: "10px",
                    color: "#fff",
                    letterSpacing: "0.02em"
                  }}
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formState.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tell me about your project or idea..."
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: `2px solid ${focusedField === "message" ? "#f97316" : "rgba(249, 115, 22, 0.2)"}`,
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "1rem",
                    resize: "none",
                    transition: "all 0.3s ease",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: "1.6"
                  }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={item}
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { 
                  scale: 1.02, 
                  boxShadow: "0 12px 40px rgba(249, 115, 22, 0.5)" 
                } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  padding: "1.25rem",
                  background: isSubmitting 
                    ? "rgba(249, 115, 22, 0.5)" 
                    : "linear-gradient(135deg, #f97316, #fb923c)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 30px rgba(249, 115, 22, 0.3)",
                  fontFamily: "inherit"
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #fff",
                        borderTopColor: "transparent",
                        borderRadius: "50%"
                      }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <HiPaperAirplane size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            marginTop: "clamp(3rem, 6vw, 5rem)",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(249, 115, 22, 0.2)",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.9rem"
          }}
        >
          <p>© 2026 Vaibhav Goel</p>
        </motion.div>
      </div>
    </section>
  )
}

// Helper function for responsive sizing
function clamp(min, max) {
  return typeof window !== 'undefined' && window.innerWidth < 768 ? min : max
}