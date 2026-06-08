import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

function AnimatedCounter({ value, formatter = (current) => Math.round(current) }) {
  const numericValue = Number(value || 0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => formatter(latest));
  const [display, setDisplay] = useState(formatter(0));

  useEffect(() => {
    const unsubscribe = rounded.on("change", setDisplay);
    const controls = animate(motionValue, numericValue, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [numericValue, motionValue, rounded]);

  return <motion.span>{display}</motion.span>;
}

export default AnimatedCounter;
