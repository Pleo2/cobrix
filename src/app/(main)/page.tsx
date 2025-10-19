'use client'

import { useState } from 'react';
import { Navbar } from "@/components/marketing/navbar";
import Link from "next/link";
import { BellIcon, LayoutDashboardIcon, CreditCardIcon, CheckCircle2Icon, ArrowRight, Zap, TrendingUp, Clock, Heart, Twitter, Linkedin, Instagram, LucideIcon } from "lucide-react";
import { Hummingbird } from "@/components/marketing/hummingbird";
import { Container } from "@/components/container";
import { useInView } from "@/hooks/use-in-view";
import { TextAnimate } from "@/components/ui/text-animate";
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
  stat: string;
  color: string;
}

function LoadingTransition({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{
        background: isVisible
          ? 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
          : 'transparent',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white font-semibold text-lg animate-pulse">Cargando...</p>
      </div>
    </div>
  );
}

function Hero() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigation = (href: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(href);
    }, 800);
  };
  return (
    <div className="relative h-full bg-[#F7f7f7] overflow-hidden">
      {/* Pájaro flotando encima - Desktop: lado derecho, Tablet: más pequeño arriba derecha, Mobile: oculto */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            key="hummingbird"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.7,
              y: -50,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="absolute top-0 right-0 w-full h-1/3 md:h-1/2 md:w-1/2 lg:w-2/3 lg:h-full z-50 pointer-events-none hidden sm:block"
          >
            <Hummingbird className="rounded-4xl" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col relative w-full min-h-screen justify-between z-10">
        <Navbar />
        <AnimatePresence>
          {!isTransitioning && (
            <motion.div
              key="hero-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ 
                opacity: 0, 
                x: -30,
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
              className="relative flex h-full items-end pb-12 pl-4 sm:pl-8 lg:pl-4"
            >
              <div className="absolute -left-2 bg-gradient-to-r from-[#F7f7f7] to-transparent w-full max-w-3xl h-full rounded-b-4xl blur-2xl overlow-visible" style={{ zIndex: 5 }}></div>
              <div className="relative p-4 sm:p-8 md:p-12 w-full sm:max-w-xl md:max-w-2xl" style={{ zIndex: 60 }}>
            <TextAnimate
              animation="blurInUp"
              by="word"
              duration={1.5}
              delay={0.2}
              startOnView={false}
              once={true}
              as="h1"
              className="text-left font-display text-5xl/[1.1] font-bold tracking-tight text-balance sm:text-6xl/[1.1] md:text-7xl/[1.1] text-gray-900"
            >
              Automatiza tus cobros y mejora tu flujo de caja
            </TextAnimate>
            <TextAnimate
              animation="blurInUp"
              by="word"
              duration={1.2}
              delay={1.8}
              startOnView={false}
              once={true}
              as="p"
              className="text-left mt-6 text-lg font-medium sm:text-xl text-gray-700"
            >
              La plataforma que simplifica la gestión de cobros recurrentes para PYMEs en Venezuela.
            </TextAnimate>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => handleNavigation('/register')}
                className="group relative bg-slate-900 h-16 w-full sm:w-64 border-2 border-primary text-white text-base font-bold rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:border-emerald-400 hover:text-emerald-300 p-3 text-left before:absolute before:w-10 before:h-10 before:content-[''] before:right-2 before:top-2 before:z-10 before:bg-primary before:rounded-full before:blur-lg before:transition-all before:duration-500 after:absolute after:z-10 after:w-16 after:h-16 after:content-[''] after:bg-emerald-400 after:right-6 after:top-4 after:rounded-full after:blur-lg after:transition-all after:duration-500 hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:after:-right-6 hover:after:scale-110 z-80"
              >
                <span className="relative z-20">Empecemos juntos</span>
              </button>
            </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <LoadingTransition isVisible={isTransitioning} />
    </div>
  )
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, isInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="group relative bg-[#F7f7f7] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full">
        {/* Gradiente animado en hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Icono con efecto brillante */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
          <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
            <feature.icon className="w-8 h-8" />
          </div>
        </div>
        
        <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
          {feature.title}
        </h4>
        <p className="text-gray-600 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Flecha animada en hover */}
        <div className="mt-6 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
          <span className="text-sm">Conocer más</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  const { ref: headerRef, isInView: headerInView } = useInView()
  
  const features = [
    {
      icon: BellIcon,
      title: "Notificaciones Automáticas",
      description: "Envía recordatorios de pago programados y personalizables a través de email, SMS y WhatsApp. Tu cliente siempre estará informado sin que muevas un dedo.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: LayoutDashboardIcon,
      title: "Dashboard Centralizado",
      description: "Visualiza en tiempo real el estado de todas tus cuentas por cobrar. Identifica quién ha pagado, quién está por vencer y quién está en mora desde un solo lugar.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: CreditCardIcon,
      title: "Pasarela de Pagos Integrada",
      description: "Ofrece a tus clientes métodos de pago modernos y accesibles. Permite que paguen su factura con un solo clic desde la misma notificación.",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="relative bg-[#F7f7f7] py-32 overflow-hidden">
      <Container>
        <div 
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            CARACTERÍSTICAS PRINCIPALES
          </div>
          <h3 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Todo lo que necesitas para gestionar tus cobros
          </h3>
          <p className="text-xl text-gray-600 leading-relaxed">
            Tres módulos poderosos que trabajan juntos para resolver el ciclo completo de tu cobranza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </div>
  )
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const { ref, isInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-x-0' : `opacity-0 ${index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'}`
      }`}
      style={{ transitionDelay: `${(index % 2) * 100}ms` }}
    >
      <div className="group relative bg-[#F7f7f7]/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-100 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 h-full overflow-hidden">
        {/* Gradiente animado de fondo */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
        
        <div className="flex items-start gap-5">
          {/* Ícono circular animado */}
          <div className="flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <benefit.icon className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                {benefit.title}
              </h4>
              <div className={`ml-4 px-3 py-1 rounded-lg bg-gradient-to-r ${benefit.color} text-white text-sm font-bold shadow-sm`}>
                {benefit.stat}
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        </div>
        
        {/* Borde brillante animado */}
        <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${benefit.color} p-[2px] -z-10`}>
          <div className="w-full h-full bg-[#F7f7f7] rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

function BenefitsSection() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { ref: headerRef, isInView: headerInView } = useInView()
  
  const handleNavigation = (href: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(href);
    }, 800);
  };
  
  const benefits = [
    {
      icon: TrendingUp,
      title: "Aumenta tu flujo de caja hasta 25%",
      description: "La automatización reduce la probabilidad de impago significativamente, asegurando que recibas tus pagos a tiempo.",
      stat: "25%",
      color: "from-emerald-400 to-green-600"
    },
    {
      icon: CheckCircle2Icon,
      title: "Elimina errores humanos",
      description: "Olvídate de las hojas de Excel propensas a errores. Cobrix automatiza todo el proceso de forma confiable.",
      stat: "99.9%",
      color: "from-blue-400 to-indigo-600"
    },
    {
      icon: Clock,
      title: "Ahorra tiempo valioso",
      description: "Libera a tu equipo de tareas repetitivas. Dedica ese tiempo a hacer crecer tu negocio.",
      stat: "10h/sem",
      color: "from-amber-400 to-orange-600"
    },
    {
      icon: Heart,
      title: "Mejora la experiencia del cliente",
      description: "Un proceso de pago simple y sin fricciones aumenta la satisfacción y retención de tus clientes.",
      stat: "4.9/5",
      color: "from-pink-400 to-rose-600"
    }
  ]

  return (
    <div className="relative bg-[#F7f7f7] py-32 overflow-hidden">
      <Container>
        <div 
          ref={headerRef}
          className={`text-center max-w-4xl mx-auto mb-20 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            IMPACTO REAL EN TU NEGOCIO
          </div>
          <h3 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforma tu gestión de{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-600 to-emerald-500">
              cobranza
            </span>
          </h3>
          <p className="text-xl text-gray-600 leading-relaxed">
            Cobrix no solo mejora tu operación, fortalece la salud financiera de tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>

        {/* CTA mejorado */}
        <div className="mt-24 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10 blur-3xl" />
            <div className="relative bg-white rounded-3xl p-12 border-2 border-gray-200 shadow-2xl max-w-3xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary via-emerald-500 to-primary text-white text-sm font-bold shadow-lg">
                  <Zap className="w-4 h-4" />
                  OFERTA DE LANZAMIENTO
                </div>
              </div>
              
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-4">
                ¿Listo para simplificar tu gestión de cobros?
              </h4>
              <p className="text-gray-600 text-lg mb-8">
                Únete a cientos de empresas que ya están transformando sus cobros
              </p>
              
              <div className="flex justify-center items-center">
                <button
                  onClick={() => handleNavigation('/register')}
                  className="group relative bg-slate-900 h-16 w-full sm:w-64 border-2 border-primary text-white text-base font-bold rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:border-emerald-400 hover:text-emerald-300 p-3 text-center before:absolute before:w-10 before:h-10 before:content-[''] before:right-2 before:top-2 before:z-10 before:bg-primary before:rounded-full before:blur-lg before:transition-all before:duration-500 after:absolute after:z-10 after:w-16 after:h-16 after:content-[''] after:bg-emerald-400 after:right-6 after:top-4 after:rounded-full after:blur-lg after:transition-all after:duration-500 hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:after:-right-6 hover:after:scale-110"
                >
                  <span className="relative z-20">Comienza gratis hoy</span>
                </button>
              </div>
              
              <p className="text-gray-500 text-sm mt-6">
                Sin tarjeta de crédito • Configuración en 5 minutos
              </p>
            </div>
          </div>
        </div>
      </Container>
      <LoadingTransition isVisible={isTransitioning} />
    </div>
  )
}

function Footer() {
  return (
    <footer className="relative bg-[#F7f7f7] py-20 overflow-hidden border-t border-gray-200">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary via-50% to-transparent z-[2]" />
      
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Columna principal - Logo y descripción */}
          <div className="col-span-1 md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                Cobrix
              </h3>
            </div>
            <p className="text-gray-600 max-w-md leading-relaxed mb-8">
              La plataforma líder en Venezuela para automatizar la gestión de cobros recurrentes en PYMEs. Más de 500 empresas confían en nosotros.
            </p>
            
            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              <Link 
                href="#" 
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-primary/10 border border-gray-200 hover:border-primary/30 flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="#" 
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-primary/10 border border-gray-200 hover:border-primary/30 flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link 
                href="#" 
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-emerald-500/10 border border-gray-200 hover:border-emerald-500/30 flex items-center justify-center text-gray-600 hover:text-emerald-500 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Enlaces organizados */}
          <div className="col-span-1 md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-emerald-500 rounded-full" />
                Producto
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/caracteristicas" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/precios" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/integraciones" className="text-gray-600 hover:text-emerald-500 transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Integraciones
                  </Link>
                </li>
                </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-emerald-500 rounded-full" />
                Empresa
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/nosotros" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-600 hover:text-emerald-500 transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/carreras" className="text-gray-600 hover:text-emerald-500 transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Carreras
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-emerald-500 rounded-full" />
                Recursos
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/ayuda" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Centro de ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="/soporte" className="text-gray-600 hover:text-emerald-500 transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Soporte
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-gray-600 hover:text-emerald-500 transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    Estado del servicio
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Sección inferior con degradado */}
        <div className="pt-8 border-t border-gray-200 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Cobrix. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacidad" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Privacidad
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/terminos" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Términos
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/cookies" className="text-sm text-gray-600 hover:text-emerald-500 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default function LandingPage() {

  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <FeaturesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
