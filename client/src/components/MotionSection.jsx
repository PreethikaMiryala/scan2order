import { motion } from "framer-motion";
import { blurUp, viewportOnce } from "../utils/motion";

function MotionSection({ children, className = "", delay = 0, ...props }) {
  return (
    <motion.section
      variants={blurUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export default MotionSection;
