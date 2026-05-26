import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";
import { profile } from "../data/portfolio";

function Contact() {
  return (
    <section id="contact" className="section tiger-contact">
      <div className="container">
        <div className="contact-editorial">
          <motion.div
            className="contact-title-area"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <span>Contact</span>
            <h2>Let’s Create Something Bold Together.</h2>
            <p>
              Have a brand identity, logo, social media design, or visual
              project? Let’s discuss and turn your idea into a strong visual
              identity.
            </p>
          </motion.div>

          <motion.div
            className="contact-action-card"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          >
            <div className="contact-card-number">05</div>

            <div className="contact-info-list">
              <a href={`mailto:${profile.email}`}>
                <FaEnvelope />
                <span>{profile.email}</span>
              </a>

              <a
                href={`https://wa.me/${profile.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>

              <div>
                <FaMapMarkerAlt />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="contact-buttons">
              <motion.a
                href={`https://wa.me/${profile.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="contact-btn contact-btn-primary"
                whileHover={{ y: -5, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                Start a Project
                <FaArrowRight />
              </motion.a>

              <motion.a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="contact-btn contact-btn-outline"
                whileHover={{ y: -5, rotate: 1 }}
                whileTap={{ scale: 0.96 }}
              >
                Download CV
                <FaDownload />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;