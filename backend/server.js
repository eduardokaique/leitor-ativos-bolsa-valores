// server.js
require('dotenv').config(); // Carrega variáveis de ambiente

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Configurações protegidas
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

// ==============================
// 🔍 Rota: Buscar dados do ativo
// ==============================
app.get('/api/ativo', async (req, res) => {
  const symbol = req.query.symbol?.toUpperCase();
  const interval = req.query.interval || '1month';
  const outputsize = req.query.outputsize || '60';

  if (!symbol) {
    return res.status(400).json({ error: 'Símbolo do ativo é obrigatório' });
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/time_series`, {
      params: {
        symbol: symbol,
        interval,
        outputsize,
        apikey: API_KEY,
      },
    });

    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }

    const valoresBrutos = data.values || [];
    const datas = valoresBrutos.map(item => item.datetime).reverse();
    const valores = valoresBrutos.map(item => parseFloat(item.close)).reverse();
    const precoAtual = valores.at(-1) || null;

    return res.json({ precoAtual, datas, valores });
  } catch (error) {
    console.error('Erro ao buscar ativo:', error.message);
    return res.status(500).json({ error: 'Erro interno ao buscar dados' });
  }
});

// ========================================
// 🤖 Rota: Enviar dados para previsão futura (TODO)
// ========================================
app.post('/api/prever', async (req, res) => {
  const { valores, datas, dataLimite } = req.body;

  if (!valores || !datas || !dataLimite) {
    return res.status(400).json({ error: 'valores, datas e dataLimite são obrigatórios' });
  }

  try {
    const { data } = await axios.post('http://localhost:5000/prever', {
      valores,
      datas,
      dataLimite,
    });

    return res.json(data);
  } catch (error) {
    console.error('Erro ao chamar a API Python:', error.message);
    return res.status(500).json({ error: 'Erro ao processar previsão' });
  }
});

// ==================================
// 🧠 Rota: Treinar modelo preditivo (TODO)
// ==================================
app.post('/api/treinar', async (req, res) => {
  const { codigo, interval = '1day', outputsize = '30' } = req.body;

  if (!codigo) {
    return res.status(400).json({ error: 'Código do ativo é obrigatório para treino' });
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/time_series`, {
      params: {
        symbol: codigo,
        interval,
        outputsize,
        apikey: API_KEY,
      },
    });

    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }

    const valores = data.values?.map(v => parseFloat(v.close)).reverse();

    if (!valores || valores.length < 6) {
      return res.status(400).json({ error: 'Poucos dados para treinar o modelo.' });
    }

    // Geração de features: SMA e Momentum
    const treino = [];
    for (let i = 5; i < valores.length; i++) {
      const sma = valores.slice(i - 5, i).reduce((a, b) => a + b, 0) / 5;
      const momentum = valores[i - 1] - valores[i - 5];
      const target = valores[i];
      treino.push({ sma, momentum, target });
    }

    const payload = {
      X: treino.map(d => [d.sma, d.momentum]),
      y: treino.map(d => d.target),
    };

    const response = await axios.post('http://localhost:5000/treinar', payload);
    return res.json(response.data);
  } catch (error) {
    console.error('Erro ao treinar modelo:', error.message);
    return res.status(500).json({ error: 'Erro interno ao treinar o modelo.' });
  }
});

// ==========================
// 🚀 Inicialização do servidor
// ==========================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);


});
