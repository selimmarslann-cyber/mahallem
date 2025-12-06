import dynamic from "next/dynamic";

const ClientHero = dynamic(() => import("./ClientHero"), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  return (
    <main>
      <ClientHero />
    </main>
  );
}

