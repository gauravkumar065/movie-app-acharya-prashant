"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface IntersectionOptions extends IntersectionObserverInit {}

export function useIntersection(elementRef: React.RefObject<Element>, options: IntersectionOptions = {}): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [elementRef, options])

  return isIntersecting
}

