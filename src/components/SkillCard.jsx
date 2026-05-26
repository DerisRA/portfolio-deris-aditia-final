import { motion } from "framer-motion";

function SkillCard({ title, description, icon, index }) {
  const Icon = icon;

  return (
    <motion.article
      className="tiger-skill-card"
      variants={{
        hidden: { opacity: 0, y: 34 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      whileHover={{
        y: -10,
        rotate: index % 2 === 0 ? -1 : 1,
      }}
    >
      <div className="skill-card-number">
        {String(index + 1).padStart(2, "0")}
      </div>

      <motion.div
        className="tiger-skill-icon"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3 + index * 0.15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          rotate: 8,
          scale: 1.08,
        }}
      >
        <Icon />
      </motion.div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="skill-card-line"></div>
    </motion.article>
  );
}

export default SkillCard;