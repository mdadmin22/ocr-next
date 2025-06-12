export interface DatosExtraidos {
  dominio: string;
  procedencia: 'I' | 'N' | '';
  codigo_automotor: string;
  marca: string;
  modelo: string;
  tipo: string;
  modelo_anio: string;
  nombre: string;
  cuit: string;
  dni: string;
  calle: string;
  localidad: string;
  partido: string;
  provincia: string;
  codigo_postal: string;
}

export function extraerDatosDelOCR(texto: string): DatosExtraidos {
  const buscarValor = (regex: RegExp) => {
    const match = texto.match(regex);
    return match ? match[1].trim() : '';
  };

  // Dominios: AA111BB o ABC123
  const dominio = buscarValor(/dominio\s+([A-Z0-9]{6,8})/i);

  // Procedencia
  const procedencia = texto.includes('IMPORTADO') ? 'I' : texto.includes('NACIONAL') ? 'N' : '';

  // Códigos
  const marcaLinea = buscarValor(/Marca:\s*(\d{3})-([A-Z\s]+)/i);
  const modeloLinea = buscarValor(/Modelo:\s*(\d{3})-([A-Z0-9\s\-\.\/]+)/i);
  const tipoLinea = buscarValor(/Tipo:\s*(\d{2})-([A-Z0-9\s\-]+)/i);

  const codigo_marca = buscarValor(/Marca:\s*(\d{3})-/i);
  const codigo_modelo = buscarValor(/Modelo:\s*(\d{3})-/i);
  const codigo_tipo = buscarValor(/Tipo:\s*(\d{2})-/i);

  const codigo_automotor = [codigo_marca, codigo_modelo, codigo_tipo].every(Boolean)
    ? `${codigo_marca}-${codigo_modelo}-${codigo_tipo}`
    : '';

  // Año modelo
  const modelo_anio = buscarValor(/Modelo Año:\s*(\d{4})/i);

  // Nombre
  const nombre = buscarValor(/Nombre:\s*([\w\s,\.]+)/i);

  // CUIT/CUIL
  const cuit = buscarValor(/Cuil:\s*(\d{11})/i);

  // DNI
  const dni = buscarValor(/Nro\.\s*Doc\.\s*:\s*(\d{7,8})/i);

  // Dirección
  const calle = buscarValor(/Calle:\s*(.+)/i);
  const localidad = buscarValor(/Localidad:\s*([A-Z\s]+)/i);
  const partido = buscarValor(/Partido:\s*([A-Z\s]+)/i);
  const provincia = buscarValor(/Provincia:\s*([A-Z]+)/i);
  const codigo_postal = buscarValor(/Código Postal:\s*(\d{4})/i);

  return {
    dominio,
    procedencia,
    codigo_automotor,
    marca: marcaLinea.replace(/^\d{3}-/, ''),
    modelo: modeloLinea.replace(/^\d{3}-/, ''),
    tipo: tipoLinea.replace(/^\d{2}-/, ''),
    modelo_anio,
    nombre,
    cuit,
    dni,
    calle,
    localidad: localidad.trim(),
    partido: partido.trim(),
    provincia: provincia.trim(),
    codigo_postal,
  };
}
