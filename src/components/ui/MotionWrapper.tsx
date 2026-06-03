'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionWrapperProps {
  variants: Variants
  className?: string
  delay?: number
  amount?: number
  children: ReactNode
}

export function MotionWrapper({
  variants,
  className,
  delay = 0,
  amount = 0.2,
  children,
}: MotionWrapperProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
