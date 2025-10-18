import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/marketing/navbar";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { GradientScene } from "@/components/marketing/gradient-scene";


function Hero() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 rounded-4xl bottom-0 ring-1 ring-black/5 ring-inset p-2">
        <GradientScene className="rounded-4xl" />
      </div>
      <div className="flex flex-col relative w-full min-h-screen justify-between">
        <Navbar
          banner={
            <Link
              href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
              className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium data-hover:bg-fuchsia-950/30"
            >
              Radiant raises $100M Series A from Tailwind Ventures
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="relative flex h-full items-end pb-12 pl-4">
          <div className="absolute -left-2 bg-gradient-to-r from-background to-transparent w-full max-w-3xl h-full  rounded-b-4xl blur-3xl overlow-visible"></div>
          <div className="z-10 p-8 md:p-12 max-w-2xl">
            <h1 className="text-left font-display text-5xl/[1.1] font-bold tracking-tight text-balance sm:text-6xl/[1.1] md:text-7xl/[1.1] text-gray-900">
              Close every deal.
            </h1>
            <p className="text-left mt-2 text-lg font-medium sm:text-xl">
              Radiant helps you sell more by revealing sensitive information about
              your customers.
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


export default function LandingPage() {

  return (
    <Hero />
  );
}
