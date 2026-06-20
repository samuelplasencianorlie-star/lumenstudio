"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LumenMorphHero } from "@/components/LumenMorphHero";

type Language = "es" | "en";

const whatsappHref = "https://wa.me/34672767203";
const emailHref = "mailto:lumenstudio.tenerife@gmail.com";
const instagramHref = "https://www.instagram.com/";
const closingWhatsappHref = whatsappHref;
const closingEmailHref = emailHref;

const copy = {
  es: {
    nav: {
      services: "Servicios",
      social: "Instagram",
      contact: "Contacto",
      whatsapp: "WhatsApp",
    },
    hero: {
      headline: "LUMEN Studio",
      subtitle:
        "Webs.\nRedes sociales.\nContenido impulsado por IA.",
      description:
        "Diseñamos experiencias digitales premium para negocios que quieren destacar.",
      primary: "Ver servicios",
      secondary: "Hablar por WhatsApp",
    },
    services: {
      eyebrow: "Servicios",
      title: "Tres formas de hacer crecer tu negocio digital.",
      intro:
        "Diseño, contenido y automatización trabajando como un mismo sistema.",
      featured: "Servicio protagonista",
      items: [
        {
          number: "01",
          title: "Web profesional",
          text: "Páginas web modernas, rápidas y optimizadas para convertir visitas en clientes.",
          price: "Desde 300€ hasta 900€",
        },
        {
          number: "02",
          title: "Instagram / Redes sociales",
          text: "Gestionamos tu Instagram con estrategia, diseño, edición y contenido pensado para hacer crecer tu marca.",
          price: "Precio personalizado según servicio",
          featured: true,
        },
        {
          number: "03",
          title: "IA aplicada a contenido y procesos",
          text: "Añadimos inteligencia artificial a tu contenido, procesos y atención para que tu negocio trabaje de forma más inteligente.",
          price: "Servicio personalizado",
        },
      ],
    },
    social: {
      eyebrow: "Social content system",
      title: "Contenido que conecta. Estrategia que convierte.",
      text: "Creamos, editamos y gestionamos contenido para que tu marca destaque, conecte con tu audiencia y venda más.",
      includes: "Incluye",
      features: [
        "Estrategia de contenido personalizada",
        "Diseño, edición y copywriting",
        "Publicaciones, stories y reels",
        "Crecimiento orgánico",
        "IA aplicada a contenido y automatización",
      ],
      videos: [
        { label: "Estrategia", title: "Contenido con intención" },
        { label: "Edición", title: "Reels que retienen" },
        { label: "Crecimiento", title: "Marca que se recuerda" },
      ],
      placeholder: "Añade tu vídeo",
    },
    final: {
      eyebrow: "Empecemos",
      title: "¿Tienes un proyecto en mente?",
      text: "Cuéntanos tu idea y te respondemos en menos de 24h.",
      whatsapp: "Hablemos por WhatsApp",
      email: "Enviar email",
    },
    closing: {
      eyebrow: "Tu siguiente paso",
      title: "¿Listo para transformar tu presencia digital?",
      text: "Creamos webs, gestionamos redes y usamos IA para que tu negocio se vea más profesional, conecte mejor y venda más.",
      whatsappLabel: "WhatsApp",
      whatsappValue: "+34 672 767 203",
      emailLabel: "Email",
      emailValue: "lumenstudio.tenerife@gmail.com",
      whatsappButton: "Hablar por WhatsApp",
      emailButton: "Enviar email",
    },
    footer: {
      studio: "LUMEN Studio",
      line: "Web · Social · AI",
      location: "Made in Tenerife.",
      statement: "Built for ambitious brands.",
    },
  },
  en: {
    nav: {
      services: "Services",
      social: "Instagram",
      contact: "Contact",
      whatsapp: "WhatsApp",
    },
    hero: {
      headline: "LUMEN Studio",
      subtitle:
        "Websites.\nSocial media.\nAI-powered content.",
      description:
        "We design premium digital experiences for businesses that want to stand out.",
      primary: "View services",
      secondary: "Talk on WhatsApp",
    },
    services: {
      eyebrow: "Services",
      title: "Three ways to grow your digital business.",
      intro: "Design, content and automation working as one system.",
      featured: "Featured service",
      items: [
        {
          number: "01",
          title: "Professional website",
          text: "Modern, fast websites optimized to turn visits into customers.",
          price: "From €300 to €900",
        },
        {
          number: "02",
          title: "Instagram / Social media",
          text: "We manage your Instagram with strategy, design, editing and content built to grow your brand.",
          price: "Custom price based on the service",
          featured: true,
        },
        {
          number: "03",
          title: "AI for content and processes",
          text: "We add artificial intelligence to your content, processes and support so your business works smarter.",
          price: "Custom service",
        },
      ],
    },
    social: {
      eyebrow: "Social content system",
      title: "Content that connects. Strategy that converts.",
      text: "We create, edit and manage content so your brand stands out, connects with its audience and sells more.",
      includes: "Includes",
      features: [
        "Custom content strategy",
        "Design, editing and copywriting",
        "Posts, stories and reels",
        "Organic growth",
        "AI-powered content and automation",
      ],
      videos: [
        { label: "Strategy", title: "Content with intent" },
        { label: "Editing", title: "Reels that retain" },
        { label: "Growth", title: "A brand people remember" },
      ],
      placeholder: "Add your video",
    },
    final: {
      eyebrow: "Let’s begin",
      title: "Have a project in mind?",
      text: "Tell us your idea and we’ll reply in less than 24 hours.",
      whatsapp: "Talk on WhatsApp",
      email: "Send email",
    },
    closing: {
      eyebrow: "Your next step",
      title: "Ready to transform your digital presence?",
      text: "We create websites, manage social media and use AI so your business looks more professional, connects better and sells more.",
      whatsappLabel: "WhatsApp",
      whatsappValue: "+34 672 767 203",
      emailLabel: "Email",
      emailValue: "lumenstudio.tenerife@gmail.com",
      whatsappButton: "Talk on WhatsApp",
      emailButton: "Send email",
    },
    footer: {
      studio: "LUMEN Studio",
      line: "Web · Social · AI",
      location: "Made in Tenerife.",
      statement: "Built for ambitious brands.",
    },
  },
} as const;

const videoSources = [
  "/videos/agent-auto-video_segment_2-2.mp4",
  "/videos/agent-auto-video_segment_2.mp4",
  `/videos/${encodeURIComponent("Charco%20-%20Runway%20Agent.mp4")}`,
] as const;

function VideoSlot({
  src,
  label,
  title,
  index,
}: {
  src: string;
  label: string;
  title: string;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="social-video"
      initial={reduceMotion ? false : { opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.72, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="social-video__screen">
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={title}
        />
        <div className="social-video__shade" />
      </div>
      <div className="social-video__caption">
        <span>{label}</span>
        <strong>{title}</strong>
      </div>
    </motion.article>
  );
}

export function LumenHomepage() {
  const [language, setLanguage] = useState<Language>("es");
  const reduceMotion = useReducedMotion();
  const t = copy[language];

  return (
    <main className="lumen-site">
      <div className="lumen-global-whale-glow" aria-hidden="true" />
      <video
        className="lumen-global-whale"
        src="/videos/lumen-whale.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="lumen-global-whale-shade" aria-hidden="true" />

      <header className="site-header">
        <a className="site-logo" href="#top" aria-label="LUMEN Studio">
          LUMEN
          <span>Studio</span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#services">{t.nav.services}</a>
          <a href="#social">{t.nav.social}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>

        <div className="site-actions">
          <div className="language-switcher" aria-label="Language switcher">
            <button
              className={language === "es" ? "is-active" : ""}
              onClick={() => setLanguage("es")}
              type="button"
            >
              ES
            </button>
            <button
              className={language === "en" ? "is-active" : ""}
              onClick={() => setLanguage("en")}
              type="button"
            >
              EN
            </button>
          </div>
          <a className="header-whatsapp" href={whatsappHref}>
            {t.nav.whatsapp}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <div id="top" />
      <LumenMorphHero
        headline={t.hero.headline}
        subheadline={t.hero.subtitle}
        description={t.hero.description}
        ctaLabel={t.hero.primary}
        ctaHref="#services"
        secondaryCtaLabel={t.hero.secondary}
        secondaryCtaHref={whatsappHref}
      />

      <section className="lumen-section services-section" id="services">
        <div className="lumen-shell">
          <motion.div
            className="section-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-eyebrow">{t.services.eyebrow}</p>
            <h2>{t.services.title}</h2>
            <p>{t.services.intro}</p>
          </motion.div>

          <div className="services-grid">
            {t.services.items.map((service, index) => (
              <motion.article
                className={
                  "featured" in service && service.featured
                    ? "service-card service-card--featured"
                    : "service-card"
                }
                key={service.title}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="service-card__top">
                  <span>{service.number}</span>
                  {"featured" in service && service.featured ? (
                    <small>{t.services.featured}</small>
                  ) : null}
                </div>
                <div className="service-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
                <div className="service-card__price">
                  <span>→</span>
                  <strong>{service.price}</strong>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="lumen-section social-section" id="social">
        <div className="social-section__glow" aria-hidden="true" />
        <div className="lumen-shell">
          <div className="social-intro">
            <motion.div
              className="social-intro__copy"
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="section-eyebrow">{t.social.eyebrow}</p>
              <h2>{t.social.title}</h2>
              <p>{t.social.text}</p>
            </motion.div>

            <motion.div
              className="social-features"
              initial={reduceMotion ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <small>{t.social.includes}</small>
              <ul>
                {t.social.features.map((feature, index) => (
                  <li key={feature}>
                    <span>0{index + 1}</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="social-videos">
            {t.social.videos.map((video, index) => (
              <VideoSlot
                key={video.title}
                src={videoSources[index]}
                label={video.label}
                title={video.title}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="closing-slide" id="contact" aria-labelledby="closing-slide-title">
        <div className="closing-slide__ambient" aria-hidden="true" />
        <motion.div
          className="closing-slide__shell"
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="closing-slide__eyebrow">{t.closing.eyebrow}</p>
          <h2 id="closing-slide-title">{t.closing.title}</h2>
          <p className="closing-slide__text">{t.closing.text}</p>

          <div className="closing-slide__contacts">
            <a className="closing-contact-card" href={closingWhatsappHref}>
              <span className="closing-contact-card__icon" aria-hidden="true">
                W
              </span>
              <span className="closing-contact-card__copy">
                <small>{t.closing.whatsappLabel}</small>
                <strong>{t.closing.whatsappValue}</strong>
              </span>
              <span className="closing-contact-card__arrow" aria-hidden="true">
                ↗
              </span>
            </a>

            <a className="closing-contact-card" href={closingEmailHref}>
              <span className="closing-contact-card__icon" aria-hidden="true">
                @
              </span>
              <span className="closing-contact-card__copy">
                <small>{t.closing.emailLabel}</small>
                <strong>{t.closing.emailValue}</strong>
              </span>
              <span className="closing-contact-card__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>

          <div className="closing-slide__actions">
            <a className="closing-button closing-button--primary" href={closingWhatsappHref}>
              {t.closing.whatsappButton}
              <span aria-hidden="true">↗</span>
            </a>
            <a className="closing-button closing-button--secondary" href={closingEmailHref}>
              {t.closing.emailButton}
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__brand">
          <strong>{t.footer.studio}</strong>
          <span>{t.footer.line}</span>
        </div>
        <p className="site-footer__location">
          <span>{t.footer.location}</span>
          <span>{t.footer.statement}</span>
        </p>
      </footer>

      <a className="floating-whatsapp" href={whatsappHref} aria-label={t.nav.whatsapp}>
        <span />
        {t.nav.whatsapp}
      </a>
    </main>
  );
}
