# predict.py
import sys
import pickle
import json

# Lê os dados via argumento (sys.argv[1])
input_data = json.loads(sys.argv[1])

sma = input_data.get("sma", 0)
momentum = input_data.get("momentum", 0)

# Carrega o modelo
with open('modelo_regressao_linear.pkl', 'rb') as f:
    model = pickle.load(f)

# Faz a previsão
features = [[sma, momentum]]
predicted_price = model.predict(features)[0]

# Retorna o valor como JSON
print(json.dumps({ "precoPrevisto": predicted_price }))
