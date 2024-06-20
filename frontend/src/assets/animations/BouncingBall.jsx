import { motion } from "framer-motion";

const bounceVariants = {
  animate: {
    y: [0, -30, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
    },
  },
};

const BouncingBall = () => (
  <motion.div
    variants={bounceVariants}
    animate="animate"
    style={{
      width: 50,
      height: 50,
      backgroundColor: "blue",
      borderRadius: "50%",
    }}
  />
);

export default BouncingBall;
