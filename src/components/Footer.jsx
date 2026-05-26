import { motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";
import { footer, profile, socialLinks } from "../data/portfolio";

function Footer() {
  return (
    <footer className="tiger-footer">
      <div className="container footer-editorial">
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <a href="#home" className="footer-logo">
            Deris<span>.</span>
          </a>

          <p>{footer.text}</p>

          <small>
            Graphic Designer • Brand Identity • Social Media Design
          </small>
        </motion.div>

        <motion.div
          className="footer-links-area"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
        >
          <div className="footer-contact-mini">
            <span>Contact</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>

          <div className="footer-socials tiger-footer-socials">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  whileHover={{
                    y: -6,
                    rotate: index % 2 === 0 ? -6 : 6,
                    scale: 1.1,
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <motion.a
          href="#home"
          className="back-to-top"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.14, ease: "easeOut" }}
          whileHover={{ y: -8, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
        >
          <FaArrowUp />
        </motion.a>
      </div>
    </footer>
  );
}

export default Footer;