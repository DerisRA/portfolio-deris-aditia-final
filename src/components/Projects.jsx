import { motion } from "framer-motion";
import { FaFilePdf, FaImages, FaLayerGroup } from "react-icons/fa";
import { projects } from "../data/portfolio";
import ProjectCard from "./ProjectCard";
import ParallaxText from "./ParallaxText";

function Projects() {
  const pdfProjects = projects.filter((project) => project.type === "pdf");
  const imageProjects = projects.filter((project) => project.type === "images");
  const posterProjects = projects.filter((project) => project.type === "posters");

  return (
    <section id="projects" className="section tiger-projects">
      <div className="container">
        <div className="projects-editorial-heading">
          <motion.div
            className="projects-title-area"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <span>Selected Works</span>
            <h2>Brand & Social Media Projects</h2>
          </motion.div>

          <motion.div
            className="projects-summary-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          >
            <p>
              A curated selection of brand guideline documents, social media
              visuals, and poster designs presented with a bold editorial
              portfolio style.
            </p>

            <div className="projects-stats">
              <div>
                <FaFilePdf />
                <strong>12</strong>
                <span>PDF Guidelines</span>
              </div>

              <div>
                <FaImages />
                <strong>154</strong>
                <span>Image Projects</span>
              </div>

              <div>
                <FaLayerGroup />
                <strong>166</strong>
                <span>Total Projects</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="project-category-strip"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          <span>Brand Guideline</span>
          <span>Logo System</span>
          <span>Typography</span>
          <span>Visual Identity</span>
          <span>Poster Design</span>
          <span>Social Media Design</span>
        </motion.div>

        <motion.div
          className="projects-grid tiger-projects-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;