import { motion } from "framer-motion";

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut", // Adding easing for smoother animation
    },
  },
};

const PulsingEffect = () => (
  <motion.div
    variants={pulseVariants}
    animate="animate"
    style={{
      width: 100,
      height: 100,
      backgroundColor: "blue",
      borderRadius: "50%",
    }}
  />
);

export default PulsingEffect;
