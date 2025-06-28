from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from db.main import getOrder, getAllOrders, updateTaskState
from utils.videoEditor import  crop_video
from user.sendCircleToUser  import sendVideoToUser
import asyncio


app = Flask(__name__)
CORS(app)

loop = asyncio.get_event_loop()

app.config['CORS_HEADERS'] = 'Content-Type'

# Set up logging
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT, handlers=[
    logging.FileHandler("app.log", encoding='UTF-8'),  # Log to a file
    logging.StreamHandler()            # Log to console
])

# Disable Flask's default logging


UPLOAD_FOLDER = "./timeMedia"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/get_item', methods=['POST'])
def get_item():
    data =  request.get_json()
    param = data.get('param')
    logging.debug(f"Received param: {param}")

    order =  getOrder(param)
    order = [
        {
            "id": order[0][0],
            "title": order[0][1],
            "date": order[0][2],
            "description": order[0][3],
            "state": order[0][4],
            "uuid": order[0][5],
        }
    ]
    logging.debug(f"Order details: {order}")

    if param and order:
        return jsonify(order), 200
    else:
        logging.warning('Item not found for param: %s', param)
        return jsonify({'error': 'Item not found'}), 200

@app.route('/get_items', methods=['GET'])
def get_items():
    order =  getAllOrders()  # Ensure getOrder is an async function
    transformed_data = [
        {
            "id": item[0],
            "title": item[1],
            "date": item[2],
            "description": item[3],
            "state": item[4],
            "uuid": item[5],
        }
        for item in order
    ]
    logging.debug(f"Transformed data: {transformed_data}")

    return jsonify(transformed_data), 200

@app.route('/upload_file', methods=['POST'])
def upload_file():
    feedback = {"got" : False , "saved":False,"croped" : False, "send" : False, "deleted" : False, 'updated':False }
    files =  request.files
    data =  request.form  # Await request.files to get the files dict
    feedback["got"] = True

    if 'file' not in files:
        logging.error('No file part in the request')
        return jsonify({'error': 'No file part in the request'}), 400

    file = files['file']
    if file.filename == '':
        logging.error('No file selected')
        return jsonify({'error': 'No file selected'}), 400

    aspect_ratio = data.get('aspectRatio', type=float)
    uuid = data.get('uuid', type=str)
    center = data.get('center', default='center')


    if not aspect_ratio or aspect_ratio <= 0:
        logging.error('Invalid or missing aspectRatio parameter')
        return jsonify({'error': 'Invalid or missing aspectRatio parameter'}), 400

    if center not in ('center', 'top', 'bottom', 'left', 'right'):
        logging.error('Invalid center parameter')
        return jsonify({'error': 'Invalid center parameter'}), 400

    try:

        filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        feedback["saved"] = True
        logging.info(f"File saved to {save_path}")

        crop_video(file.filename, aspect_ratio, center) # center
        feedback["croped"] = True
        user = getOrder(uuid)
        loop.run_until_complete(sendVideoToUser(id=user[0][0] , name=f"update_{file.filename}"))


        feedback["send"] = True
        os.remove(save_path)
        feedback["deleted"] = True
        logging.info(f"File uploaded and cropped successfully: {filename}")
        updateTaskState(uuid)
        return jsonify({'message': 'File uploaded and cropped successfully', "feedback":feedback}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
