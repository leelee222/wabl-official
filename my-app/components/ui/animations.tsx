'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FloatingElement({ children, delay = 0 }: PageTransitionProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileInView={{ y: [0, -10, 0] }}
      viewport={{ once: false }}
      style={{
        animation: 'float 6s ease-in-out infinite',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </motion.div>
  )
}

export function HoverScale({ 
  children, 
  className = '',
  scale = 1.02,
  tapScale = 0.98
}: PageTransitionProps & { 
  scale?: number
  tapScale?: number 
}) {
  return (
    <motion.div
      whileHover={{ 
        scale,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: tapScale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxText({ 
  children, 
  className = '',
  speed = 0.5 
}: PageTransitionProps & { speed?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        transform: `translateY(${speed * 20}px)`,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealOnScroll({ 
  children, 
  className = '',
  direction = 'up',
  delay = 0
}: PageTransitionProps & { 
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number 
}) {
  const variants = {
    up: { y: 60, opacity: 0 },
    down: { y: -60, opacity: 0 },
    left: { x: -60, opacity: 0 },
    right: { x: 60, opacity: 0 }
  }

  return (
    <motion.div
      initial={variants[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCounter({ 
  value, 
  duration = 2,
  className = '' 
}: { 
  value: number
  duration?: number
  className?: string 
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration,
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
      >
        {value}
      </motion.span>
    </motion.span>
  )
}

export function MagneticHover({ children, strength = 0.3 }: PageTransitionProps & { strength?: number }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        
        e.currentTarget.style.transform = 
          `translate(${x * strength}px, ${y * strength}px) scale(1.05)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)'
      }}
      style={{ transition: 'transform 0.3s ease-out' }}
    >
      {children}
    </motion.div>
  )
}
