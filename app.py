from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import os

# Download NLTK data
nltk.download('stopwords')
nltk.download('punkt')

app = Flask(__name__)
CORS(app)
# Load model and vectorizer
print("Loading model files...")
model_path = os.path.join('..', 'model', 'fake_news_model.pkl')
vectorizer_path = os.path.join('..', 'model', 'vectorizer.pkl')

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)
print("Model loaded successfully!")

# Text preprocessing functions
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def clean_text(text):
    text = str(text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def preprocess(text):
    words = text.split()
    words = [w for w in words if w not in stop_words]
    words = [stemmer.stem(w) for w in words]
    return ' '.join(words)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Fake News Detection API is running',
        'status': 'ready'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        news_text = data['text']
        
        cleaned = clean_text(news_text)
        processed = preprocess(cleaned)
        
        text_vector = vectorizer.transform([processed])
        
        prediction = model.predict(text_vector)[0]
        probabilities = model.predict_proba(text_vector)[0]
        
        result = {
            'prediction': 'REAL' if prediction == 1 else 'FAKE',
            'confidence': float(max(probabilities)),
            'fake_probability': float(probabilities[0]),
            'real_probability': float(probabilities[1])
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    