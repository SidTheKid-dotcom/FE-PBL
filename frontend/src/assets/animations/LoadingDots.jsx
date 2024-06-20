import { motion } from "framer-motion";

const dotVariants = {
  animate: (i) => ({
    scale: [1, 1.5, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.2,  // Staggered delay for each dot
    },
  }),
};

const LoadingDots = () => (
  <div style={{ display: "flex", gap: "6px" }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        custom={i} // Custom property to pass index to variants
        variants={dotVariants}
        animate="animate"
        style={{
          width: 7,
          height: 7,
          backgroundColor: "white",
          borderRadius: "50%",
        }}
      />
    ))}
  </div>
);

export default LoadingDots;
