from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import pickle
import numpy as np
import os
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route('/treinar', methods=['POST'])
def treinar_modelo():
    dados = request.get_json()
    X = np.array(dados.get('X', []))
    y = np.array(dados.get('y', []))

    if len(X) == 0 or len(y) == 0:
        return jsonify({ "error": "Dados insuficientes para treinar." }), 400

    modelo = LinearRegression()
    modelo.fit(X, y)

    with open('modelo_regressao_linear.pkl', 'wb') as f:
        pickle.dump(modelo, f)

    return jsonify({ "message": "Modelo treinado com dados reais com sucesso." })
