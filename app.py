from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS  # 导入 CORS

# Load your pre-trained model and Hiragana mapping
model = joblib.load(open("model.pkl", "rb"))
hiragana_mapping = pd.read_csv("hiragana_mapping.csv")
hiragana_to_number = dict(zip(hiragana_mapping['Character'], hiragana_mapping['Number']))

app = Flask(__name__)
CORS(app)  # 允许所有来源的请求

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_hiragana = data["input"]

    number_list = []
    for char in input_hiragana:
        if char in hiragana_to_number:
            number_list.append(hiragana_to_number[char])
        else:
            return jsonify({"error": f"Invalid character: {char}"}), 400

    LL = len(number_list)
    transformed = number_list[::-1][:3]
    while len(transformed) < 3:
        transformed.append(0)
    transformed = [LL] + transformed

    df_input = pd.DataFrame([transformed], columns=["length", "H1", "H2", "H3"])
    print(model.predict_proba(df_input))
    y_pred_proba = model.predict_proba(df_input)

    return jsonify({
        "female": y_pred_proba[0].item(0),
        "male": y_pred_proba[0].item(1),
    })

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
