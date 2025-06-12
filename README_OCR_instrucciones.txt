
===============================
OCR-NEXT: INSTRUCCIONES DE USO
===============================

📁 CLONAR EL PROYECTO EN OTRA PC
--------------------------------
1. Abrir una terminal (CMD o Git Bash)
2. Ir a la carpeta donde querés clonar el proyecto:

   cd D:\ProyectoSanMartin\

3. Clonar el repositorio desde GitHub:

   git clone https://github.com/mdadmin22/ocr-next.git

4. Entrar a la carpeta del proyecto:

   cd ocr-next


📦 INSTALAR DEPENDENCIAS DEL FRONTEND (NEXT.JS)
-----------------------------------------------
5. Ejecutar en la raíz del proyecto:

   npm install


🐍 CONFIGURAR Y LEVANTAR EL BACKEND OCR (PYTHON + FLASK)
---------------------------------------------------------
6. Entrar a la subcarpeta del backend OCR:

   cd ocr-python

7. Crear y activar el entorno virtual:

   python -m venv venv
   venv\Scripts\activate

8. Instalar dependencias de Python:

   pip install -r requirements.txt

9. Asegurarse de tener el archivo de clave:
   - Nombre esperado: ocr-titulo-municipal-xxxx.json
   - Ubicarlo dentro de la carpeta `ocr-python` (no subirlo a GitHub)

10. Establecer la variable de entorno para Google Cloud Vision:

   set GOOGLE_APPLICATION_CREDENTIALS=ocr-titulo-municipal-xxxx.json

11. Ejecutar el servidor OCR:

   python main.py

   Esto levantará el servidor en: http://localhost:5000


🚀 CORRER EL FRONTEND NEXT.JS
------------------------------
12. Abrir otra terminal nueva y volver a la raíz del proyecto:

    cd ocr-next

13. Ejecutar el servidor Next.js:

    npm run dev

    Esto levantará la app en: http://localhost:3000/ocr


✅ LISTO
--------
Ya podés cargar una imagen del título del automotor, procesarla con OCR
y revisar o corregir los datos extraídos en el navegador.

