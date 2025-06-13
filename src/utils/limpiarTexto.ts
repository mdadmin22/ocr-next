// Función para limpiar texto OCR con errores comunes
export function limpiarTextoOCR(texto: string): string {
  if (!texto) return "";

  return texto
    .replace(/Porcentaje de Trular/gi, "")
    .replace(/Localidad/gi, "")
    .replace(/Barrio/gi, "")
    .replace(/Trular/gi, "")
    .replace(/UBERTADOR/gi, "LIBERTADOR")
    .replace(/\s+/g, " ") // Espacios múltiples → uno solo
    .replace(/[^\w\sÁÉÍÓÚÑáéíóúñ\/\-]/gi, "") // elimina caracteres especiales
    .trim()
    .toUpperCase();
}
