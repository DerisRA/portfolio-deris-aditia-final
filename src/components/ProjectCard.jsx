import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaExternalLinkAlt,
  FaFilePdf,
  FaTimes,
} from "react-icons/fa";

function ProjectCard({ project }) {
  const [currentIndex, setCurrentIndex] = useState(null); // null = closed
  const [selectedPdf, setSelectedPdf] = useState(null);

  const Icon = project.icon;
  const isPdf = project.type === "pdf";
  const isImages = project.type === "images";
  const isPosters = project.type === "posters";
  const images = project.images || [];

  const openGallery = (index) => setCurrentIndex(index);
  const closeGallery = () => setCurrentIndex(null);

  const nextImage = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [currentIndex, images.length]);

  const prevImage = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [currentIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (currentIndex !== null) {
        if (event.key === "Escape") closeGallery();
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") prevImage();
      }
      if (selectedPdf !== null && event.key === "Escape") {
        setSelectedPdf(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, selectedPdf, nextImage, prevImage]);

  const handleViewProject = (e) => {
    if ((isImages || isPosters) && images.length > 0) {
      e.preventDefault();
      openGallery(0);
    }
  };

  return (
    <>
      <motion.article
        className={`project-card ${isPosters ? "poster-wide" : ""}`}
        variants={{
          hidden: { opacity: 0, y: 34 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ y: -12 }}
      >
        {isPdf && (
          <div className="pdf-preview-card">
            <button
              type="button"
              className="pdf-preview-button"
              onClick={() => setSelectedPdf(project.pdfUrl)}
              aria-label={`Open ${project.title} PDF preview`}
            >
              <div className="pdf-preview-toolbar">
                <div className="pdf-window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="pdf-file-label">Brand Guideline PDF</span>
              </div>

              <div className="pdf-preview-screen">
                <iframe
                  src={`${project.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={`${project.title} PDF preview`}
                  loading="lazy"
                />
                <div className="pdf-preview-overlay">
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaFilePdf />
                  </motion.div>
                  <strong>Click to Preview</strong>
                  <small>{project.title}</small>
                </div>
              </div>
            </button>

            <div className="pdf-actions">
              <a
                href={project.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="pdf-action-link"
              >
                <FaExternalLinkAlt />
                Open PDF
              </a>
              <a href={project.pdfUrl} download className="pdf-action-link">
                <FaDownload />
                Download
              </a>
            </div>
          </div>
        )}

        {isImages && (
          <div className="project-collage">
            {images.slice(0, 4).map((image, index) => (
              <motion.button
                type="button"
                className={`collage-item collage-item-${index + 1}`}
                key={image}
                onClick={() => openGallery(index)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                aria-label={`Open ${project.title} preview ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${project.title} preview ${index + 1}`}
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}

        {isPosters && (
          <div className="poster-eight-grid">
            {images.map((image, index) => (
              <motion.button
                type="button"
                className="poster-eight-item"
                key={image}
                onClick={() => openGallery(index)}
                whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? -1 : 1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
                aria-label={`Open poster ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${project.title} poster ${index + 1}`}
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}

        <div className="project-top">
          <motion.div
            className="project-icon"
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ duration: 0.25 }}
          >
            <Icon />
          </motion.div>
          <span>{project.category}</span>
        </div>

        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <ul className="project-details">
          {project.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>

        <div className="tech-list">
          {project.technologies.map((tech) => (
            <motion.span key={tech} whileHover={{ y: -3, scale: 1.04 }}>
              {tech}
            </motion.span>
          ))}
        </div>

        <motion.a
          className="project-link"
          href={project.demoUrl || project.pdfUrl || "#"}
          onClick={handleViewProject}
          whileHover={{ x: 5 }}
          target={
            project.demoUrl && project.demoUrl !== "#"
              ? "_blank"
              : project.pdfUrl
                ? "_blank"
                : "_self"
          }
          rel="noreferrer"
        >
          View Project <FaArrowRight />
        </motion.a>
      </motion.article>

      {/* Gallery Modal with Navigation */}
      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGallery}
          >
            <div className="gallery-modal-inner" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="gallery-close"
                onClick={closeGallery}
                aria-label="Close gallery"
              >
                <FaTimes />
              </button>

              <button
                type="button"
                className="gallery-nav gallery-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>

              <motion.img
                key={images[currentIndex]}
                src={images[currentIndex]}
                alt={`${project.title} full view ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />

              <button
                type="button"
                className="gallery-nav gallery-next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>

              <div className="gallery-counter">
                {currentIndex + 1} / {images.length}
              </div>

              <div className="gallery-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    className={idx === currentIndex ? "active" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      openGallery(idx);
                    }}
                  >
                    <img src={img} alt={`thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Modal */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            className="pdf-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPdf(null)}
          >
                        <motion.div
              className="pdf-modal-content"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pdf-modal-header">
                <strong>{project.title}</strong>
                <button
                  type="button"
                  className="pdf-modal-close"
                  onClick={() => setSelectedPdf(null)}
                  aria-label="Close PDF preview"
                >
                  <FaTimes />
                </button>
              </div>
              <iframe
                src={`${selectedPdf}#toolbar=1&navpanes=0`}
                title={`${project.title} large PDF preview`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectCard;