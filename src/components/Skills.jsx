import { motion } from "framer-motion";
import { skills } from "../data/portfolio";
import SkillCard from "./SkillCard";

function Skills() {
  return (
    <section id="skills" className="section tiger-skills">
      <div className="container">
        <div className="skills-heading">
          <motion.div
            className="skills-title-block"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span>Creative Ability</span>
            <h2>Skills & Expertise</h2>
          </motion.div>

          <motion.p
            className="skills-intro"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            A collection of creative skills used to build brand identity,
            visual systems, social media content, and professional digital
            portfolio presentation.
          </motion.p>
        </div>

        <motion.div
          className="skills-showcase"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.title}
              title={skill.title}
              description={skill.description}
              icon={skill.icon}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;