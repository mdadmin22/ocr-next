from flask import Flask, request, jsonify
from google.cloud import vision
import io
from PIL import Image
import numpy as np
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
client = vision.ImageAnnotatorClient()

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    np_image = np.array(image)
    gray = cv2.cvtColor(np_image, cv2.COLOR_RGB2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    _, buffer = cv2.imencode(".jpg", thresh)
    return buffer.tobytes()

@app.route("/ocr", methods=["POST"])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    processed_image = preprocess_image(file.read())

    image = vision.Image(content=processed_image)
    response = client.document_text_detection(image=image)

    if response.error.message:
        return jsonify({'error': response.error.message}), 500

    texto = response.full_text_annotation.text
    return jsonify({'texto_detectado': texto})

if __name__ == "__main__":
    app.run(port=5000)
