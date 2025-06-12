import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DatosExtraidos } from '@/utils/extraerDatosDelOCR';


export default function DatosAuto() {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosExtraidos | null>(null);

  useEffect(() => {
    const datosGuardados = sessionStorage.getItem('datosPaso1');
    if (datosGuardados) {
      setDatos(JSON.parse(datosGuardados));
    }
  }, []);

  const handleContinuar = () => {
    // Acá podrías guardar o validar antes de pasar al siguiente paso
    router.push('/datos_titular'); // Página siguiente (si la vas a usar)
  };

  if (!datos) {
    return (
      <div className="p-4">
        <p>No se encontraron datos. Volvé al paso anterior.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚗 Datos del Automotor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(datos).map(([key, value]) => (
          <div key={key}>
            <p>
              <strong>{key.replace(/_/g, ' ')}:</strong> {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleContinuar}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
