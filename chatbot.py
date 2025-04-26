from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests

app = Flask(__name__, static_url_path='/static')
CORS(app)

# Replace with your actual Gemini API Key
GEMINI_API_KEY = 'AIzaSyC_Z4P0a4iqwA9Win51W-BQICYCnHdnBqM'
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        payload = {
            "contents": [{
                "parts": [{
                    "text": message
                }]
            }]
        }

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                                 headers=headers,
                                 json=payload)

        response_data = response.json()

        if "candidates" in response_data:
            reply = response_data['candidates'][0]['content']['parts'][0]['text']
            return jsonify({'response': reply})
        else:
            return jsonify({'error': 'Invalid response from Gemini'}), 500

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # 🧠 This makes it accessible from other devices on your Wi-Fi
    app.run(debug=True, host='0.0.0.0', port=5000)
