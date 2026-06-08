export const spring = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const softEase = [0.16, 1, 0.3, 1];

export const blurUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: softEase },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: "blur(8px)",
    transition: { duration: 0.28, ease: softEase },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.04,
    },
  },
};

export const viewportOnce = {
  once: true,
  amount: 0.18,
};
