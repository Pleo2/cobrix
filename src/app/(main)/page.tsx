import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/marketing/navbar";
import Link from "next/link";
import { ChevronRightIcon, BellIcon, LayoutDashboardIcon, CreditCardIcon, CheckCircle2Icon } from "lucide-react";
import { GradientScene } from "@/components/marketing/gradient-scene";
import { Container } from "@/components/container";


function Hero() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 rounded-4xl bottom-0 ring-1 ring-black/5 ring-inset p-2">
        <GradientScene className="rounded-4xl" />
      </div>
      <div className="flex flex-col relative w-full min-h-screen justify-between">
        <Navbar />
        <div className="relative flex h-full items-end pb-12 pl-4">
          <div className="absolute -left-2 bg-gradient-to-r from-background to-transparent w-full max-w-3xl h-full rounded-b-4xl blur-3xl overlow-visible"></div>
          <div className="z-10 p-8 md:p-12 max-w-2xl">
            <h1 className="text-left font-display text-5xl/[1.1] font-bold tracking-tight text-balance sm:text-6xl/[1.1] md:text-7xl/[1.1] text-gray-900">
              Automatiza tus cobros y mejora tu flujo de caja
            </h1>
            <p className="text-left mt-2 text-lg font-medium sm:text-xl text-gray-700">
              La plataforma que simplifica la gestión de cobros recurrentes para PYMEs en Venezuela.
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="marketing">Empieza ahora</Button>
              <Button size="lg" variant="outline">
                Ver precios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: BellIcon,
      title: "Notificaciones Automáticas",
      description: "Envía recordatorios de pago programados y personalizables a través de email, SMS y WhatsApp. Tu cliente siempre estará informado sin que muevas un dedo."
    },
    {
      icon: LayoutDashboardIcon,
      title: "Dashboard Centralizado",
      description: "Visualiza en tiempo real el estado de todas tus cuentas por cobrar. Identifica quién ha pagado, quién está por vencer y quién está en mora desde un solo lugar."
    },
    {
      icon: CreditCardIcon,
      title: "Pasarela de Pagos Integrada",
      description: "Ofrece a tus clientes métodos de pago modernos y accesibles. Permite que paguen su factura con un solo clic desde la misma notificación."
    }
  ]

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Características
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Todo lo que necesitas para gestionar tus cobros
          </h3>
          <p className="text-xl text-gray-600">
            Tres módulos poderosos que trabajan juntos para resolver el ciclo completo de tu cobranza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

function BenefitsSection() {
  const benefits = [
    {
      title: "Aumenta tu flujo de caja hasta 25%",
      description: "La automatización reduce la probabilidad de impago significativamente, asegurando que recibas tus pagos a tiempo."
    },
    {
      title: "Elimina errores humanos",
      description: "Olvídate de las hojas de Excel propensas a errores. Cobrix automatiza todo el proceso de forma confiable."
    },
    {
      title: "Ahorra tiempo valioso",
      description: "Libera a tu equipo de tareas repetitivas. Dedica ese tiempo a hacer crecer tu negocio."
    },
    {
      title: "Mejora la experiencia del cliente",
      description: "Un proceso de pago simple y sin fricciones aumenta la satisfacción y retención de tus clientes."
    }
  ]

  return (
    <div className="py-24 bg-gray-900">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Beneficios
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transforma tu gestión de cobranza
          </h3>
          <p className="text-xl text-gray-400">
            Cobrix no solo mejora tu operación, fortalece la salud financiera de tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700">
            <p className="text-gray-300 text-lg">
              ¿Listo para simplificar tu gestión de cobros?
            </p>
            <Button size="lg" variant="marketing">
              Comienza gratis hoy
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cobrix</h3>
            <p className="text-gray-600 max-w-md">
              La plataforma líder en Venezuela para automatizar la gestión de cobros recurrentes en PYMEs.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Producto
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/caracteristicas" className="text-gray-600 hover:text-primary transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="/precios" className="text-gray-600 hover:text-primary transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-gray-600 hover:text-primary transition-colors">
                  Ir a la app
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/nosotros" className="text-gray-600 hover:text-primary transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="text-gray-600 hover:text-primary transition-colors">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Cobrix. Todos los derechos reservados.</p>
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
