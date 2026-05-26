import { useState, useEffect, FormEvent } from "react";
import { X, Sparkles, Check, ChevronRight, Orbit, Shield, Cpu, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Custom reservation state
  const [nickname, setNickname] = useState("");
  const [selectedDest, setSelectedDest] = useState("Sistemas Avançados");
  const [reserved, setReserved] = useState(false);

  const [isDayMode, setIsDayMode] = useState(false);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Informative details modal state for interactive card clicks
  const [infoPopupContent, setInfoPopupContent] = useState<{ title: string; details: string[] } | null>(null);

  // Intersection observer to track the active viewport section
  useEffect(() => {
    const sections = ["hero", "capabilities"];
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleScrollTo = (id: string, label: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      triggerNotification(`Rolar para: ${label}`);
      setActiveSection(id);
    }
    setIsMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    setIsPullingDown(true);
    
    setTimeout(() => {
      setIsDayMode((prev) => {
        const targetDay = !prev;
        triggerNotification(`Ambiente atmosférico: ${targetDay ? "Modo Claro" : "Modo Escuro"}`);
        return targetDay;
      });
    }, 250);

    setTimeout(() => {
      setIsPullingDown(false);
    }, 450);
  };

  const handleReserve = (e: FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setReserved(true);
    triggerNotification(`Visita e candidatura registradas para: ${selectedDest}!`);
    setTimeout(() => {
      setIsModalOpen(false);
      setTimeout(() => {
        setReserved(false);
        setNickname("");
      }, 500);
    }, 2500);
  };

  const handleCardClick = (cardTitle: string) => {
    if (cardTitle === "Astrodynamics & Trajectory") {
      setInfoPopupContent({
        title: "Astrodynamics & Trajectory System",
        details: [
          "Calculadora orbital de múltiplos corpos otimizada para a janela de trânsito de 2026.",
          "Correção planetária autônoma por borda com computação de baixíssima latência.",
          "Simulador integrado SENAI para planejamento de inserção de órbita elíptica em Marte.",
          "Gestão dinâmica automatizada de propelente líquido criogênico."
        ]
      });
      triggerNotification("Exibindo especificações de Astrodynamics...");
    } else if (cardTitle === "Atmospheric Shielding") {
      setInfoPopupContent({
        title: "Active Electromagnetic Shielding System",
        details: [
          "Deflexão Magnetohidrodinâmica ativa capaz de suprimir fluxos térmicos extremos.",
          "Matriz de compósitos cerâmicos de grafeno suportando picos superiores a 2.200 °C.",
          "Sensores termográficos acoplados com feedback instantâneo para a matriz cibernética.",
          "Proteção robusta e redundância testada sob padrões de reentrada planetária aerodinâmica."
        ]
      });
      triggerNotification("Exibindo especificações de Escudo Atmosférico...");
    } else if (cardTitle === "Helium-3 Nuclear Drive") {
      setInfoPopupContent({
        title: "Helium-3 Thermonuclear Propulsion Drive",
        details: [
          "Motor de fusão nuclear de Hélio-3 fornecendo empuxo contínuo ultraeficiente em viagens longas.",
          "Sincronização de gêmeo digital atualizada a cada milissegundo de queima do reator.",
          "Sistemas de segurança ciberfísica integrados para mitigação instantânea de anomalias magnéticas.",
          "Laboratório piloto SENAI Sorocaba focado no monitoramento e controle inteligente de plasma."
        ]
      });
      triggerNotification("Exibindo telemetria do Reator de Hélio-3...");
    }
  };

  return (
    <div className={`w-full min-h-screen ${isDayMode ? "bg-[#e2e8f0] text-stone-900 selection:bg-stone-900 selection:text-white" : "bg-black text-white selection:bg-white selection:text-black"} transition-colors duration-700 font-body relative overflow-x-hidden`}>
      
      {/* 1. CINEMATIC GRADIENT / BLUR OVERLAYS & FIXED PARALLAX VIDEOS */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <video 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isPullingDown ? "pull-down" : ""}`}
          style={{ 
            opacity: isDayMode ? 0 : 0.75,
            transition: "transform 0.5s var(--return-easing), opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          src="/background-dark.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
        <video 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isPullingDown ? "pull-down" : ""}`}
          style={{ 
            opacity: isDayMode ? 0.75 : 0,
            transition: "transform 0.5s var(--return-easing), opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          src="/background-light.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
        {/* Subtle black overlay to blend nicely with pure black (#000) base if darkened */}
        <div className={`absolute inset-0 bg-black/10 pointer-events-none transition-colors duration-700`} />
      </div>

      {/* Decorative view headers & subtle blur transitions in scroll container */}
      <div className="absolute top-0 left-0 right-0 h-10 blur-overlay blur-overlay-top pointer-events-none z-10" />

      {/* 2. CINEMATIC SCROLLING BRANDED NAVBAR */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-6 lg:px-16 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Branded Logo Box */}
          <button
            onClick={() => handleScrollTo("hero", "Missão")}
            className={`w-12 h-12 flex items-center justify-center rounded-full overflow-hidden cursor-pointer select-none border-0 hover:scale-105 transition-all p-1.5 ${
              isDayMode 
                ? "liquid-glass-day shadow-[0_2px_8px_rgba(0,0,0,0.08)]" 
                : "liquid-glass"
            }`}
            aria-label="SENAI Space Logo Home"
          >
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMs-P_A7rSKyVtrIYZlfFZhl681hIczMGzMw&s" 
              alt="SENAI Logo" 
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Center Scroll Links Container (Pill Styled) */}
          <div className={`hidden md:flex items-center gap-1 rounded-full px-1.5 py-1.5 transition-all duration-300 ${
            isDayMode 
              ? "liquid-glass-day shadow-[0_4px_12px_rgba(0,0,0,0.04)]" 
              : "liquid-glass"
          }`}>
            {[
              { id: "hero", label: "Missão // Mars" },
              { id: "capabilities", label: "Capacidades Core" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id, item.label)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all font-body cursor-pointer rounded-full ${
                  activeSection === item.id
                    ? isDayMode
                      ? "text-stone-950 bg-black/10 font-bold"
                      : "text-white bg-white/10 font-bold"
                    : isDayMode
                      ? "text-stone-700 hover:text-stone-950 hover:bg-black/5"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Embedded CTA link button */}
            <a
              href="https://sorocaba.sp.senai.br"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-all font-body font-bold text-xs px-4 py-2 flex items-center gap-1.5 rounded-full cursor-pointer ml-4 whitespace-nowrap text-decoration-none ${
                isDayMode 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:scale-[1.02]"
                  : "bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02]"
              }`}
            >
              Portal SENAI
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Right Display Mode Control Slider */}
          <div className="flex items-center gap-3">
            
            <button
              onClick={handleThemeToggle}
              className={`relative w-[112px] sm:w-[124px] h-10 sm:h-11 rounded-full p-1 flex items-center cursor-pointer select-none border-0 overflow-hidden outline-none transition-all duration-500 shadow-md ${
                isDayMode 
                  ? "liquid-glass-day" 
                  : "liquid-glass"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-between px-3.5 sm:px-4 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase pointer-events-none select-none font-body w-full">
                <span className={`transition-all duration-500 ease-out ${isDayMode ? "text-stone-900 opacity-100 font-extrabold" : "text-white/20 opacity-30"}`}>
                  Claro
                </span>
                <span className={`transition-all duration-500 ease-out ${isDayMode ? "text-stone-900/20 opacity-30" : "text-white opacity-100 font-extrabold"}`}>
                  Escuro
                </span>
              </div>

              {/* Slider head */}
              <div
                className={`absolute top-[3px] bottom-[3px] w-8 sm:w-9 h-8 sm:h-9 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.18)] border transition-all duration-500 pointer-events-none ${
                  isDayMode
                    ? "left-[3px] bg-white border-slate-200"
                    : "left-[calc(100%-35px)] sm:left-[calc(100%-39px)] bg-white/20 border-white/30"
                }`}
              >
                {isDayMode ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4.5 h-4.5 text-amber-500 animate-[spin_20s_linear_infinite]">
                    <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.15" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.65 17.65l1.41 1.41M2 12h2M20 12h2M6.34 17.65l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" className="w-4.5 h-4.5 text-indigo-200">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors border-0 outline-none ${
                isDayMode ? "liquid-glass-day text-black" : "liquid-glass text-white"
              }`}
              aria-label="Toggle navigation menu"
            >
              <div className="space-y-1.5 w-5">
                <span className={`block h-[1px] ${isDayMode ? "bg-black" : "bg-white"} transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`block h-[1px] ${isDayMode ? "bg-black" : "bg-white"} transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`block h-[1px] ${isDayMode ? "bg-black" : "bg-white"} transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
              </div>
            </button>

          </div>

        </div>
      </nav>

      {/* MOBILE NAV PANEL OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-x-0 top-[76px] mx-6 z-40 rounded-2xl md:hidden flex flex-col p-6 space-y-4 shadow-2xl transition-all duration-300 ${
              isDayMode ? "liquid-glass-day text-stone-900 border-stone-200" : "liquid-glass text-white"
            }`}
          >
            <div className="flex flex-col space-y-2">
              {[
                { id: "hero", label: "Missão // Mars" },
                { id: "capabilities", label: "Capacidades Core" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id, item.label)}
                  className={`w-full text-left px-4 py-3 rounded text-sm uppercase tracking-wider font-semibold font-body transition-colors ${
                    activeSection === item.id
                      ? isDayMode
                        ? "bg-black/10 text-stone-950 font-bold"
                        : "bg-white/15 text-white font-bold"
                      : isDayMode
                        ? "hover:bg-black/5 text-stone-800"
                        : "hover:bg-white/10 text-white/90"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <a
                href="https://sorocaba.sp.senai.br"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full font-bold text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-blue-600 text-white hover:bg-blue-700 text-decoration-none text-xs uppercase tracking-wider"
              >
                Acessar Portal SENAI
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: HERO (SCROLL SECTION 1) */}
      <section id="hero" className="min-h-screen w-full flex flex-col justify-center items-center relative z-10 pt-32 pb-16 px-4">
        
        {/* Main Content Card Wrapper (Flex Centered, vertically and horizontally aligned) */}
        <div className="flex-1 max-w-5xl mx-auto flex flex-col justify-center items-center text-center w-full">
          
          {/* Badge Widget Container */}
          <div className={`liquid-glass rounded-full flex items-center p-1 pr-3 max-w-fit mb-6 transition-all duration-300 ${
            isDayMode ? "liquid-glass-day border-stone-200 shadow-sm" : ""
          }`}>
            <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider scale-95 border-none select-none">
              New
            </span>
            <span className={`text-xs sm:text-sm font-semibold tracking-wide ml-2 ${
              isDayMode ? "text-stone-900" : "text-white/90"
            }`}>
              Maiden Crewed Voyage to Mars Arrives 2026
            </span>
          </div>

          {/* Big display Headline */}
          <h1 className={`text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] max-w-4xl tracking-[-4px] text-center mb-6 drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] ${
            isDayMode ? "text-stone-950 font-bold" : ""
          }`}>
            Venture Past Our Sky Across the Universe
          </h1>

          {/* Light descriptive subheading */}
          <p className={`text-base md:text-lg max-w-2xl font-body font-light leading-snug text-center mb-10 ${
            isDayMode ? "text-stone-800 font-semibold" : "text-white/80"
          }`}>
            The dawn of interplanetary voyages. Experience deep space corridors crafted through advanced mechanical navigation, digital synchronization, and SENAI's absolute precision training laboratories.
          </p>

          {/* Action CTAs Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <button
              onClick={() => {
                setIsModalOpen(true);
                triggerNotification("Iniciando credenciamento de tripulação Mars Voyage...");
              }}
              className={`liquid-glass-strong rounded-full px-6 py-3 text-sm font-bold text-white transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-2 shadow-2xl border border-white/20 select-none ${
                isDayMode ? "bg-stone-900 hover:bg-black" : "hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse text-indigo-300" />
              <span>Claim Your Berth</span>
            </button>
            
            <button 
              onClick={() => handleScrollTo("capabilities", "Capacidades")}
              className={`text-sm tracking-widest uppercase font-bold transition-all border-b border-transparent pb-0.5 hover:border-white cursor-pointer select-none ${
                isDayMode ? "text-stone-900 hover:border-stone-900" : "text-white hover:border-white"
              }`}
            >
              Explore Capabilities
            </button>
          </div>

          {/* Immersive stats blocks row */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full max-w-xl mx-auto mb-16 px-4">
            <div className={`liquid-glass p-6 flex-1 rounded-[1.25rem] text-left transition-all ${
              isDayMode ? "liquid-glass-day border-stone-200" : ""
            }`}>
              <span className={`font-heading italic text-white text-4xl sm:text-5xl tracking-[-1px] leading-none ${
                isDayMode ? "text-stone-950 font-bold" : ""
              }`}>
                260M km
              </span>
              <p className={`text-xs font-body font-light mt-2 leading-relaxed uppercase tracking-wider ${
                isDayMode ? "text-stone-700 font-semibold" : "text-white/70"
              }`}>
                Average transit distance to Martian orbit
              </p>
            </div>
            
            <div className={`liquid-glass p-6 flex-1 rounded-[1.25rem] text-left transition-all ${
              isDayMode ? "liquid-glass-day border-stone-200" : ""
            }`}>
              <span className={`font-heading italic text-white text-4xl sm:text-5xl tracking-[-1px] leading-none ${
                isDayMode ? "text-stone-950 font-bold" : ""
              }`}>
                180 Days
              </span>
              <p className={`text-xs font-body font-light mt-2 leading-relaxed uppercase tracking-wider ${
                isDayMode ? "text-stone-700 font-semibold" : "text-white/70"
              }`}>
                Projected duration of outbound flight
              </p>
            </div>
          </div>

          {/* Constellation Mission Partners */}
          <div className="flex flex-col items-center gap-4 w-full mt-auto">
            <div className={`liquid-glass rounded-full chip px-4 py-1.5 text-[9px] tracking-[0.25em] font-medium text-white/90 uppercase border border-white/5 ${
              isDayMode ? "liquid-glass-day text-stone-900 border-stone-200" : ""
            }`}>
              MISSION CONSTELLATIONPARTNERS
            </div>
            <div className={`flex flex-wrap items-center justify-center font-heading italic text-white text-2xl md:text-3xl tracking-tight gap-12 md:gap-16 pb-2 select-none ${
              isDayMode ? "text-stone-950 font-bold" : ""
            }`}>
              <span className="hover:opacity-100 opacity-80 transition-opacity">NASA</span>
              <span className="hover:opacity-100 opacity-80 transition-opacity">ESA</span>
              <span className="hover:opacity-100 opacity-80 transition-opacity">JAXA</span>
              <span className="hover:opacity-100 opacity-80 transition-opacity">SENAI</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: CAPABILITIES (SCROLL SECTION 2) */}
      <section id="capabilities" className="min-h-screen w-full flex flex-col justify-center relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-16 bg-black">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full justify-between flex-1">
          
          {/* Header Layout Component */}
          <div className="mb-auto text-left w-full pt-6">
            <span className={`text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase block mb-4 ${
              isDayMode ? "text-stone-400 font-bold" : "text-white/60"
            }`}>
              02 // CORE CAPABILITY SPECIFICATIONS
            </span>
            <h2 className="font-heading italic text-white text-5xl md:text-7xl lg:text-[6.2rem] leading-[0.85] tracking-[-3px] max-w-5xl text-left">
              Engineering the Interplanetary Future
            </h2>
          </div>

          {/* Capabilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
            
            {/* Card 1: Astrodynamics & Trajectory */}
            <div 
              onClick={() => handleCardClick("Astrodynamics & Trajectory")}
              className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 border border-white/5 border-solid bg-white/0"
            >
              {/* Card top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-[0.75rem] flex items-center justify-center liquid-glass bg-white/[0.02] border border-white/10 group-hover:scale-105 transition-all">
                  <Orbit className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%] select-none">
                  <span className="liquid-glass px-3 py-1.5 text-[10px] rounded-full text-white/90 font-body uppercase font-bold tracking-wider border border-white/5">
                    ORBITAL
                  </span>
                  <span className="liquid-glass px-3 py-1.5 text-[10px] rounded-full text-white/90 font-body uppercase font-bold tracking-wider border border-white/5">
                    AUTO-ALIGN
                  </span>
                </div>
              </div>

              {/* Card bottom section */}
              <div className="mt-8 text-left">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">
                  Astrodynamics & Trajectory
                </h3>
                <p className="text-sm font-body font-light leading-snug max-w-[32ch] text-white/80">
                  Predictive orbital alignment systems for minimal fuel transfer windows, optimized by advanced mechanical automation.
                </p>
              </div>
            </div>

            {/* Card 2: Atmospheric Shielding */}
            <div 
              onClick={() => handleCardClick("Atmospheric Shielding")}
              className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 border border-white/5 border-solid bg-white/0"
            >
              {/* Card top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-[0.75rem] flex items-center justify-center liquid-glass bg-white/[0.02] border border-white/10 group-hover:scale-105 transition-all">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%] select-none">
                  <span className="liquid-glass px-3 py-1.5 text-[10px] rounded-full text-white/90 font-body uppercase font-bold tracking-wider border border-white/5">
                    ACTIVE-SHIELD
                    </span>
                  <span className="liquid-glass px-3 py-1.5 text-[10px] rounded-full text-white/90 font-body uppercase font-bold tracking-wider border border-white/5">
                    THERMAL-MHD
                  </span>
                </div>
              </div>

              {/* Card bottom section */}
              <div className="mt-8 text-left">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">
                  Atmospheric Shielding
                </h3>
                <p className="text-sm font-body font-light leading-snug max-w-[32ch] text-white/80">
                  State-of-the-art active magnetic shielding matrices mitigating solar wind radiation hazards during hypersonic re-entries.
                </p>
              </div>
            </div>

            {/* Card 3: Helium-3 Nuclear Drive */}
            <div 
              onClick={() => handleCardClick("Helium-3 Nuclear Drive")}
              className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 border border-white/5 border-solid bg-white/0"
            >
              {/* Card top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-[0.75rem] flex items-center justify-center liquid-glass bg-white/[0.02] border border-white/10 group-hover:scale-105 transition-all">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%] select-none">
                  <span className="liquid-glass px-3 py-1.5 text-[10px] rounded-full text-white/90 font-body uppercase font-bold tracking-wider border border-white/5">
                    PROPULSION
                  </span>
                  <span className="liquid-glass px-3 py-1.5 text-[10px] rounded-full text-white/90 font-body uppercase font-bold tracking-wider border border-white/5">
                    HE-3 DRIVE
                  </span>
                </div>
              </div>

              {/* Card bottom section */}
              <div className="mt-8 text-left">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">
                  Helium-3 Nuclear Drive
                </h3>
                <p className="text-sm font-body font-light leading-snug max-w-[32ch] text-white/80">
                  High-impulse nuclear thermal fusion engines monitored live through sub-millisecond physical digital twin simulators.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MARS CREW REGISTRATION MODAL SYSTEM (Immersive liquid-glass popup) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Blur overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Liquid-glass modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md liquid-glass rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl border border-white/10 space-y-6"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/15 overflow-hidden">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/80">Credenciamento Ares Voyage</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/70 hover:text-white cursor-pointer border-none outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!reserved ? (
                <form onSubmit={handleReserve} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-light font-heading italic text-white leading-tight">
                      Agende Sua Cabine
                    </h2>
                    <p className="text-xs text-stone-400">
                      Escolha seu setor de treinamento e solicite o bilhete de embarque Mars 2026.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Destination Sector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider text-stone-300 uppercase">Setor de Atuação</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Navegação", "Sistemas", "Propulsão"].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDest(d)}
                            className={`py-2 px-1 text-[11px] rounded transition-all font-sans font-medium pointer-events-auto cursor-pointer border ${
                              selectedDest === d
                                ? "bg-white text-black border-white font-bold"
                                : "liquid-glass text-white/80 border-white/10 hover:border-white/30"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Passenger Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold tracking-wider text-stone-300 uppercase" htmlFor="txt-pilot-name">
                        Nome do Candidato à Tripulação
                      </label>
                      <input
                        type="text"
                        id="txt-pilot-name"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Ex: Major Amanda Ribeiro"
                        required
                        className="w-full bg-white/5 border border-white/10 focus:border-white rounded px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-stone-500 font-sans"
                      />
                    </div>
                  </div>

                  {/* Submit Spot Plan */}
                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-stone-200 transition-colors font-bold py-3 rounded flex items-center justify-center gap-2 cursor-pointer mt-2 text-sm uppercase tracking-wider"
                  >
                    <span>Confirmar Solicitação de Embarque</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-4 flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-2">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium tracking-wide text-white">Solicitação Enviada com Sucesso!</h3>
                  <p className="text-xs text-stone-400 font-mono bg-white/5 p-3 rounded border border-white/10 inline-block">
                    REGISTRY // {nickname.toUpperCase() || "VISITANTE"} - {selectedDest.toUpperCase()}
                  </p>
                  <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
                    Sua candidatura científica para a expedição de 2026 foi gravada securitariamente no laboratório integrativo SENAI Sorocaba. As diretrizes serão enviadas ao canal cadastrado.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED TECHNICAL INFORMATION POPUP PANEL */}
      <AnimatePresence>
        {infoPopupContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoPopupContent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Frost system details container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35 }}
              className={`w-full max-w-lg rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl border transition-all duration-300 ${
                isDayMode 
                  ? "bg-stone-50 border-stone-300 text-stone-900 shadow-stone-900/15"
                  : "liquid-glass text-white border-white/10"
              }`}
            >
              <div className={`flex justify-between items-center pb-2 border-b overflow-hidden ${
                isDayMode ? "border-stone-200" : "border-white/15"
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 animate-pulse ${isDayMode ? "text-blue-600" : "text-white"}`} />
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                    isDayMode ? "text-stone-700" : "text-white/80"
                  }`}>ESPECIFICAÇÕES TÉCNICAS</span>
                </div>
                <button
                  onClick={() => setInfoPopupContent(null)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none outline-none ${
                    isDayMode ? "hover:bg-black/5 text-stone-600 hover:text-stone-950" : "hover:bg-white/15 text-white/70 hover:text-white"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 pt-3 text-left">
                <h2 className={`text-xl sm:text-2xl font-light font-heading italic leading-tight ${
                  isDayMode ? "text-stone-950 font-bold" : "text-white"
                }`}>
                  {infoPopupContent.title}
                </h2>
                
                <div className="space-y-3 font-body">
                  {infoPopupContent.details.map((detail, index) => (
                    <div key={index} className="flex gap-2.5 items-start">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 text-[10px] font-bold ${
                        isDayMode ? "bg-stone-900 text-white" : "bg-white text-black"
                      }`}>
                        {index + 1}
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${
                        isDayMode ? "text-stone-800 font-medium" : "text-stone-300"
                      }`}>
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setInfoPopupContent(null)}
                className={`w-full py-2.5 rounded font-bold transition-all mt-6 text-sm cursor-pointer uppercase tracking-wider ${
                  isDayMode 
                    ? "bg-stone-950 text-white hover:bg-black"
                    : "bg-white text-black hover:bg-stone-200"
                }`}
              >
                Fechar Painel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REAL-TIME HUD STATUS NOTIFICATION FEED */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 z-50 px-5 py-2.5 bg-black/95 border border-white/15 backdrop-blur-md rounded shadow-2xl tracking-widest uppercase text-[10px] sm:text-xs text-stone-200 text-center min-w-[280px] pointer-events-none font-mono"
          >
            <span className="text-white/40 font-bold mr-1">//</span> {notificationMsg}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
