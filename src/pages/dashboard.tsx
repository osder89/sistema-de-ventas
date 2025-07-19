import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar"; 

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-white text-2xl">Cargando...</p>;
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Panel de control del usuario" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar fijo */}
      <Navbar />

      {/* Contenido principal */}
      <main className="min-h-screen bg-gradient-to-b from-[#6a1b9a] to-[#4a148c] pt-20"> {/* Agregamos un espacio para que el navbar no tape contenido */}
        <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-6 py-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            ¡Bienvenido, {session.user?.name}!
          </h1>
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl">
              <img
                src={session.user?.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xl sm:text-2xl text-white font-semibold">
              Este es tu dashboard privado. Aquí puedes gestionar todo.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-lg text-white">¡Explora las opciones disponibles!</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
