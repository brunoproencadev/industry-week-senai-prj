import { useState, useEffect, useRef, FormEvent } from "react";
import {
  X, Sparkles, Check, ChevronRight,
  Cog, Zap, Monitor, Brain, GraduationCap, CalendarDays, ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register GSAP plugins once at module scope
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
 * STATIC DATA — Navigation items & Revolution card content
 * ───────────────────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: "hero",         label: "Início"  },
  { id: "revolucoes",   label: "4 Eras"  },
  { id: "revolucao-1",  label: "1ª Era"  },
  { id: "revolucao-2",  label: "2ª Era"  },
  { id: "revolucao-3",  label: "3ª Era"  },
  { id: "industria-4",  label: "4.0"     },
  { id: "legado-senai", label: "Legado"  },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

const REVOLUTION_CARDS = [
  {
    key: "1a-revolucao",
    icon: "cog" as const,
    tags: ["1760–1840", "MECANIZAÇÃO"],
    title: "1ª Revolução",
    subtitle: "A Era do Vapor",
    desc: "Teares mecânicos e máquinas a vapor substituíram o trabalho manual, inaugurando a produção fabril em escala global.",
    details: [
      "A máquina a vapor de James Watt (1769) revolucionou a produção têxtil britânica e desencadeou a industrialização mundial.",
      "Surgimento das primeiras fábricas e êxodo rural, criando o proletariado urbano industrial moderno.",
      "Carvão mineral tornou-se a principal fonte energética, alimentando ferrovias e navios a vapor intercontinentais.",
      "O SENAI nasce deste legado: formando torneiros, fundidores e mecânicos de precisão para a indústria nacional.",
    ],
  },
  {
    key: "2a-revolucao",
    icon: "zap" as const,
    tags: ["1870–1914", "ELETRIFICAÇÃO"],
    title: "2ª Revolução",
    subtitle: "Eletricidade e Escala",
    desc: "A eletricidade industrial e a linha de montagem fordista estabeleceram a produção em massa como paradigma dominante.",
    details: [
      "Thomas Edison e Nikola Tesla pavimentaram a eletrificação das fábricas, ampliando produtividade em múltiplos turnos.",
      "Henry Ford introduziu a linha de montagem em 1913, reduzindo o tempo de produção do Ford T de 12h para 93 minutos.",
      "Aço e petróleo emergiram como commodities estratégicas, alimentando a corrida industrial e armamentista global.",
      "O SENAI formou eletrotécnicos e operadores industriais para atender a nova economia eletrificada brasileira.",
    ],
  },
  {
    key: "3a-revolucao",
    icon: "monitor" as const,
    tags: ["1960–2000", "COMPUTAÇÃO"],
    title: "3ª Revolução",
    subtitle: "O Alvorecer Digital",
    desc: "Computadores pessoais, automação CNC e a internet transformaram a produção e exigiram um trabalhador mais qualificado.",
    details: [
      "O microprocessador Intel 4004 (1971) iniciou a miniaturização digital que levaria o computador ao bolso do trabalhador.",
      "CNC e robótica industrial automatizaram operações de usinagem e soldagem antes exclusivamente humanas.",
      "A internet conectou cadeias de suprimento e mercados globais, comprimindo tempo e distância de forma inédita.",
      "O SENAI adaptou currículos para mecatrônica, informática industrial e automação programável.",
    ],
  },
];

const FEATURE_CARDS = [
  { iconName: "brain",      title: "IA & Machine Learning",   desc: "Algoritmos que aprendem e otimizam processos produtivos em tempo real, reduzindo desperdícios e anomalias." },
  { iconName: "zap",        title: "Internet das Coisas (IoT)", desc: "Sensores conectados transformam máquinas físicas em ativos industriais inteligentes e rastreáveis." },
  { iconName: "monitor",    title: "Gêmeos Digitais",          desc: "Réplicas virtuais de ativos físicos para simulação, manutenção preditiva e otimização contínua." },
  { iconName: "graduation", title: "Computação em Nuvem",      desc: "Infraestrutura elástica que alimenta a manufatura distribuída, conectada e escalável globalmente." },
];

const TIMELINE = [
  { year: "1949",  label: "Fundação do SENAI Sorocaba",   desc: "Inauguração com cursos de mecânica e eletrotécnica voltados à indústria regional emergente." },
  { year: "1970s", label: "Era da Automação CNC",          desc: "Integração de programação numérica e usinagem de precisão ao currículo técnico." },
  { year: "1990s", label: "Informática Industrial",        desc: "Inserção de TI industrial, redes e sistemas supervisórios SCADA nos laboratórios." },
  { year: "2010s", label: "Mecatrônica e Robótica",        desc: "Novos cursos em mecatrônica, robótica industrial e automação avançada." },
  { year: "Hoje",  label: "IA e Manufatura Avançada",      desc: "Formação em Indústria 4.0, IA aplicada, IoT industrial e gêmeos digitais." },
];

/* ─────────────────────────────────────────────────────────────────────────
 * COMPONENT
 * ───────────────────────────────────────────────────────────────────────── */

export default function App() {
  /* ── UI STATE ─────────────────────────────────────────────────────────── */
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg,  setNotificationMsg]  = useState("");
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Visit registration form
  const [visitorName,    setVisitorName]    = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Mecatrônica");
  const [registered,     setRegistered]     = useState(false);

  // Theme + pull-down physics
  const [isDayMode,    setIsDayMode]    = useState(false);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [activeSection, setActiveSection] = useState<NavId>("hero");

  // Revolution detail info popup
  const [infoPopupContent, setInfoPopupContent] = useState<{
    title: string; details: string[];
  } | null>(null);

  // Lenis instance ref — used for programmatic scroll
  const lenisRef = useRef<Lenis | null>(null);

  /* ── LENIS + GSAP INITIALIZATION ──────────────────────────────────────── */
  useEffect(() => {
    // Physics-based smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Bridge Lenis RAF with GSAP ticker for synchronized scroll physics
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Scroll-triggered entrance animations (skipped if prefers-reduced-motion)
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      ["#revolucao-1", "#revolucao-2", "#revolucao-3", "#industria-4", "#legado-senai"].forEach((sel) => {
        const section = document.querySelector<HTMLElement>(sel);
        if (!section) return;
        const children = section.querySelectorAll<HTMLElement>(".anim-child");
        if (!children.length) return;

        // Set hidden initial state
        gsap.set(children, { opacity: 0, y: 70 });

        // Staggered entrance when section scrolls into view
        gsap.to(children, {
          opacity: 1, y: 0, duration: 0.95, stagger: 0.13, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 68%", once: true },
        });
      });
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* ── INTERSECTION OBSERVER — active section tracking ─────────────────── */
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id as NavId); }),
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.unobserve(el); });
  }, []);

  /* ── HANDLERS ─────────────────────────────────────────────────────────── */
  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  /** Smooth-scroll to a section using Lenis (native fallback) */
  const handleScrollTo = (id: string, label: string) => {
    const el = document.getElementById(id);
    if (el) {
      lenisRef.current ? lenisRef.current.scrollTo(el, { duration: 1.5 }) : el.scrollIntoView({ behavior: "smooth" });
      triggerNotification(`Navegando: ${label}`);
      setActiveSection(id as NavId);
    }
    setIsMobileMenuOpen(false);
  };

  /** Day/Night toggle with pull-down physics simulation */
  const handleThemeToggle = () => {
    setIsPullingDown(true);
    setTimeout(() => {
      setIsDayMode((prev) => {
        const next = !prev;
        triggerNotification(`Atmosfera: ${next ? "Modo Claro" : "Modo Escuro"}`);
        return next;
      });
    }, 250);
    setTimeout(() => setIsPullingDown(false), 450);
  };

  /** Handle SENAI visit form submission */
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    setRegistered(true);
    triggerNotification(`Visita registrada para: ${selectedCourse}!`);
    setTimeout(() => { setIsModalOpen(false); setTimeout(() => { setRegistered(false); setVisitorName(""); }, 500); }, 2500);
  };

  /** Open revolution detail popup */
  const handleCardClick = (cardKey: string) => {
    const card = REVOLUTION_CARDS.find((c) => c.key === cardKey);
    if (!card) return;
    setInfoPopupContent({ title: `${card.title} — ${card.subtitle}`, details: card.details });
    triggerNotification(`Detalhes: ${card.title}`);
  };

  /* ── DERIVED THEME SHORTCUTS ──────────────────────────────────────────── */
  const themeText    = isDayMode ? "text-stone-950" : "text-white";
  const themeSubText = isDayMode ? "text-stone-700"  : "text-white/75";
  const themeGlass   = isDayMode ? "liquid-glass-day" : "liquid-glass";

  /** Shared text-shadow style per theme */
  const headingShadow = isDayMode
    ? { textShadow: "0 4px 20px rgba(255,255,255,0.5)" }
    : { textShadow: "0 4px 20px rgba(0,0,0,0.7)" };
  const bodyShadow = isDayMode
    ? { textShadow: "0 2px 8px rgba(255,255,255,0.4)" }
    : { textShadow: "0 2px 10px rgba(0,0,0,0.5)" };

  /** Readability overlay background per theme */
  const overlay = (dark = "rgba(0,0,0,0.48)", light = "rgba(240,240,235,0.22)") =>
    isDayMode ? light : dark;

  /* ── RENDER ───────────────────────────────────────────────────────────── */
  return (
    <div className={`w-full min-h-screen ${
      isDayMode
        ? "bg-[#e2e8f0] text-stone-900 selection:bg-stone-900 selection:text-white"
        : "bg-black text-white selection:bg-white selection:text-black"
    } transition-colors duration-700 font-body relative overflow-x-hidden`}>

      {/* ── GLOBAL FIXED BACKGROUND (hero backdrop) ───────────────────── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <video
          className={isPullingDown ? "pull-down" : ""}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            opacity: isDayMode ? 0 : 0.75,
            transition: "transform 0.5s var(--return-easing), opacity 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          src="/background-dark.mp4" autoPlay loop muted playsInline poster="/4revnight.jpeg"
        />
        <video
          className={isPullingDown ? "pull-down" : ""}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            opacity: isDayMode ? 0.75 : 0,
            transition: "transform 0.5s var(--return-easing), opacity 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          src="/background-light.mp4" autoPlay loop muted playsInline poster="/4rev.jpeg"
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none transition-colors duration-700" />
      </div>

      {/* ── TOP EDGE BLUR ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-10 blur-overlay blur-overlay-top pointer-events-none z-10" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-6 lg:px-16 w-full" aria-label="Navegação principal">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo → Home */}
          <button onClick={() => handleScrollTo("hero","Início")}
            className={`w-12 h-12 flex items-center justify-center rounded-full overflow-hidden cursor-pointer border-0 hover:scale-105 transition-all p-1.5 ${themeGlass}`}
            aria-label="SENAI — Voltar ao início">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMs-P_A7rSKyVtrIYZlfFZhl681hIczMGzMw&s"
              alt="Logo SENAI" className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
          </button>

          {/* Desktop pill nav */}
          <div className={`hidden lg:flex items-center gap-0.5 rounded-full px-1.5 py-1.5 transition-all duration-300 ${themeGlass}`}
            role="menubar" aria-label="Links de seção">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} role="menuitem"
                onClick={() => handleScrollTo(item.id, item.label)}
                aria-current={activeSection === item.id ? "page" : undefined}
                className={`px-3 py-2 text-[10px] uppercase tracking-wider font-semibold transition-all font-body cursor-pointer rounded-full ${
                  activeSection === item.id
                    ? isDayMode ? "text-stone-950 bg-black/10 font-bold" : "text-white bg-white/10 font-bold"
                    : isDayMode ? "text-stone-700 hover:text-stone-950 hover:bg-black/5" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}>
                {item.label}
              </button>
            ))}
            <a href="https://sorocaba.sp.senai.br" target="_blank" rel="noopener noreferrer"
              aria-label="Acessar Portal SENAI Sorocaba (nova aba)"
              className="ml-3 font-body font-bold text-xs px-4 py-2 flex items-center gap-1.5 rounded-full cursor-pointer whitespace-nowrap bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02] transition-all no-underline">
              Portal SENAI
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Day / Night slider */}
            <button onClick={handleThemeToggle} aria-label={`Modo ${isDayMode ? "escuro" : "claro"}`} aria-pressed={isDayMode}
              className={`relative w-[112px] sm:w-[124px] h-10 sm:h-11 rounded-full p-1 flex items-center cursor-pointer border-0 overflow-hidden outline-none transition-all duration-500 shadow-md ${themeGlass}`}>
              <div className="absolute inset-0 flex items-center justify-between px-3.5 sm:px-4 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase pointer-events-none select-none font-body">
                <span className={`transition-all duration-500 ${isDayMode ? "text-stone-900 opacity-100 font-extrabold" : "text-white/20 opacity-30"}`}>Claro</span>
                <span className={`transition-all duration-500 ${isDayMode ? "text-stone-900/20 opacity-30" : "text-white opacity-100 font-extrabold"}`}>Escuro</span>
              </div>
              <div className={`absolute top-[3px] bottom-[3px] w-8 sm:w-9 h-8 sm:h-9 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.18)] border transition-all duration-500 pointer-events-none ${
                isDayMode ? "left-[3px] bg-white border-slate-200" : "left-[calc(100%-35px)] sm:left-[calc(100%-39px)] bg-white/20 border-white/30"}`}>
                {isDayMode
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-amber-500 animate-[spin_20s_linear_infinite]" aria-hidden="true">
                      <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.15" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.65 17.65l1.41 1.41M2 12h2M20 12h2M6.34 17.65l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
                    </svg>
                  : <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-indigo-200" aria-hidden="true">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}
              </div>
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors border-0 outline-none ${themeGlass} ${themeText}`}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={isMobileMenuOpen}>
              <div className="space-y-1.5 w-5" aria-hidden="true">
                <span className={`block h-[1px] ${isDayMode?"bg-black":"bg-white"} transition-all duration-300 ${isMobileMenuOpen?"rotate-45 translate-y-2":""}`} />
                <span className={`block h-[1px] ${isDayMode?"bg-black":"bg-white"} transition-all duration-300 ${isMobileMenuOpen?"opacity-0":""}`} />
                <span className={`block h-[1px] ${isDayMode?"bg-black":"bg-white"} transition-all duration-300 ${isMobileMenuOpen?"-rotate-45 -translate-y-1":""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAV PANEL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{opacity:0,y:-15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.25}}
            role="navigation" aria-label="Menu móvel"
            className={`fixed inset-x-0 top-[76px] mx-4 z-40 rounded-2xl lg:hidden flex flex-col p-5 space-y-3 shadow-2xl ${themeGlass} ${isDayMode?"text-stone-900":"text-white"}`}>
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => handleScrollTo(item.id, item.label)}
                  aria-current={activeSection === item.id ? "page" : undefined}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm uppercase tracking-wider font-semibold font-body transition-colors ${
                    activeSection === item.id
                      ? isDayMode?"bg-black/10 text-stone-950 font-bold":"bg-white/15 text-white font-bold"
                      : isDayMode?"hover:bg-black/5 text-stone-800":"hover:bg-white/10 text-white/90"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className={`border-t pt-3 ${isDayMode?"border-black/10":"border-white/10"}`}>
              <a href="https://sorocaba.sp.senai.br" target="_blank" rel="noopener noreferrer"
                className="w-full py-3 rounded-full font-bold text-center flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs uppercase tracking-wider no-underline">
                Acessar Portal SENAI
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════
          SEÇÃO HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section id="hero" aria-label="Início — As Quatro Revoluções Industriais e o SENAI"
        className="min-h-screen w-full flex flex-col justify-center items-center relative z-10 pt-32 pb-16 px-4">
        <div className="flex-1 max-w-5xl mx-auto flex flex-col justify-center items-center text-center w-full">

          {/* Badge pill */}
          <div className={`${themeGlass} rounded-full flex items-center p-1 pr-3 max-w-fit mb-6 transition-all duration-300`}>
            <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider border-none select-none">SENAI</span>
            <span className={`text-xs sm:text-sm font-semibold tracking-wide ml-2 ${themeSubText}`}>A Jornada da Industrialização Brasileira</span>
          </div>

          {/* H1 */}
          <h1 className={`text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic leading-[0.85] max-w-4xl tracking-[-4px] text-center mb-6 drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] ${themeText} ${isDayMode?"font-bold":""}`}>
            O Futuro foi Forjado na Indústria
          </h1>

          {/* Subheading */}
          <p className={`text-base md:text-lg max-w-2xl font-body font-light leading-snug text-center mb-10 ${isDayMode?"text-stone-800 font-semibold":"text-white/80"}`}>
            Quatro revoluções que transformaram o mundo — e prepararam o SENAI Sorocaba para formar os líderes da próxima era.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <button id="btn-hero-visit" onClick={() => { setIsModalOpen(true); triggerNotification("Abrindo formulário de visita..."); }}
              className={`liquid-glass-strong rounded-full px-6 py-3 text-sm font-bold text-white transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-2 shadow-2xl border border-white/20 select-none ${isDayMode?"bg-stone-900 hover:bg-black":"hover:bg-white/10"}`}>
              <Sparkles className="w-4 h-4 animate-pulse text-indigo-300" aria-hidden="true" />
              <span>Conhecer o SENAI</span>
            </button>
            <button id="btn-hero-explore" onClick={() => handleScrollTo("revolucoes","As 4 Eras")}
              className={`text-sm tracking-widest uppercase font-bold transition-all border-b border-transparent pb-0.5 hover:border-current cursor-pointer select-none ${themeText}`}>
              Explorar as Eras →
            </button>
          </div>

          {/* Milestone stats */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full max-w-xl mx-auto mb-16 px-4">
            {[
              { value: "1946",   label: "Fundação do SENAI no Brasil" },
              { value: "75+ Anos", label: "Formando profissionais de excelência" },
            ].map((s) => (
              <div key={s.value} className={`${themeGlass} p-6 flex-1 rounded-[1.25rem] text-left transition-all`}>
                <span className={`font-heading italic text-4xl sm:text-5xl tracking-[-1px] leading-none ${themeText}`}>{s.value}</span>
                <p className={`text-xs font-body font-light mt-2 leading-relaxed uppercase tracking-wider ${themeSubText}`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Institutional partners */}
          <div className="flex flex-col items-center gap-4 w-full mt-auto">
            <div className={`${themeGlass} rounded-full px-4 py-1.5 text-[9px] tracking-[0.25em] font-medium uppercase border ${isDayMode?"text-stone-900 border-stone-200":"text-white/90 border-white/5"}`}>
              PARCEIROS INSTITUCIONAIS
            </div>
            <div className={`flex flex-wrap items-center justify-center font-heading italic text-2xl md:text-3xl tracking-tight gap-12 md:gap-16 pb-2 select-none ${themeText}`}>
              {["SENAI","FIESP","CNI","MEC"].map((p) => (
                <span key={p} className="hover:opacity-100 opacity-80 transition-opacity">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SEÇÃO: REVOLUÇÕES OVERVIEW (ex-"Capabilities")
      ══════════════════════════════════════════════════════════════════ */}
      <section id="revolucoes" aria-label="As Quatro Eras da Revolução Industrial"
        className="min-h-screen w-full flex flex-col justify-center relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-16 bg-black">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full justify-between flex-1">

          <div className="mb-auto text-left w-full pt-6">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase block mb-4 text-white/60">
              02 // AS QUATRO ERAS DA INDÚSTRIA
            </span>
            <h2 className="font-heading italic text-white text-5xl md:text-7xl lg:text-[6.2rem] leading-[0.85] tracking-[-3px] max-w-5xl text-left">
              Do Vapor ao Algoritmo
            </h2>
          </div>

          {/* Revolution cards — clickable, open detail popup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
            {REVOLUTION_CARDS.map((card) => (
              <div key={card.key} role="button" tabIndex={0}
                onClick={() => handleCardClick(card.key)}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(card.key)}
                aria-label={`Ver marcos históricos: ${card.title}`}
                className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 border border-white/5 bg-white/0">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-11 h-11 rounded-[0.75rem] flex items-center justify-center liquid-glass bg-white/[0.02] border border-white/10 group-hover:scale-105 transition-all">
                    {card.icon === "cog"     && <Cog     className="w-5 h-5 text-white" aria-hidden="true" />}
                    {card.icon === "zap"     && <Zap     className="w-5 h-5 text-white" aria-hidden="true" />}
                    {card.icon === "monitor" && <Monitor className="w-5 h-5 text-white" aria-hidden="true" />}
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%] select-none">
                    {card.tags.map((tag) => (
                      <span key={tag} className="liquid-glass px-3 py-1.5 text-[10px] rounded-full text-white/90 font-body uppercase font-bold tracking-wider border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-8 text-left">
                  <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-1">{card.title}</h3>
                  <p className="text-xs font-body uppercase tracking-widest text-white/50 mb-3">{card.subtitle}</p>
                  <p className="text-sm font-body font-light leading-snug max-w-[32ch] text-white/80">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SEÇÃO 1 — A PRIMEIRA REVOLUÇÃO INDUSTRIAL
          Media: 1revnight.mp4 (dark) · 1revday.png (light)
          Layout: 2-col — giant typographic year + narrative content
      ══════════════════════════════════════════════════════════════════ */}
      <section id="revolucao-1" aria-label="A Primeira Revolução Industrial — A Era do Vapor"
        className={`section-container ${isDayMode?"theme-light":"theme-dark"}`}>
        <div className="blur-overlay blur-overlay-top"   aria-hidden="true" />
        <div className="blur-overlay blur-overlay-bottom" aria-hidden="true" />

        <div className="section-bg">
          <video style={{opacity:isDayMode?0:1,transition:"opacity 1.2s ease"}}
            src="/1revnight.mp4" autoPlay loop muted playsInline poster="/1revday.png" aria-hidden="true" />
          <img   style={{opacity:isDayMode?1:0,transition:"opacity 1.2s ease"}}
            src="/1revday.png" alt="" aria-hidden="true" />
          <div className="section-overlay" style={{background:overlay()}} aria-hidden="true" />
        </div>

        <div className="section-content px-8 md:px-16 lg:px-20 py-28 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70svh]">

            {/* Decorative year */}
            <div className="flex items-center justify-center lg:justify-start" aria-hidden="true">
              <span className={`rev-year ${isDayMode?"theme-light":""}`}>1760</span>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <span className={`section-label mb-4 anim-child ${isDayMode?"text-stone-600":"text-white/50"}`}>01 // 1760 — 1840</span>
              <h2 className={`font-heading italic text-5xl md:text-6xl lg:text-7xl leading-[0.85] tracking-[-3px] mb-6 anim-child ${isDayMode?"text-stone-950":"text-white"}`}
                style={headingShadow}>
                A Era do Vapor e da Mecanização
              </h2>
              <p className={`text-base md:text-lg font-body font-light leading-relaxed max-w-lg mb-8 anim-child ${isDayMode?"text-stone-800":"text-white/80"}`}
                style={bodyShadow}>
                A substituição do trabalho manual por máquinas a vapor redefiniu os paradigmas produtivos e inaugurou a sociedade industrial. A força humana cedeu espaço à potência do carvão, transformando a manufatura britânica — e gradualmente, o mundo inteiro.
              </p>
              <div className="flex flex-wrap gap-2 mb-8 anim-child">
                {["Máquina a Vapor","Tecelagem Mecânica","Energia a Carvão","Metalurgia Industrial"].map((t) => (
                  <span key={t} className="stat-pill">{t}</span>
                ))}
              </div>
              <button onClick={() => handleScrollTo("revolucao-2","2ª Revolução")}
                className={`anim-child self-start text-sm tracking-widest uppercase font-bold transition-all border-b border-transparent pb-0.5 hover:border-current cursor-pointer select-none ${isDayMode?"text-stone-900":"text-white"}`}>
                Próxima Era →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SEÇÃO 2 — A SEGUNDA REVOLUÇÃO INDUSTRIAL
          Media: 2revnight.mp4 (dark) · 2rev.png (light)
          Layout: Centered cinematic headline + floating stat pills
      ══════════════════════════════════════════════════════════════════ */}
      <section id="revolucao-2" aria-label="A Segunda Revolução Industrial — Eletricidade e Escala"
        className={`section-container ${isDayMode?"theme-light":"theme-dark"}`}>
        <div className="blur-overlay blur-overlay-top"   aria-hidden="true" />
        <div className="blur-overlay blur-overlay-bottom" aria-hidden="true" />

        <div className="section-bg">
          <video style={{opacity:isDayMode?0:1,transition:"opacity 1.2s ease"}}
            src="/2revnight.mp4" autoPlay loop muted playsInline poster="/2rev.png" aria-hidden="true" />
          <img   style={{opacity:isDayMode?1:0,transition:"opacity 1.2s ease"}}
            src="/2rev.png" alt="" aria-hidden="true" />
          <div className="section-overlay" style={{background:overlay("rgba(0,0,0,0.5)","rgba(238,235,225,0.25)")}} aria-hidden="true" />
        </div>

        <div className="section-content flex flex-col items-center justify-center px-8 md:px-16 py-32 text-center max-w-5xl mx-auto w-full min-h-[100svh]">
          <span className={`section-label mb-6 anim-child ${isDayMode?"text-stone-600":"text-white/50"}`}>02 // 1870 — 1914</span>
          <h2 className={`font-heading italic text-5xl md:text-7xl lg:text-[6rem] leading-[0.85] tracking-[-3px] mb-8 anim-child ${isDayMode?"text-stone-950":"text-white"}`}
            style={headingShadow}>
            Eletricidade, Escala e a Linha de Montagem
          </h2>
          <p className={`text-base md:text-xl font-body font-light leading-relaxed max-w-2xl mb-10 anim-child ${isDayMode?"text-stone-800":"text-white/80"}`}
            style={bodyShadow}>
            A energia elétrica iluminou fábricas e acelerou a produção em massa. Henry Ford transformou a montagem num ballet de precisão. O aço substituiu o ferro. O petróleo alimentou novas máquinas. A indústria atingiu sua primeira velocidade de cruzeiro global.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10 anim-child">
            {["Eletricidade Industrial","Linha de Montagem","Aço e Petróleo","Produção em Massa"].map((t) => (
              <span key={t} className="stat-pill">{t}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 anim-child w-full max-w-lg">
            {[
              { value:"1913",  label:"Ford lança a linha de montagem contínua" },
              { value:"10×",   label:"Ganho de produtividade industrial"         },
            ].map((s) => (
              <div key={s.value} className={`${themeGlass} p-5 flex-1 rounded-[1.25rem] text-left`}>
                <span className={`font-heading italic text-3xl tracking-[-1px] ${themeText}`}>{s.value}</span>
                <p className={`text-xs font-body mt-1 uppercase tracking-wider ${themeSubText}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SEÇÃO 3 — A TERCEIRA REVOLUÇÃO INDUSTRIAL
          Media: 3revnight.mp4 (dark) · 3revday.mp4 (light)
          Layout: Full-bleed, content bottom-anchored (cinema style)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="revolucao-3" aria-label="A Terceira Revolução Industrial — O Alvorecer Digital"
        className={`section-container ${isDayMode?"theme-light":"theme-dark"}`}>
        <div className="blur-overlay blur-overlay-top"   aria-hidden="true" />
        <div className="blur-overlay blur-overlay-bottom" aria-hidden="true" />

        <div className="section-bg">
          <video style={{opacity:isDayMode?0:1,transition:"opacity 1.2s ease"}}
            src="/3revnight.mp4" autoPlay loop muted playsInline aria-hidden="true" />
          <video style={{opacity:isDayMode?1:0,transition:"opacity 1.2s ease"}}
            src="/3revday.mp4" autoPlay loop muted playsInline aria-hidden="true" />
          <div className="section-overlay" style={{background:overlay("rgba(0,0,0,0.52)","rgba(235,238,245,0.28)")}} aria-hidden="true" />
        </div>

        {/* Bottom-anchored cinema layout */}
        <div className="section-content flex flex-col justify-end px-8 md:px-16 lg:px-20 pb-24 max-w-7xl mx-auto w-full min-h-[100svh]">
          <h2 className={`font-heading italic text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.85] tracking-[-4px] mb-6 anim-child ${isDayMode?"text-stone-950":"text-white"}`}
            style={headingShadow}>
            Computação, Automação e o Alvorecer Digital
          </h2>
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
            <div className="flex-1">
              <span className={`section-label mb-3 anim-child ${isDayMode?"text-stone-600":"text-white/50"}`}>03 // 1960 — 2000</span>
              <p className={`text-base md:text-lg font-body font-light leading-relaxed max-w-xl anim-child ${isDayMode?"text-stone-800":"text-white/80"}`}
                style={bodyShadow}>
                Transistores substituíram válvulas. A internet conectou o planeta. A automação programável liberou o trabalhador da linha de montagem e exigiu um novo perfil profissional — mais estratégico, mais qualificado e adaptável às constantes mudanças tecnológicas.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 anim-child lg:max-w-xs">
              {["Computadores Pessoais","Internet Global","Automação CNC","Robótica Industrial"].map((t) => (
                <span key={t} className="stat-pill">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SEÇÃO 4 — A INDÚSTRIA 4.0
          Media: 4revnight.jpeg (dark) · 4rev.jpeg (light)
          Layout: 2-col — text left, feature grid right
      ══════════════════════════════════════════════════════════════════ */}
      <section id="industria-4" aria-label="A Indústria 4.0 — Inteligência Artificial e Ecossistema Hiperconectado"
        className={`section-container ${isDayMode?"theme-light":"theme-dark"}`}>
        <div className="blur-overlay blur-overlay-top"   aria-hidden="true" />
        <div className="blur-overlay blur-overlay-bottom" aria-hidden="true" />

        <div className="section-bg">
          <img style={{opacity:isDayMode?0:1,transition:"opacity 1.2s ease"}} src="/4revnight.jpeg" alt="" aria-hidden="true" />
          <img style={{opacity:isDayMode?1:0,transition:"opacity 1.2s ease"}} src="/4rev.jpeg"      alt="" aria-hidden="true" />
          <div className="section-overlay" style={{background:overlay("rgba(0,0,0,0.55)","rgba(238,240,245,0.3)")}} aria-hidden="true" />
        </div>

        <div className="section-content px-8 md:px-16 lg:px-20 py-28 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70svh]">

            {/* Left: narrative */}
            <div className="flex flex-col justify-center">
              <span className={`section-label mb-4 anim-child ${isDayMode?"text-stone-600":"text-white/50"}`}>04 // 2010 — PRESENTE</span>
              <h2 className={`font-heading italic text-5xl md:text-6xl lg:text-7xl leading-[0.85] tracking-[-3px] mb-6 anim-child ${isDayMode?"text-stone-950":"text-white"}`}
                style={headingShadow}>
                Inteligência Artificial e o Ecossistema Hiperconectado
              </h2>
              <p className={`text-base md:text-lg font-body font-light leading-relaxed max-w-lg mb-8 anim-child ${isDayMode?"text-stone-800":"text-white/80"}`}
                style={bodyShadow}>
                A quarta revolução dissolve a fronteira entre o físico e o digital. Sistemas ciberfísicos, gêmeos digitais e a IoT criam fábricas que se automonitoram e aprendem continuamente. O profissional do futuro não opera máquinas — ele programa ecossistemas.
              </p>
              <button onClick={() => handleScrollTo("legado-senai","Legado SENAI")}
                className={`anim-child self-start text-sm tracking-widest uppercase font-bold transition-all border-b border-transparent pb-0.5 hover:border-current cursor-pointer select-none ${isDayMode?"text-stone-900":"text-white"}`}>
                O Papel do SENAI →
              </button>
            </div>

            {/* Right: 2×2 feature grid */}
            <div className="grid grid-cols-2 gap-4 anim-child">
              {FEATURE_CARDS.map((feat) => (
                <div key={feat.title} className="feature-card">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isDayMode?"bg-black/[0.06] border border-black/[0.08]":"bg-white/[0.08] border border-white/10"}`}>
                    {feat.iconName === "brain"      && <Brain         className={`w-4 h-4 ${isDayMode?"text-stone-800":"text-white"}`} aria-hidden="true" />}
                    {feat.iconName === "zap"        && <Zap           className={`w-4 h-4 ${isDayMode?"text-stone-800":"text-white"}`} aria-hidden="true" />}
                    {feat.iconName === "monitor"    && <Monitor       className={`w-4 h-4 ${isDayMode?"text-stone-800":"text-white"}`} aria-hidden="true" />}
                    {feat.iconName === "graduation" && <GraduationCap className={`w-4 h-4 ${isDayMode?"text-stone-800":"text-white"}`} aria-hidden="true" />}
                  </div>
                  <h3 className={`font-body font-bold text-sm mb-1.5 ${isDayMode?"text-stone-950":"text-white"}`}>{feat.title}</h3>
                  <p className={`text-xs font-body font-light leading-relaxed ${isDayMode?"text-stone-700":"text-white/70"}`}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SEÇÃO 5 — O LEGADO DO SENAI SOROCABA
          Background: Pure black #000 — cinematic conclusion
          Layout: Centered wordmark + historical timeline + CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section id="legado-senai" aria-label="O Legado do SENAI Sorocaba"
        className="section-container theme-dark" style={{background:"#000000"}}>
        <div className="blur-overlay blur-overlay-top"   aria-hidden="true" />
        <div className="blur-overlay blur-overlay-bottom" aria-hidden="true" />
        {/* Subtle blue depth glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{zIndex:1,backgroundImage:"radial-gradient(ellipse 80% 50% at 50% 0%,rgba(59,130,246,0.07) 0%,transparent 70%)"}}
          aria-hidden="true" />

        <div className="section-content flex flex-col items-center justify-center px-8 md:px-16 py-32 text-center max-w-5xl mx-auto w-full min-h-[100svh]">

          {/* Giant decorative wordmark */}
          <div className="mb-2 overflow-hidden" aria-hidden="true">
            <span className="font-heading italic select-none pointer-events-none block"
              style={{fontSize:"clamp(4rem,18vw,13rem)",lineHeight:0.85,letterSpacing:"-0.04em",color:"rgba(255,255,255,0.07)"}}>
              SENAI
            </span>
          </div>

          <span className="section-label text-white/35 mb-6 anim-child">SOROCABA · DESDE 1949</span>

          <h2 className="font-heading italic text-white text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-[-3px] mb-8 max-w-3xl anim-child"
            style={{textShadow:"0 4px 20px rgba(0,0,0,0.8)"}}>
            Formando os Profissionais de Cada Revolução
          </h2>

          <p className="text-base md:text-xl font-body font-light leading-relaxed max-w-2xl text-white/65 mb-16 anim-child">
            Por mais de 75 anos, o SENAI Sorocaba tem formado os profissionais que impulsionam cada revolução industrial. Do torneiro mecânico da era fordista ao especialista em IA da Indústria 4.0 — cada geração encontrou aqui a base para construir o futuro.
          </p>

          {/* Historical timeline */}
          <div className="w-full max-w-xl text-left mb-16 space-y-8 anim-child">
            {TIMELINE.map((m, idx) => (
              <div key={m.year} className="timeline-item">
                <div className="relative flex-shrink-0 mt-1">
                  <div className="timeline-dot" />
                  {idx < TIMELINE.length - 1 && <div className="timeline-line" />}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{m.year}</span>
                  <h3 className="font-body font-bold text-white text-base mt-0.5 mb-1">{m.label}</h3>
                  <p className="text-sm font-body font-light text-white/55 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center anim-child">
            <a href="https://sorocaba.sp.senai.br" target="_blank" rel="noopener noreferrer"
              id="btn-legado-portal"
              aria-label="Iniciar jornada no SENAI Sorocaba (nova aba)"
              className="liquid-glass-strong rounded-full px-8 py-4 text-sm font-bold text-white transition-all transform hover:scale-[1.03] active:scale-95 flex items-center gap-2 shadow-2xl border border-white/20 no-underline">
              <GraduationCap className="w-4 h-4 text-indigo-300" aria-hidden="true" />
              <span>Inicie sua Jornada no SENAI</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
            </a>
            <button onClick={() => { setIsModalOpen(true); triggerNotification("Abrindo formulário de visita..."); }}
              className="text-sm tracking-widest uppercase font-bold text-white/65 hover:text-white transition-colors border-b border-white/25 hover:border-white pb-0.5 cursor-pointer">
              Agendar uma Visita
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL — Agendar Visita ao SENAI
      ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />

            <motion.div initial={{opacity:0,scale:0.95,y:15}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95,y:15}} transition={{duration:0.35}}
              role="dialog" aria-modal="true" aria-label="Agendar visita ao SENAI"
              className="w-full max-w-md liquid-glass rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl border border-white/10 space-y-6">

              {/* Modal header */}
              <div className="flex justify-between items-center pb-2 border-b border-white/15">
                <div className="flex items-center gap-2 text-white">
                  <CalendarDays className="w-4 h-4 text-indigo-300" aria-hidden="true" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/80">Agende sua Visita</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} aria-label="Fechar"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/70 hover:text-white cursor-pointer border-none outline-none">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {!registered ? (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-light font-heading italic text-white leading-tight">Conheça o SENAI Sorocaba</h2>
                    <p className="text-xs text-stone-400">Agende uma visita guiada e descubra como formamos os profissionais do futuro industrial.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Area of interest */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider text-stone-300 uppercase">Área de Interesse</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Mecatrônica","Eletrotécnica","Automação","Informática"].map((curso) => (
                          <button key={curso} type="button" onClick={() => setSelectedCourse(curso)}
                            className={`py-2 px-3 text-[11px] rounded transition-all font-sans font-medium cursor-pointer border ${
                              selectedCourse === curso
                                ? "bg-white text-black border-white font-bold"
                                : "liquid-glass text-white/80 border-white/10 hover:border-white/30"}`}>
                            {curso}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider text-stone-300 uppercase" htmlFor="txt-visitor-name">
                        Seu Nome Completo
                      </label>
                      <input type="text" id="txt-visitor-name" value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Ex: Ana Carolina Silva" required
                        className="w-full bg-white/5 border border-white/10 focus:border-white rounded px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-stone-500 font-sans" />
                    </div>
                  </div>

                  <button type="submit" id="btn-modal-submit"
                    className="w-full bg-white text-black hover:bg-stone-200 transition-colors font-bold py-3 rounded flex items-center justify-center gap-2 cursor-pointer mt-2 text-sm uppercase tracking-wider">
                    <span>Confirmar Agendamento</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              ) : (
                <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                  className="py-6 text-center space-y-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-2">
                    <Check className="w-6 h-6 text-green-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-medium tracking-wide text-white">Visita Agendada!</h3>
                  <p className="text-xs text-stone-400 font-mono bg-white/5 p-3 rounded border border-white/10">
                    VISITANTE // {visitorName.toUpperCase() || "CONVIDADO"} — {selectedCourse.toUpperCase()}
                  </p>
                  <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
                    Sua visita ao SENAI Sorocaba foi registrada. Em breve entraremos em contato para confirmar data e horário.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════
          INFO POPUP — Revolution card details
      ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {infoPopupContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setInfoPopupContent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />

            <motion.div initial={{opacity:0,scale:0.95,y:15}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95,y:15}} transition={{duration:0.35}}
              role="dialog" aria-modal="true" aria-label="Marcos históricos da revolução"
              className={`w-full max-w-lg rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl border transition-all duration-300 ${
                isDayMode ? "bg-stone-50 border-stone-300 text-stone-900" : "liquid-glass text-white border-white/10"}`}>

              <div className={`flex justify-between items-center pb-2 border-b mb-4 ${isDayMode?"border-stone-200":"border-white/15"}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 animate-pulse ${isDayMode?"text-blue-600":"text-white"}`} aria-hidden="true" />
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isDayMode?"text-stone-700":"text-white/80"}`}>MARCOS HISTÓRICOS</span>
                </div>
                <button onClick={() => setInfoPopupContent(null)} aria-label="Fechar painel"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none outline-none ${isDayMode?"hover:bg-black/5 text-stone-600":"hover:bg-white/15 text-white/70"}`}>
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-4 text-left">
                <h2 className={`text-xl sm:text-2xl font-light font-heading italic leading-tight ${isDayMode?"text-stone-950 font-bold":"text-white"}`}>
                  {infoPopupContent.title}
                </h2>
                <div className="space-y-3 font-body">
                  {infoPopupContent.details.map((detail, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 text-[10px] font-bold ${isDayMode?"bg-stone-900 text-white":"bg-white text-black"}`}>
                        {i + 1}
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDayMode?"text-stone-800 font-medium":"text-stone-300"}`}>{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setInfoPopupContent(null)}
                className={`w-full py-2.5 rounded font-bold transition-all mt-6 text-sm cursor-pointer uppercase tracking-wider ${isDayMode?"bg-stone-950 text-white hover:bg-black":"bg-white text-black hover:bg-stone-200"}`}>
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── HUD STATUS NOTIFICATION TOAST ───────────────────────────── */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{opacity:0,y:20,x:"-50%"}} animate={{opacity:1,y:0,x:"-50%"}}
            exit={{opacity:0,y:-20,x:"-50%"}} transition={{duration:0.4,ease:"easeOut"}}
            role="status" aria-live="polite"
            className="fixed bottom-6 left-1/2 z-50 px-5 py-2.5 bg-black/95 border border-white/15 backdrop-blur-md rounded shadow-2xl tracking-widest uppercase text-[10px] sm:text-xs text-stone-200 text-center min-w-[280px] pointer-events-none font-mono">
            <span className="text-white/40 font-bold mr-1">//</span> {notificationMsg}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
