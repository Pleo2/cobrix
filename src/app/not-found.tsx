import { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "404",
  description: "pagina no encontrada",
};

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">pagina no encontrada</h1>
      <p className="text-small-regular text-ui-fg-base">404 not found</p>
      <Link href="/">Go to frontpage</Link>
    </div>
  );
}
