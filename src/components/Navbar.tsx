import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[#6a1b9a] to-[#9c27b0] text-white p-4 fixed w-full top-0 left-0 z-10 shadow-2xl transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo o nombre de la app */}
        <Link href="/" className="text-2xl font-bold tracking-wider hover:text-gray-200 transition-all duration-300 ease-in-out">
          Mi Aplicación
        </Link>
        
        <div className="flex space-x-8">
          <Link 
            href="/product" 
            className="text-lg hover:text-gray-300 transition-all duration-300 ease-in-out"
          >
            Productos
          </Link>
          <Link 
            href="/customer" 
            className="text-lg hover:text-gray-300 transition-all duration-300 ease-in-out"
          >
            Clientes
          </Link>
          <Link 
            href="/sales" 
            className="text-lg hover:text-gray-300 transition-all duration-300 ease-in-out"
          >
            Ventas
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
