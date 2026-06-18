"use client";

import { useEffect, useRef, useState } from "react";
import { LumenMorphHero } from "@/components/LumenMorphHero";

type Language = "es" | "en";
type CalculatorKey = "web" | "social" | "video" | "pack";

type Reel = {
  category: string;
  label: string;
  src?: string;
};

const whatsappHref = "https://wa.me/34600000000";
const emailHref = "mailto:hello@lumenstudio.com";
const instagramHref = "https://www.instagram.com/";

const copy = {
  es: {
    nav: {
      services: "Servicios",
      social: "Redes",
      reels: "Vídeos IA",
      process: "Proceso",
      calculator: "Calculadora",
      contact: "Contacto",
      whatsapp: "WhatsApp",
    },
    hero: {
      headline: "Tu negocio ya es bueno. Hagamos que se vea.",
      subheadline:
        "Creamos páginas web, redes sociales y contenido visual para negocios que quieren transmitir una imagen premium.",
      primary: "Solicitar auditoría gratuita",
      secondary: "Hablar por WhatsApp",
    },
    services: {
      kicker: "Servicios",
      title: "Todo lo que tu negocio necesita para verse más sólido, moderno y premium.",
      text:
        "Construimos una presencia digital completa: una web que convence, redes que elevan la percepción de marca y piezas visuales que hacen que tu negocio sea difícil de ignorar.",
      items: [
        {
          label: "Web",
          title: "Páginas web premium",
          description:
            "Diseñamos y desarrollamos páginas rápidas, elegantes y enfocadas en convertir visitas en conversaciones reales.",
          features: [
            "Dirección visual premium",
            "Copywriting y estructura",
            "Diseño responsive",
            "Optimización de velocidad",
            "CTA conectado a WhatsApp",
          ],
        },
        {
          label: "Redes",
          title: "Gestión de redes sociales",
          description:
            "Creamos un sistema visual para que Instagram, TikTok o LinkedIn transmitan confianza antes del primer mensaje.",
          features: [
            "Calendario de contenido",
            "Reels, posts y carruseles",
            "Diseño de stories",
            "Optimización del perfil",
            "Dirección de marca mensual",
          ],
        },
        {
          label: "Contenido",
          title: "Vídeos con IA",
          description:
            "Producimos piezas verticales con estética cinematográfica para presentar productos, destinos, espacios y servicios.",
          features: [
            "Concepto creativo",
            "Vídeos 9:16 para redes",
            "Edición y sonido",
            "Adaptación por sector",
            "Versiones para campaña",
          ],
        },
        {
          label: "Diagnóstico",
          title: "Auditoría digital gratuita",
          description:
            "Revisamos cómo se ve tu negocio online y te decimos qué cambiaríamos primero si fuese nuestro.",
          features: [
            "Revisión de web",
            "Revisión de Instagram",
            "Análisis de imagen",
            "Prioridades de mejora",
            "Plan de próximos pasos",
          ],
        },
      ],
    },
    social: {
      kicker: "Redes sociales",
      title: "Hacemos que los negocios locales parezcan marcas que la gente recuerda.",
      text:
        "Tu cliente decide si confiar en ti mucho antes de escribirte. Creamos una imagen clara, cuidada y consistente para que tus redes parezcan activas, profesionales y preparadas para vender.",
      metric: "01",
      metricLabel: "Sistema visual para publicar con coherencia, no piezas sueltas.",
      mockups: [
        { eyebrow: "Perfil", title: "Primera impresión premium" },
        { eyebrow: "Reel", title: "Contenido vertical con intención" },
        { eyebrow: "Post", title: "Ofertas y mensajes claros" },
      ],
      tags: ["Instagram", "TikTok", "Reels", "Carruseles", "Stories"],
    },
    reels: {
      kicker: "Contenido visual con IA",
      title: "Tres piezas destacadas para mostrar lo que tu marca podría transmitir.",
      subtitle:
        "Creamos vídeos verticales con una estética premium para negocios que necesitan destacar sin parecer genéricos.",
      placeholder: "Espacio para vídeo",
      upload: "Placeholder hasta subir el archivo final",
      items: [
        {
          category: "Turismo",
          label: "Destino, experiencia y deseo de viaje",
        },
        {
          category: "Naturaleza",
          label: "Paisaje, calma y energía visual",
        },
        {
          category: "Negocios",
          label: "Marca, servicio y percepción premium",
        },
      ],
    },
    process: {
      kicker: "Proceso",
      title: "Un proceso simple para convertir tu presencia digital en algo que venda mejor.",
      steps: [
        {
          step: "01",
          title: "Analizamos tu negocio",
          copy: "Vemos qué vendes, a quién quieres atraer, cómo se percibe tu marca y dónde se está perdiendo valor.",
        },
        {
          step: "02",
          title: "Diseñamos una imagen premium",
          copy: "Definimos dirección visual, tono, estructura y mensajes para que todo se sienta más claro y aspiracional.",
        },
        {
          step: "03",
          title: "Creamos tu presencia digital",
          copy: "Producimos web, contenidos y vídeos con una estética coherente, moderna y preparada para convertir.",
        },
        {
          step: "04",
          title: "Optimizamos y mejoramos",
          copy: "Revisamos la respuesta del mercado y ajustamos contenido, mensajes y experiencia para seguir elevando resultados.",
        },
      ],
    },
    audit: {
      kicker: "Auditoría gratuita",
      title: "Te decimos qué mejoraríamos si tu negocio fuese nuestro.",
      text:
        "Mándanos tu web, Instagram o idea. Te responderemos con una lectura clara de lo que hoy está debilitando tu imagen y qué tocaríamos primero.",
      primary: "Solicitar auditoría gratuita",
      secondary: "Enviar email",
    },
    calculator: {
      kicker: "Calculadora",
      title: "Calcula una primera idea de inversión.",
      text:
        "El precio final depende del alcance real, pero esta guía te ayuda a entender qué tipo de proyecto encaja mejor con tu momento.",
      estimateLabel: "Estimación orientativa",
      includedLabel: "Incluye",
      note: "La auditoría gratuita nos ayuda a ajustar el alcance antes de preparar una propuesta cerrada.",
      options: {
        web: {
          name: "Web",
          range: "Desde 900 EUR",
          description: "Para negocios que necesitan una página premium, clara y enfocada en conversión.",
          includes: ["Diseño visual", "Desarrollo responsive", "Copy base", "Conexión a WhatsApp"],
        },
        social: {
          name: "Redes sociales",
          range: "Desde 450 EUR / mes",
          description: "Para mejorar la imagen, consistencia y actividad de tus canales sociales.",
          includes: ["Calendario mensual", "Diseño de posts", "Reels base", "Optimización del perfil"],
        },
        video: {
          name: "Vídeo IA",
          range: "Desde 180 EUR / pieza",
          description: "Para campañas o piezas verticales con estética moderna y diferenciadora.",
          includes: ["Concepto creativo", "Vídeo 9:16", "Edición", "Adaptación para redes"],
        },
        pack: {
          name: "Pack completo",
          range: "Desde 1.600 EUR",
          description: "Para negocios que quieren renovar web, redes y contenido visual como un sistema.",
          includes: ["Web premium", "Sistema social", "Vídeos IA", "Auditoría y estrategia"],
        },
      },
    },
    contact: {
      kicker: "Contacto",
      title: "¿Quieres que tu negocio se vea al siguiente nivel?",
      text:
        "WhatsApp es la forma más rápida de empezar. Si prefieres enviar contexto, también puedes escribirnos por email.",
      whatsapp: "Hablar por WhatsApp",
      email: "hello@lumenstudio.com",
    },
    footer: {
      studio: "LUMEN Studio",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      email: "Email",
      language: "ES / EN",
      location: "Made in Tenerife",
    },
    floating: "WhatsApp",
  },
  en: {
    nav: {
      services: "Services",
      social: "Social",
      reels: "AI videos",
      process: "Process",
      calculator: "Calculator",
      contact: "Contact",
      whatsapp: "WhatsApp",
    },
    hero: {
      headline: "Your business is already good. Let’s make it look like it.",
      subheadline:
        "We create websites, social media and visual content for businesses that want to communicate a premium image.",
      primary: "Request free audit",
      secondary: "Talk on WhatsApp",
    },
    services: {
      kicker: "Services",
      title: "Everything your business needs to look sharper, more modern and more premium.",
      text:
        "We build a complete digital presence: a website that convinces, social channels that elevate perception and visual pieces that make your business harder to ignore.",
      items: [
        {
          label: "Web",
          title: "Premium websites",
          description:
            "Fast, elegant websites designed to turn visits into real conversations.",
          features: [
            "Premium visual direction",
            "Copywriting and structure",
            "Responsive design",
            "Speed optimization",
            "WhatsApp CTA setup",
          ],
        },
        {
          label: "Social",
          title: "Social media management",
          description:
            "A visual system for Instagram, TikTok or LinkedIn that builds trust before the first message.",
          features: [
            "Content calendar",
            "Reels, posts and carousels",
            "Story design",
            "Profile optimization",
            "Monthly brand direction",
          ],
        },
        {
          label: "Content",
          title: "AI videos",
          description:
            "Cinematic vertical pieces for products, destinations, spaces and services.",
          features: [
            "Creative concept",
            "9:16 social videos",
            "Editing and sound",
            "Sector adaptation",
            "Campaign versions",
          ],
        },
        {
          label: "Diagnosis",
          title: "Free digital audit",
          description:
            "We review how your business looks online and tell you what we would improve first if it were ours.",
          features: [
            "Website review",
            "Instagram review",
            "Image analysis",
            "Improvement priorities",
            "Next-step plan",
          ],
        },
      ],
    },
    social: {
      kicker: "Social media",
      title: "We make local businesses look like brands people remember.",
      text:
        "Your customer decides whether to trust you before they message you. We create a clear, polished and consistent image so your social channels feel active, professional and ready to sell.",
      metric: "01",
      metricLabel: "A visual system for consistency, not disconnected posts.",
      mockups: [
        { eyebrow: "Profile", title: "Premium first impression" },
        { eyebrow: "Reel", title: "Vertical content with intent" },
        { eyebrow: "Post", title: "Clear offers and messages" },
      ],
      tags: ["Instagram", "TikTok", "Reels", "Carousels", "Stories"],
    },
    reels: {
      kicker: "AI visual content",
      title: "Three featured pieces that show what your brand could communicate.",
      subtitle:
        "We create vertical videos with a premium aesthetic for businesses that need to stand out without looking generic.",
      placeholder: "Video slot",
      upload: "Placeholder until the final file is added",
      items: [
        {
          category: "Tourism",
          label: "Destination, experience and travel desire",
        },
        {
          category: "Nature",
          label: "Landscape, calm and visual energy",
        },
        {
          category: "Business",
          label: "Brand, service and premium perception",
        },
      ],
    },
    process: {
      kicker: "Process",
      title: "A simple process to turn your digital presence into something that sells better.",
      steps: [
        {
          step: "01",
          title: "We analyze your business",
          copy: "We understand what you sell, who you want to attract, how your brand is perceived and where value is being lost.",
        },
        {
          step: "02",
          title: "We design a premium image",
          copy: "We define visual direction, tone, structure and messaging so everything feels clearer and more aspirational.",
        },
        {
          step: "03",
          title: "We build your digital presence",
          copy: "We produce the website, content and videos with a coherent, modern aesthetic built to convert.",
        },
        {
          step: "04",
          title: "We optimize and improve",
          copy: "We review market response and refine content, messaging and experience so results keep improving.",
        },
      ],
    },
    audit: {
      kicker: "Free audit",
      title: "We’ll tell you what we would improve if your business were ours.",
      text:
        "Send us your website, Instagram or idea. We will reply with a clear read on what is weakening your image and what we would fix first.",
      primary: "Request free audit",
      secondary: "Send email",
    },
    calculator: {
      kicker: "Calculator",
      title: "Get a first idea of investment.",
      text:
        "The final price depends on the real scope, but this guide helps you understand which project type fits your moment.",
      estimateLabel: "Indicative estimate",
      includedLabel: "Includes",
      note: "The free audit helps us refine the scope before preparing a fixed proposal.",
      options: {
        web: {
          name: "Web",
          range: "From EUR 900",
          description: "For businesses that need a premium, clear and conversion-focused website.",
          includes: ["Visual design", "Responsive build", "Base copy", "WhatsApp connection"],
        },
        social: {
          name: "Social media",
          range: "From EUR 450 / month",
          description: "For improving the image, consistency and activity of your social channels.",
          includes: ["Monthly calendar", "Post design", "Base reels", "Profile optimization"],
        },
        video: {
          name: "AI video",
          range: "From EUR 180 / piece",
          description: "For campaigns or vertical pieces with a modern, differentiated look.",
          includes: ["Creative concept", "9:16 video", "Editing", "Social adaptation"],
        },
        pack: {
          name: "Full pack",
          range: "From EUR 1,600",
          description: "For businesses that want to renew web, social and visual content as one system.",
          includes: ["Premium website", "Social system", "AI videos", "Audit and strategy"],
        },
      },
    },
    contact: {
      kicker: "Contact",
      title: "Want your business to look like the next level?",
      text:
        "WhatsApp is the fastest way to start. If you prefer sending context, you can also email us.",
      whatsapp: "Talk on WhatsApp",
      email: "hello@lumenstudio.com",
    },
    footer: {
      studio: "LUMEN Studio",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      email: "Email",
      language: "ES / EN",
      location: "Made in Tenerife",
    },
    floating: "WhatsApp",
  },
} as const;

function AiReelSlot({
  reel,
  placeholder,
  upload,
}: {
  reel: Reel;
  placeholder: string;
  upload: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !reel.src) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.42 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [reel.src]);

  return (
    <article
      className={`ai-reel${active ? " ai-reel--active" : ""}`}
      onClick={() => setActive((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive((current) => !current);
        }
      }}
      tabIndex={0}
    >
      <div className="ai-reel__screen">
        {reel.src ? (
          <video
            ref={videoRef}
            src={reel.src}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="ai-reel__placeholder">
            <span>{placeholder}</span>
            <strong>{reel.category}</strong>
            <small>{upload}</small>
          </div>
        )}
      </div>
      <div className="ai-reel__meta">
        <strong>{reel.category}</strong>
        <span>{reel.label}</span>
      </div>
    </article>
  );
}

export function LumenHomepage() {
  const [language, setLanguage] = useState<Language>("es");
  const [calculatorChoice, setCalculatorChoice] =
    useState<CalculatorKey>("pack");
  const t = copy[language];
  const calculatorOption = t.calculator.options[calculatorChoice];
  const calculatorKeys = Object.keys(t.calculator.options) as CalculatorKey[];

  return (
    <main>
      <header className="site-header">
        <a className="site-logo" href="#top" aria-label="LUMEN Studio">
          LUMEN Studio
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#services">{t.nav.services}</a>
          <a href="#social">{t.nav.social}</a>
          <a href="#ai-reels">{t.nav.reels}</a>
          <a href="#process">{t.nav.process}</a>
          <a href="#calculator">{t.nav.calculator}</a>
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
          </a>
        </div>
      </header>

      <div id="top" />
      <LumenMorphHero
        headline={t.hero.headline}
        subheadline={t.hero.subheadline}
        ctaLabel={t.hero.primary}
        ctaHref="#audit"
        secondaryCtaLabel={t.hero.secondary}
        secondaryCtaHref={whatsappHref}
      />

      <section className="homepage-section homepage-section--services" id="services">
        <div className="section-shell">
          <div className="section-heading">
            <p className="section-kicker">{t.services.kicker}</p>
            <h2>{t.services.title}</h2>
            <p>{t.services.text}</p>
          </div>

          <div className="services-grid services-grid--complete">
            {t.services.items.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-card__body">
                  <p className="service-card__label">{service.label}</p>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <ul className="service-card__features">
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-section--social" id="social">
        <div className="section-shell social-layout">
          <div className="social-copy">
            <p className="section-kicker">{t.social.kicker}</p>
            <h2>{t.social.title}</h2>
            <p>{t.social.text}</p>
            <div className="social-stat">
              <strong>{t.social.metric}</strong>
              <span>{t.social.metricLabel}</span>
            </div>
            <div className="social-proof">
              {t.social.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="social-showcase" aria-label="Social media content layout preview">
            {t.social.mockups.map((mockup, index) => (
              <div
                className={
                  index === 0
                    ? "reel-frame reel-frame--primary"
                    : index === 1
                      ? "reel-frame reel-frame--secondary"
                      : "image-slot image-slot--wide"
                }
                key={mockup.title}
              >
                <span>{mockup.eyebrow}</span>
                <strong>{mockup.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-section--ai-reels" id="ai-reels">
        <div className="section-shell">
          <div className="section-heading section-heading--wide">
            <p className="section-kicker">{t.reels.kicker}</p>
            <h2>{t.reels.title}</h2>
            <p>{t.reels.subtitle}</p>
          </div>

          <div className="ai-reels-grid">
            {t.reels.items.map((reel) => (
              <AiReelSlot
                key={reel.category}
                reel={reel}
                placeholder={t.reels.placeholder}
                upload={t.reels.upload}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-section--process" id="process">
        <div className="section-shell">
          <div className="section-heading section-heading--compact">
            <p className="section-kicker">{t.process.kicker}</p>
            <h2>{t.process.title}</h2>
          </div>

          <div className="process-grid">
            {t.process.steps.map((item) => (
              <article className="process-step" key={item.step}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-section--audit" id="audit">
        <div className="audit-shell">
          <p className="section-kicker">{t.audit.kicker}</p>
          <h2>{t.audit.title}</h2>
          <p>{t.audit.text}</p>
          <div className="cta-row">
            <a className="audit-cta" href={whatsappHref}>
              {t.audit.primary}
            </a>
            <a className="secondary-contact" href={emailHref}>
              {t.audit.secondary}
            </a>
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-section--calculator" id="calculator">
        <div className="section-shell calculator-layout">
          <div className="section-heading calculator-heading">
            <p className="section-kicker">{t.calculator.kicker}</p>
            <h2>{t.calculator.title}</h2>
            <p>{t.calculator.text}</p>
          </div>

          <div className="calculator-panel">
            <div className="calculator-options" role="tablist" aria-label={t.nav.calculator}>
              {calculatorKeys.map((key) => (
                <button
                  className={calculatorChoice === key ? "is-active" : ""}
                  key={key}
                  onClick={() => setCalculatorChoice(key)}
                  type="button"
                >
                  {t.calculator.options[key].name}
                </button>
              ))}
            </div>

            <div className="calculator-result">
              <p>{t.calculator.estimateLabel}</p>
              <strong>{calculatorOption.range}</strong>
              <span>{calculatorOption.description}</span>
              <div className="calculator-includes">
                <small>{t.calculator.includedLabel}</small>
                <ul>
                  {calculatorOption.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <em>{t.calculator.note}</em>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-section--contact" id="contact">
        <div className="final-cta-shell">
          <p className="section-kicker">{t.contact.kicker}</p>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.text}</p>
          <div className="cta-row">
            <a className="audit-cta" href={whatsappHref}>
              {t.contact.whatsapp}
            </a>
            <a className="secondary-contact" href={emailHref}>
              {t.contact.email}
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__brand">
          <strong>{t.footer.studio}</strong>
          <span>{t.footer.location}</span>
        </div>
        <div className="site-footer__links">
          <a href={instagramHref}>{t.footer.instagram}</a>
          <a href={whatsappHref}>{t.footer.whatsapp}</a>
          <a href={emailHref}>{t.footer.email}</a>
          <button onClick={() => setLanguage(language === "es" ? "en" : "es")} type="button">
            {t.footer.language}
          </button>
        </div>
      </footer>

      <a className="floating-whatsapp" href={whatsappHref} aria-label={t.floating}>
        {t.floating}
      </a>
    </main>
  );
}
