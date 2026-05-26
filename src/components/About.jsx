import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
} from "react-icons/fa";
import { about, profile } from "../data/portfolio";
import ParallaxText from "./ParallaxText";

function About() {
  const [photoError, setPhotoError] = useState(false);

  const tocItems = [
    {
      number: "01",
      title: "About",
      href: "#about",
    },
    {
      number: "02",
      title: "Skills",
      href: "#skills",
    },
    {
      number: "03",
      title: "Selected Works",
      href: "#projects",
    },
    {
      number: "04",
      title: "Experience",
      href: "#experience",
    },
    {
      number: "05",
      title: "Contact",
      href: "#contact",
    },
  ];

  const tools = [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Canva",
    "Figma",
    "Affinity Designer",
    "After Effects",
    "Adobe Premiere Pro",
    "Indesign",
  ];

  return (
    <section id="about" className="section editorial-about">
      <div className="container">
        <div className="about-heading-grid">
          <motion.div
            className="about-kicker"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span>Introduction</span>
            <h2>About The Designer</h2>
          </motion.div>

          <motion.p
            className="about-heading-text"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            A visual-focused portfolio that presents brand identity, social
            media design, and creative direction projects with a bold editorial
            style.
          </motion.p>
        </div>

        <div className="about-editorial-layout">
          <motion.div
            className="about-profile-card"
            initial={{ opacity: 0, x: -34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <div className="about-photo-frame">
              {!photoError ? (
                <img
                  src="/assets/deris-photo.png"
                  alt={profile.name}
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="about-photo-fallback">
                  <span>DR</span>
                </div>
              )}
            </div>

            <div className="about-name-card">
              <span className="about-small-label">Graphic Designer</span>
              <h3>{profile.name}</h3>
              <p>{profile.role}</p>
            </div>
          </motion.div>

          <motion.div
            className="about-main-copy"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.08, ease: "easeOut" }}
          >
            <h3>
              Establishing strong visual identities that clearly convey the brand's message.
            </h3>

            <p>{about.description}</p>

            <ul className="about-highlight-list">
              {about.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="tool-marquee">
              {tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </motion.div>

          <motion.aside
            className="toc-panel"
            initial={{ opacity: 0, x: 34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
          >
            <span className="toc-label">Table of Content</span>

            <div className="toc-list">
              {tocItems.map((item) => (
                <motion.a
                  href={item.href}
                  key={item.title}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                  <FaArrowRight />
                </motion.a>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

export default About;