import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const hello = api.post.hello.useQuery({ text: "Welcome to our app!" });

  if (session) {
    router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Welcome to Our App</title>
        <meta name="description" content="A personalized experience just for you!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* Título personalizado */}
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            ¡Bienvenido a <span className="text-[hsl(280,100%,70%)]">Nuestra Aplicación</span>!
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Primeros pasos →</h3>
              <div className="text-lg">
                Aprende lo básico: Cómo configurar tu base de datos y autenticación.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentación →</h3>
              <div className="text-lg">
                Descubre más sobre nuestra aplicación, las bibliotecas que usa y cómo desplegarla.
              </div>
            </Link>
          </div>
          {/* Mensaje dinámico y boton de autenticación */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Cargando el mensaje..." }
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Estás logueado como {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
    </div>
  );
}
