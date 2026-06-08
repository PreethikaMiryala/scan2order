import { useMotionValue, useSpring, useTransform } from "framer-motion";

export function usePremiumTilt(intensity = 7) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { stiffness: 180, damping: 24, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 180, damping: 24, mass: 0.4 });

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [intensity, -intensity]);
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  function onMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return {
    tiltHandlers: { onMouseMove, onMouseLeave },
    cardStyle: {
      rotateX,
      rotateY,
      transformPerspective: 1100,
      transformStyle: "preserve-3d",
      willChange: "transform",
    },
    imageStyle: { x: imageX, y: imageY, willChange: "transform" },
  };
}
