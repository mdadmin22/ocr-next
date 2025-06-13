======================================
OCR-NEXT: INSTRUCCIONES DE USO LOCAL
======================================

📁 CLONAR EL PROYECTO EN OTRA PC
--------------------------------
1. Abrí una terminal (CMD o PowerShell).
2. Ubicate en la carpeta donde querés clonar el proyecto, por ejemplo:

   cd D:\ProyectoSanMartin\

3. Cloná el repositorio desde GitHub:

   git clone https://github.com/mdadmin22/ocr-next.git

4. Entrá a la carpeta del proyecto:

   cd ocr-next

---------------------------------------

📦 INSTALAR DEPENDENCIAS DEL FRONTEND (Next.js)
-----------------------------------------------
5. En la raíz del proyecto (donde está package.json), ejecutá:

   npm install

---------------------------------------

🐍 CONFIGURAR Y LEVANTAR EL BACKEND OCR (Python + Flask)
---------------------------------------------------------
6. Entrá a la subcarpeta del backend OCR:

   cd ocr-python

7. Crear el entorno virtual (solo una vez por PC):

   py -m venv env

8. Activar el entorno virtual (cada vez que abras consola):

   .\env\Scripts\activate

9. Instalar dependencias de Python:

   pip install -r requirements.txt

10. Verificar que exista el archivo de clave de Google Cloud:
    - Nombre: ocr-titulo-municipal-XXXX.json
    - Debe estar ubicado dentro de `ocr-python`
    - ⚠️ No debe subirse a GitHub

11. Establecer la variable de entorno para la API de Vision:

   set GOOGLE_APPLICATION_CREDENTIALS=ocr-titulo-municipal-XXXX.json

12. (Opcional) Establecer el archivo principal de Flask (si no usás python main.py directamente):

   set FLASK_APP=main.py

13. Ejecutar el servidor backend OCR:

   flask run
   ó
   python main.py

   Esto levanta el backend en: http://localhost:5000

---------------------------------------

🚀 CORRER EL FRONTEND CON NEXT.JS
---------------------------------
14. Abrí **otra consola nueva** (en paralelo al backend).

15. Volvé a la raíz del proyecto:

    cd ocr-next

16. Ejecutá el servidor frontend:

    npm run dev

    Esto levanta el sitio en: http://localhost:3000

---------------------------------------

✅ USO DEL SISTEMA OCR
-----------------------
- Subí una imagen del Título del Automotor desde la interfaz web.
- El backend la procesa con OCR (Google Cloud Vision + OpenCV).
- Los datos detectados se muestran para revisión y edición.

---------------------------------------

⚠️ NOTA IMPORTANTE
-------------------
Si al ejecutar el backend ves este error:

   ModuleNotFoundError: No module named 'flask_cors'

Significa que falta instalar esa librería. Solucionalo con:

   pip install flask-cors

Y luego actualizá los requerimientos con:

   pip freeze > requirements.txt

---------------------------------------

📎 OPCIONAL: Automatizar el backend con un .bat
-----------------------------------------------
Podés crear un archivo llamado `iniciar_backend.bat` con este contenido:

   @echo off
   cd ocr-python
   set GOOGLE_APPLICATION_CREDENTIALS=ocr-titulo-municipal-XXXX.json
   set FLASK_APP=main.py
   flask run

Y simplemente hacer doble clic para iniciar el backend ya configurado.
