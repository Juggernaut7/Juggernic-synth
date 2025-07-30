// src/components/shared/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Button Component with Juggernic Synth styling.
 * @param {object} props
 * @param {string} [props.variant='primary'] - Defines the button's color scheme ('primary', 'secondary', 'danger', 'outline', 'text').
 * @param {string} [props.size='md'] - Defines the button's size ('sm', 'md', 'lg').
 * @param {string} [props.type='button'] - The type attribute of the button ('button', 'submit', 'reset').
 * @param {boolean} [props.disabled=false] - If true, the button is disabled.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes.
 * @param {React.ReactNode} props.children - The content inside the button.
 * @param {function} [props.onClick] - Click event handler.
 * @param {object} [props.motionProps={}] - Props to pass directly to framer-motion's motion.button.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  children,
  onClick,
  motionProps = {},
  ...rest
}) => {
  const baseStyles = "font-bold rounded-full transition-all duration-200 ease-in-out flex items-center justify-center gap-2";
  const disabledStyles = "opacity-50 cursor-not-allowed";

  const variantStyles = {
    primary: "bg-synth-accent-blue text-synth-dark-primary hover:bg-synth-accent-purple shadow-md hover:shadow-synth-glow-sm-blue",
    secondary: "bg-synth-dark-primary text-synth-accent-green border border-synth-accent-green hover:bg-synth-accent-green/20 shadow-md hover:shadow-synth-glow-sm-green",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
    outline: "bg-transparent text-synth-accent-orange border border-synth-accent-orange hover:bg-synth-accent-orange/20 shadow-md",
    text: "bg-transparent text-synth-text-light hover:text-synth-accent-blue",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? disabledStyles : ''} ${className}`;

  return (
    <motion.button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default Button;