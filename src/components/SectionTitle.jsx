import { motion } from "framer-motion";

function SectionTitle({ label, title, description }) {
  return (
    <motion.div
      className="section-title tiger-section-title"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <span>{label}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </motion.div>
  );
}

export default SectionTitle;