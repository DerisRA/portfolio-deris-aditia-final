import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaDownload, FaTimes } from "react-icons/fa";
import { navLinks, profile } from "../data/portfolio";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

      setIsScrolled(window.scrollY > 24);

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (section) {
          const rect = section.getBoundingClientRect();

          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={
        isScrolled ? "tiger-navbar tiger-navbar-scrolled" : "tiger-navbar"
      }
    >
      <nav className="tiger-nav-container">
        <motion.a
          href="#home"
          className="tiger-nav-logo"
          onClick={closeMenu}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          Deris<span>.</span>
        </motion.a>

        <ul className="tiger-nav-menu desktop-menu">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  onClick={closeMenu}
                  className={isActive ? "active-link" : ""}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {link.label}
                </motion.a>
              </li>
            );
          })}
        </ul>

        <motion.a
          href={profile.cvUrl}
          target="_blank"
          rel="noreferrer"
          className="tiger-nav-cv"
          whileHover={{ y: -3, rotate: -1 }}
          whileTap={{ scale: 0.96 }}
        >
          <FaDownload />
          CV
        </motion.a>

        <button
          type="button"
          className="tiger-nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="tiger-mobile-menu"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {navLinks.map((link, index) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;

              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={isActive ? "active-link" : ""}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {link.label}
                </motion.a>
              );
            })}

            <motion.a
              href={profile.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="tiger-mobile-cv"
              onClick={closeMenu}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navLinks.length * 0.04 }}
            >
              <FaDownload />
              Download CV
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;