import { motion } from "framer-motion";
import { profile } from "../data/portfolio";

function Hero() {
  return (
    <section id="home" className="tiger-hero">
      <motion.div
        className="hero-pattern-overlay"
        animate={{
          backgroundPosition: ["0% 0%", "5% 6%", "0% 0%"],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="hero-sparkle hero-sparkle-one"
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 12, 0],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✦
      </motion.div>

      <motion.div
        className="hero-sparkle hero-sparkle-two"
        animate={{
          scale: [1, 1.18, 1],
          rotate: [0, -10, 0],
          opacity: [0.55, 1, 0.55],
        }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✧
      </motion.div>

      <div className="hero-inner">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
        >
          PORTOFOLIO
        </motion.h1>

        <motion.div
          className="hero-subtitle-wrap"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: "easeOut" }}
        >
          <span className="hero-line"></span>
          <h2>GRAPHIC DESIGNER</h2>
          <span className="hero-line"></span>
        </motion.div>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55, ease: "easeOut" }}
        >
          {profile.description}
        </motion.p>

        <motion.div
          className="hero-actions tiger-actions"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.7, ease: "easeOut" }}
        >
          <motion.a
            href="#projects"
            className="tiger-btn tiger-btn-primary"
            whileHover={{ y: -5, rotate: -1, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            View Works
          </motion.a>

          <motion.a
            href="#about"
            className="tiger-btn tiger-btn-outline"
            whileHover={{ y: -5, rotate: 1, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            About Me
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        className="hero-bottom-arrows"
        animate={{ x: [0, 12, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ►►►
      </motion.div>
    </section>
  );
}

export default Hero;