#ocr-python/env/main.py
from flask import Flask, request, jsonify
from google.cloud import vision
from google.cloud.vision_v1 import ImageAnnotatorClient
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)
client: ImageAnnotatorClient = vision.ImageAnnotatorClient()

@app.route("/ocr", methods=["POST"])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    image = vision.Image(content=file.read())

    response = client.text_detection(image=image)
    if response.error.message:
        return jsonify({'error': response.error.message}), 500

    texto = response.text_annotations[0].description if response.text_annotations else ""
    datos = extraer_datos_automotor(texto)
    print("📤 Enviando datos extraídos:", datos)

    return jsonify({
        'texto_detectado': texto,
        'datos_extraidos': datos
    })


def extraer_datos_automotor(texto: str) -> dict:
    datos = {}

    # Dominio
    match = re.search(r"dominio\s+([A-Z0-9]{6,8})", texto, re.IGNORECASE)
    datos["dominio"] = match.group(1).strip().upper() if match else ""

    # Procedencia
    if "PROCEDENCIA: NACIONAL" in texto.upper():
        datos["procedencia"] = "N"
    elif "PROCEDENCIA: IMPORTADO" in texto.upper():
        datos["procedencia"] = "I"
    else:
        datos["procedencia"] = ""

    # Código automotor
    match = re.search(r"C[oó]digo Automotor[:\s]+([0-9A-Z\-]+)", texto, re.IGNORECASE)
    datos["codigo_automotor"] = match.group(1) if match else ""

    # Modelo año
    match = re.search(r"Modelo Año[:\s]+(\d{4})", texto)
    datos["modelo_anio"] = match.group(1) if match else ""

    # Tipo
    match = re.search(r"Tipo[:\s]+([0-9A-Z\- ]+)", texto)
    datos["tipo"] = match.group(1).strip() if match else ""

    # Nombre
    match = re.search(r"Nombre[:\s]+([A-ZÁÉÍÓÚÑ,\s]+)", texto)
    datos["nombre"] = match.group(1).strip() if match else ""

    # CUIT
    match = re.search(r"Cuil[:\s]+(\d{11})", texto)
    datos["cuit"] = match.group(1) if match else ""

    # DNI
    match = re.search(r"Nro. Doc.[:\s]+(\d+)", texto)
    datos["dni"] = match.group(1) if match else ""

    # Calle
    match = re.search(r"Calle[:\s]+([^\n]+)", texto)
    datos["calle"] = match.group(1).strip() if match else ""

    # Número de calle (S/N o número real)
    match = re.search(r"Nro[:\.:]*\s*(S\/N|\d+)", texto, re.IGNORECASE)
    if match:
        nro = match.group(1).strip()
        datos["numero_calle"] = nro.upper() if nro.upper() == "S/N" or nro.isdigit() else "S/N"
    else:
        datos["numero_calle"] = "S/N"

    # Provincia
    match = re.search(r"Provincia[:\s]+([A-ZÁÉÍÓÚÑ\s\.]+)", texto, re.IGNORECASE)
    provincia = match.group(1).replace('\n', ' ').strip() if match else ""
    provincia = re.sub(r"\s+(TITULAR|PARTIDO|LOCALIDAD|NRO\.?)$", "", provincia, flags=re.IGNORECASE).strip()
    datos["provincia"] = provincia

    # Partido
    match = re.search(r"Partido[:\s]+([A-ZÁÉÍÓÚÑ\s\.]+)", texto, re.IGNORECASE)
    partido = match.group(1).replace('\n', ' ').strip() if match else ""
    partido = re.sub(r"\s+(LOCALIDAD|BARRIO|NRO\.?)$", "", partido, flags=re.IGNORECASE).strip()
    datos["partido"] = partido

    # Localidad
    match = re.search(r"Localidad[:\s]+([A-ZÁÉÍÓÚÑ\s\.]+)", texto, re.IGNORECASE)
    localidad = match.group(1).replace('\n', ' ').strip() if match else ""
    localidad = re.sub(r"\s+(CÓDIGO POSTAL|PARTIDO|BARRIO|NRO\.?)$", "", localidad, flags=re.IGNORECASE).strip()
    datos["localidad"] = localidad

    # Código postal
    match = re.search(r"C[oó]digo Postal[:\s]+(\d+)", texto)
    datos["codigo_postal"] = match.group(1) if match else ""

    # 🔧 Limpieza final general
    for clave in datos:
        if isinstance(datos[clave], str):
            valor = datos[clave].replace('\n', ' ').strip()
            datos[clave] = valor

    # Validación dominio
    dominio = datos["dominio"]
    dominio = re.sub(r'[^A-Z0-9]', '', dominio)
    if len(dominio) == 7:
        datos["dominio"] = dominio
    elif len(dominio) == 6 and datos.get("modelo_anio", "").isdigit() and int(datos["modelo_anio"]) <= 2015:
        datos["dominio"] = dominio
    else:
        datos["dominio"] = ""

    return datos


if __name__ == "__main__":
    app.run(port=5000)
