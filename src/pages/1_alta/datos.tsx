import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface DatosExtraidos {
  dominio: string;
  procedencia: string;
  codigo_automotor: string;
  modelo_anio: string;
  nombre: string;
  cuit: string;
  dni: string;
  calle: string;
  numero_calle: string;
  localidad: string;
  partido: string;
  provincia: string;
  codigo_postal: string;
}

export default function DatosConfirmadosPage() {
  const [formulario, setFormulario] = useState<DatosExtraidos | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const datos = sessionStorage.getItem('datosPaso1');
    if (datos) {
      const originales = JSON.parse(datos) as DatosExtraidos;

      const limpiarTexto = (valor: string) =>
        valor
          .replace(/Porcentaje de.*$/i, '')
          .replace(/(Localidad|Barrio|Provincia|Partido).*$/i, '')
          .trim()
          .toUpperCase();

      const corregidos: DatosExtraidos = {
        ...originales,
        nombre: limpiarTexto(originales.nombre),
        calle: limpiarTexto(originales.calle),
        localidad: limpiarTexto(originales.localidad),
        partido: limpiarTexto(originales.partido),
        provincia: limpiarTexto(originales.provincia),
      };

      setFormulario(corregidos);
    }
  }, []);

  const validarDatos = () => {
    const err: string[] = [];
    if (!formulario) return err;

    const dominioMercosur = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    const dominioAntiguo = /^[A-Z]{3}\d{3}$/;
    const anio = parseInt(formulario.modelo_anio, 10);
    const dominioValido =
      anio >= 2016
        ? dominioMercosur.test(formulario.dominio.toUpperCase())
        : dominioAntiguo.test(formulario.dominio.toUpperCase());

    if (!dominioValido) err.push('Dominio inválido para el modelo año');

    if (!/^\d{11}$/.test(formulario.cuit)) err.push('CUIT debe tener 11 dígitos');
    if (!/^\d{7,8}$/.test(formulario.dni)) err.push('DNI debe tener 7 u 8 dígitos');
    if (isNaN(anio) || anio < 1960 || anio > new Date().getFullYear())
      err.push('Modelo año inválido');
    if (formulario.provincia.toUpperCase() !== 'CHACO') err.push('Provincia debe ser CHACO');
    if (!formulario.localidad.toUpperCase().includes('SAN MARTIN'))
      err.push('Localidad debe ser GENERAL JOSÉ DE SAN MARTÍN');
    if (!formulario.partido.toUpperCase().includes('SAN MARTIN'))
      err.push('Partido debe ser LDOR. GRAL. SAN MARTÍN');

    return err;
  };

  const handleContinuar = () => {
    const erroresDetectados = validarDatos();
    setErrores(erroresDetectados);
    if (erroresDetectados.length === 0 && formulario) {
      sessionStorage.setItem('datosPaso2', JSON.stringify(formulario));
      router.push('/1_alta/valorfiscal');
    }
  };

  if (!formulario) return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">✅ Paso 3 – Confirmación de datos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(formulario).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm font-semibold">{key.replace(/_/g, ' ')}:</label>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                setFormulario((prev) => prev && { ...prev, [key]: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>
        ))}
      </div>

      {errores.length > 0 && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-800 p-4 rounded">
          <h2 className="font-bold mb-2">Errores detectados:</h2>
          <ul className="list-disc ml-5">
            {errores.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleContinuar}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Confirmar y continuar
      </button>
    </div>
  );
}
