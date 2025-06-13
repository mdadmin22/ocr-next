import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const irA = (ruta: string) => {
    router.push(ruta);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center">
        Sistema de Inscripción Municipal de Patentes
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => irA("/1_alta")}
          className="bg-green-600 text-white px-4 py-3 rounded text-lg hover:bg-green-700 transition"
        >
          ALTA de patente
        </button>
        <button
          onClick={() => irA("/2_transferencia")}
          className="bg-yellow-500 text-black px-4 py-3 rounded text-lg hover:bg-yellow-600 transition"
        >
          TRANSFERENCIA de dominio
        </button>
        <button
          onClick={() => irA("/3_baja")}
          className="bg-red-600 text-white px-4 py-3 rounded text-lg hover:bg-red-700 transition"
        >
          BAJA del vehículo
        </button>
      </div>
    </div>
  );
}
