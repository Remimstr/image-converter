from io import BytesIO
import flask
from flask import Flask, request, make_response, send_file
from flask_cors import CORS, cross_origin
from PIL import Image
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

ALLOWED_EXTENSIONS = {"gif", "GIF", "bmp", "BPM", "png", "PNG", "jpg", "JPG", "jpeg", "JPEG"}
CONVERSION_TARGETS = {"PNG": "png", "JPEG": "jpeg", "BMP": "bmp", "GIF": "gif"}

app = Flask(__name__)

# We need to open CORS for local development, would disable in production
CORS(app)

# Limit the max allowed payload to 16 megabytes
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

def allowed_extension(filename):
    return "." in filename and \
            filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/image/convert", methods=["POST"])
def convert_image():
			print(request)
			logger.info("Processing image conversion request")

			if "file" not in request.files:
					return "No files to convert", 400
			if "target_file_type" not in request.form:
					return "No conversion target specified", 400

			file = request.files["file"]
			target_type = request.form["target_file_type"]
			filename = file.filename

			if target_type not in CONVERSION_TARGETS.keys():
					return "Invalid conversion target", 403

			if not allowed_extension(filename):
					return "Invalid extension", 403

			targetExtension = CONVERSION_TARGETS[target_type]

			logger.info("Begin processing file {} with target filetype {}".format(file, target_type))

			try:
					img = Image.open(file).convert("RGB")
					img_io = BytesIO()
					img.save(img_io, target_type, quality=70)
					img_io.seek(0)

					logger.info("Finished processing")

					response = make_response(send_file(img_io, mimetype="image/{}".format(targetExtension),
						as_attachment=True,
						attachment_filename="{}.{}".format(filename, targetExtension)))
					return response

			except:
					logger.info("Unable to process the file")
					return "Invalid file", 403
