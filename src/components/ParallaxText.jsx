import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function ParallaxText({ text, baseVelocity = 100, className = "" }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, baseVelocity]);

  return (
    <div ref={ref} className={`parallax-text-container ${className}`}>
      <motion.div className="parallax-text-inner" style={{ x }}>
        {text}
      </motion.div>
    </div>
  );
}

export default ParallaxText;