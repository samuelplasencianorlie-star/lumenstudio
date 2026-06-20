"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type LumenMorphHeroProps = {
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
};

export function LumenMorphHero({
  ctaHref = "#services",
  ctaLabel = "Ver servicios",
  secondaryCtaHref = "https://wa.me/34672767203",
  secondaryCtaLabel = "Hablar por WhatsApp",
  headline = "LUMEN Studio",
  subheadline = "Webs.\nRedes sociales.\nContenido impulsado por IA.",
  description = "Diseñamos experiencias digitales premium para negocios que quieren destacar.",
}: LumenMorphHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    mass: 0.34,
  });

  const videoOpacity = useTransform(progress, [0, 0.72, 1], [0.56, 0.2, 0.1]);
  const videoScale = useTransform(progress, [0, 1], [0.94, 0.98]);
  const videoY = useTransform(progress, [0, 1], [0, -18]);
  const contentOpacity = useTransform(progress, [0, 0.76, 1], [1, 0.92, 0]);
  const contentY = useTransform(progress, [0, 1], [0, -24]);
  const serviceLines = subheadline.split("\n");

  return (
    <section className="lumen-premium-hero" ref={heroRef} aria-labelledby="hero-title">
      <motion.video
        className="lumen-premium-hero__video"
        src="/videos/lumen-whale.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          opacity: videoOpacity,
          scale: videoScale,
          y: videoY,
        }}
      />

      <div className="lumen-premium-hero__overlay" aria-hidden="true" />

      <motion.div
        className="lumen-premium-hero__content"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <h1 id="hero-title">{headline}</h1>

        <div className="lumen-premium-hero__services" aria-label={subheadline}>
          {serviceLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <p className="lumen-premium-hero__description">{description}</p>

        <div className="lumen-premium-hero__actions">
          <a className="hero-button hero-button--secondary" href={ctaHref}>
            {ctaLabel}
          </a>
          <a className="hero-button hero-button--primary" href={secondaryCtaHref}>
            {secondaryCtaLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </motion.div>

      <a className="lumen-premium-hero__scroll" href="#services" aria-label="Ver servicios">
        <span />
      </a>
    </section>
  );
}
