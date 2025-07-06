from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np
import pickle
import os

app = Flask(__name__)

@app.route('/api/treinar', methods=['POST'])
def treinar_modelo():
    try:
        dados = request.get_json()
        valores = dados.get("valores", [])

        if len(valores) < 6:
            return jsonify({"error": "Dados insuficientes para treinar"}), 400

        # Calcular SMA e Momentum como features
        sma = []
        momentum = []
        y = []

        for i in range(5, len(valores)):
            sma_val = np.mean(valores[i-5:i])
            mom = valores[i] - valores[i-1]

            sma.append(sma_val)
            momentum.append(mom)
            y.append(valores[i])  # valor alvo

        X = np.column_stack((sma, momentum))
        y = np.array(y)

        model = LinearRegression()
        model.fit(X, y)

        # Salva modelo
        with open("modelo_regressao_linear.pkl", "wb") as f:
            pickle.dump(model, f)

        return jsonify({ "message": "Modelo treinado com sucesso", "amostras": len(y) })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500


if __name__ == '__main__':
    app.run(port=5001)
