import { motion } from "framer-motion";

const shimmerVariants = {
  animate: {
    backgroundPosition: ["-200%", "200%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const ShimmerEffect = () => (
  <motion.div
    variants={shimmerVariants}
    animate="animate"
    style={{
      width: 300,
      height: 100,
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
    }}
  />
);

export default ShimmerEffect;
