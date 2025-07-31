// src/components/common/Modal.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ title, children, onClose, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Card del modal */}
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            {/* Título */}
            {title && (
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {title}
              </h2>
            )}

            {/* Contenido dinámico */}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
