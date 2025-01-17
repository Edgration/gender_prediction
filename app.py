from flask import Flask, request, jsonify
import pandas as pd
import pickle

# Load your pre-trained model and Hiragana mapping
model = pickle.load(open("model.pkl", "rb"))
hiragana_mapping = pd.read_csv("hiragana_mapping.csv")
hiragana_to_number = dict(zip(hiragana_mapping['Character'], hiragana_mapping['Number']))

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_hiragana = data["input"]
    
    # Transform input
    number_list = [hiragana_to_number[char] for char in input_hiragana]
    LL = len(number_list)
    transformed = number_list[::-1][:3]
    while len(transformed) < 3:
        transformed.append(0)
    transformed = [LL] + transformed
    
    df_input = pd.DataFrame([transformed], columns=["length", "H1", "H2", "H3"])
    y_pred_proba = model.predict_proba(df_input)
    
    return jsonify({
        "female": y_pred_proba[0].item(0),
        "male": y_pred_proba[0].item(1),
    })

if __name__ == "__main__":
    app.run(debug=True)
