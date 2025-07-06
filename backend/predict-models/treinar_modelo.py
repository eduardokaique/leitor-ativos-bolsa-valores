# treinar_modelo.py
import numpy as np
import pickle
from sklearn.linear_model import LinearRegression

# Dados sintéticos: [sma, momentum] => preço
X = np.array([
    [100, 2],
    [105, 3],
    [110, 4],
    [115, 5],
    [120, 6],
    [125, 7],
    [130, 8],
    [135, 9],
    [140, 10],
])

# Preços simulados (resposta)
y = np.array([101, 107, 113, 118, 123, 129, 134, 140, 145])

# Treina o modelo
modelo = LinearRegression()
modelo.fit(X, y)

# Salva o modelo
with open('modelo_regressao_linear.pkl', 'wb') as f:
    pickle.dump(modelo, f)

print("✅ Modelo gerado e salvo como 'modelo_regressao_linear.pkl'")
