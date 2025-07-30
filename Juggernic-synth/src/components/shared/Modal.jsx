// src/components/shared/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button'; // Import our new Button component
import { FaTimes } from 'react-icons/fa';

/**
 * Reusable Modal Component.
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal is requested to close (e.g., via close button or overlay click).
 * @param {React.ReactNode} props.children - The content to display inside the modal body.
 * @param {string} [props.title] - Optional title for the modal header.
 * @param {boolean} [props.showCloseButton=true] - Whether to display a close button in the header.
 * @param {boolean} [props.disableOverlayClose=false] - If true, clicking the overlay won't close the modal.
 * @param {React.ReactNode} [props.footer] - Optional content for the modal footer (e.g., action buttons).
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for the modal content container.
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  disableOverlayClose = false,
  footer,
  className = ''
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !disableOverlayClose) {
      onClose();
    }
  };

  // Use a portal to render the modal outside the main app div, typically at the body level.
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[1000]" // High z-index
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`bg-synth-dark-secondary rounded-xl shadow-2xl border border-synth-gray/30 p-6 max-w-lg w-full transform transition-all duration-300 ${className}`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {(title || showCloseButton) && (
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-synth-gray/20">
                {title && <h3 className="text-2xl font-bold text-synth-accent-blue">{title}</h3>}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-synth-text-muted hover:text-synth-accent-red transition-colors text-xl"
                    aria-label="Close modal"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            )}

            <div className="text-synth-text-light mb-4 text-center">
              {children}
            </div>

            {footer && (
              <div className="pt-4 border-t border-synth-gray/20 flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body // Portal target
  );
};

export default Modal;