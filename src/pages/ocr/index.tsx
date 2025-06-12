import { useState } from 'react';
import Image from 'next/image';
import { extraerDatosDelOCR, DatosExtraidos } from '../../utils/extraerDatosDelOCR';
import { useRouter } from 'next/router';


export default function OCRPage() {
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [texto, setTexto] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [datos, setDatos] = useState<DatosExtraidos | null>(null); // A futuro para análisis o debugging
  const [formulario, setFormulario] = useState<DatosExtraidos | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSeleccionImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
      setTexto('');
      setDatos(null);
      setFormulario(null);
    }
  };

  const handleProcesarOCR = async () => {
    if (!imagen) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', imagen);

    try {
      const response = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const textoDetectado = data.texto_detectado || 'No se detectó texto';
      setTexto(textoDetectado);

      const datosExtraidos = extraerDatosDelOCR(textoDetectado);
      setDatos(datosExtraidos);
      setFormulario(datosExtraidos);
    } catch (error) {
      console.error('Error al procesar OCR:', error);
      setTexto('Ocurrió un error al procesar la imagen.');
      setDatos(null);
      setFormulario(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (campo: keyof DatosExtraidos, valor: string) => {
    if (formulario) {
      setFormulario({
        ...formulario,
        [campo]: valor,
      });
    }
  };

  const handleConfirmar = () => {
  if (!formulario) return;

  sessionStorage.setItem('datosPaso1', JSON.stringify(formulario));
  console.log('✅ Datos confirmados:', formulario);

  // Redirigir automáticamente
  router.push('/datos_auto');
};


  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📄 OCR - Título del Automotor</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleSeleccionImagen}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={250}
            className="border rounded"
            unoptimized
          />
        </div>
      )}

      <button
        onClick={handleProcesarOCR}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Procesando...' : 'Procesar OCR'}
      </button>

      {texto && (
  <div className="mt-6 whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded">
    <h2 className="font-semibold mb-2">Texto detectado:</h2>
    <p>{texto}</p>
  </div>
)}


      {formulario && (
  <div className="mt-6 bg-white dark:bg-gray-900 text-black dark:text-white border p-4 rounded shadow">

          <h2 className="text-lg font-semibold mb-4">✏️ Revisar y corregir datos</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formulario).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-semibold capitalize mb-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  className="border px-2 py-1 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                  value={value}
                  onChange={(e) =>
                    handleChange(key as keyof DatosExtraidos, e.target.value)
                  }
                />
              </div>
            ))}
          </form>
          <div className="mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleConfirmar}
              type="button"
            >
              Confirmar y continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
