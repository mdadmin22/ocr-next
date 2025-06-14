// src/pages/1_alta/index.tsx
import { useState } from 'react';
import axios from 'axios';
import { DatosExtraidos } from '@/utils/extraerDatosDelOCR';

export default function AltaPaso1() {
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [datos, setDatos] = useState<DatosExtraidos | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSeleccionImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
      setDatos(null);
    }
  };

  const handleProcesarOCR = async () => {
    if (!imagen) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', imagen);

    try {
      const response = await axios.post<{ datos_extraidos: DatosExtraidos }>(
        'http://localhost:5000/ocr',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const datosExtraidos = response.data.datos_extraidos;
      console.log("🧾 Datos extraídos desde backend:", datosExtraidos);
      setDatos(datosExtraidos);
    } catch (error) {
      console.error('Error al procesar OCR:', error);
    } finally {
      setLoading(false);
    }
  };

  const camposObligatoriosCompletos = datos?.dominio && datos?.modelo_anio && datos?.codigo_automotor;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📄 Paso 1: Cargar título del automotor</h1>

      <input type="file" accept="image/*" onChange={handleSeleccionImagen} />
      {preview && <img src={preview} alt="Preview" style={{ marginTop: 16, maxWidth: 400 }} />}

      <button
        onClick={handleProcesarOCR}
        disabled={!imagen || loading}
        style={{ marginTop: 16 }}
      >
        {loading ? 'Procesando...' : 'Procesar OCR'}
      </button>

      {datos && (
        <div style={{ marginTop: 32 }}>
          <h2>✅ Datos detectados:</h2>
          <ul>
            {Object.entries(datos).map(([clave, valor]) => (
              <li key={clave}><strong>{clave}:</strong> {valor}</li>
            ))}
          </ul>

          <button
            style={{ marginTop: 24 }}
            disabled={!camposObligatoriosCompletos}
            onClick={() => {
              sessionStorage.setItem("datosPaso1", JSON.stringify(datos));
              window.location.href = "/1_alta/datos-auto"; // próximo paso
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
