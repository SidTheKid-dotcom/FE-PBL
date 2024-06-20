import { motion } from "framer-motion";

const Hover = () => (
    <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ width: 200, height: 200, backgroundColor: 'bg-orange-300' }}
    >
    </motion.div>
);

export default Hover;
