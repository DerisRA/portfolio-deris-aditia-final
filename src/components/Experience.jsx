import { motion } from "framer-motion";
import { FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { experiences } from "../data/portfolio";

function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <motion.div
          className="exp-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span>Creative Journey</span>
          <h2>Experience</h2>
        </motion.div>

        <div className="exp-list">
          {experiences.map((item, index) => (
            <motion.article
              className="exp-card"
              key={item.role}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="exp-card-badge">
                <FaBriefcase />
                <span><FaCalendarAlt /> {item.period}</span>
              </div>

              <h3>{item.role}</h3>
              <h4>{item.company}</h4>
              <p>{item.description}</p>

              <div className="exp-card-num">0{index + 1}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;