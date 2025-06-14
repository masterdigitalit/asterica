from quart import Quart, request, jsonify
from db.main import getOrder, getAllOrders
from quart_cors import cors
import os
from utils.videoEditor import videoResize, crop_video
from user.sendCircleToUser  import sendVideoToUser

app = Quart(__name__)
cors(app)

UPLOAD_FOLDER = "../timeMedia"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/get_item', methods=['POST'])
async def get_item():
    data = await request.get_json()

    param = data.get('param')
    print(param)

    order = await getOrder(param)
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
    print(order)

    if param and order:
        return jsonify(order), 200
    else:
        return jsonify({'error': 'Item not found'}), 200

@app.route('/get_items', methods=['GET'])
async def get_items():

    order = await getAllOrders()  # Ensure getOrder is an async function

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
    print(transformed_data)


    return jsonify(transformed_data), 200




@app.route('/upload_file', methods=['POST'])
async def upload_file():
    files = await request.files
    data  = await request.form  # Await request.files to get the files dict
    if 'file' not in files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    aspect_ratio =  data.get('aspectRatio', type=float)
    center =  data.get('center', default='center')

    if not aspect_ratio or aspect_ratio <= 0:
        return jsonify({'error': 'Invalid or missing aspectRatio parameter'}), 400

    if center not in ('center', 'top', 'bottom', 'left', 'right'):
        return jsonify({'error': 'Invalid center parameter'}), 400




    try:
        filename = file.filename
        save_path = os.path.join('../timeMedia', filename)
        await file.save(save_path)

        await crop_video(file.filename, aspect_ratio, center)
        await sendVideoToUser(f"update_{file.filename}")
        return jsonify({'message': 'File uploaded and cropped successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Unsupported file type'}), 400



#
# async def upload_file():
#     files = await request.files  # Await request.files to get the files dict
#     if 'file' not in files:
#         return jsonify({'error': 'No file part in the request'}), 400
#
#     file = files['file']
#
#     if file.filename == '':
#         return jsonify({'error': 'No file selected'}), 400
#
#     # Save the file
#     filename = file.filename
#     save_path = os.path.join(UPLOAD_FOLDER, filename)
#     await file.save(save_path)
#
#     await videoResize(filename)
#     await sendVideoToUser(f"update_{filename}")
#
#     return jsonify({'message': f'File \"{filename}\" uploaded successfully.'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
