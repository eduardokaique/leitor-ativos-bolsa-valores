import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtivoService } from '../../services/ativo.service';
import { NgChartsModule } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  codigoAtivo = '';
  precoAtual: number | null = null;
  labels: string[] = [];
  data: number[] = [];
  carregando = false;
  erro = '';

  chartData: any;

  tendencia: 'alta' | 'baixa' | 'neutra' = 'neutra';
  recomendacao: string = '';
  precoPrevisto: number | null = null;

  mostrarHistorico: boolean = true;
  mostrarTendencia: boolean = true;
  mostrarMedia: boolean = true;
  intervalosDisponiveis: string[] = [
    '1min', '5min', '15min', '30min', '45min',
    '1h', '2h', '4h', '8h',
    '1day', '1week', '1month'
  ];

  outputsDisponiveis: string[] = ['5', '10', '30', '50', '100', '200', '500'];

  intervaloSelecionado: string = '1day';
  outputSelecionado: string = '30';



  constructor(private ativoService: AtivoService) { }

  buscarAtivo() {
    this.carregando = true;
    this.erro = '';
    this.precoAtual = null;
    this.labels = [];
    this.data = [];
    this.chartData = null;

    this.ativoService.buscarAtivo(this.codigoAtivo, this.intervaloSelecionado, this.outputSelecionado).subscribe({
      next: (res) => {
        this.precoAtual = res.precoAtual;
        this.labels = res.datas;
        this.data = res.valores;

        const linhaTendencia = this.gerarLinhaTendencia(this.data);
        const mediaMovel = this.calcularMediaMovel(this.data, 5); // SMA de 5 períodos
        const { a, b } = this.calcularRegressaoLinear(this.data);
        this.precoPrevisto = a * this.data.length + b;

        if (a > 0.2) {
          this.tendencia = 'alta';
          this.recomendacao = '📈 Tendência de alta: favorável para compra';
        } else if (a < -0.2) {
          this.tendencia = 'baixa';
          this.recomendacao = '📉 Tendência de queda: atenção ao risco';
        } else {
          this.tendencia = 'neutra';
          this.recomendacao = '🔍 Tendência neutra: aguarde melhores sinais';
        }

        this.chartData = {
          labels: this.labels,
          datasets: [
            ...(this.mostrarHistorico ? [{
              data: this.data,
              label: 'Histórico',
              borderColor: 'blue',
              backgroundColor: 'rgba(0,123,255,0.2)',
              fill: true
            }] : []),
            ...(this.mostrarTendencia ? [{
              data: linhaTendencia,
              label: 'Tendência Linear',
              borderColor: 'orange',
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            }] : []),
            ...(this.mostrarMedia ? [{
              data: mediaMovel,
              label: 'Média Móvel (5 dias)',
              borderColor: 'green',
              borderDash: [2, 2],
              fill: false,
              pointRadius: 0
            }] : [])
          ]
        };

        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao buscar o ativo';
        this.carregando = false;
      },
    });
  }

  private calcularRegressaoLinear(dados: number[]): { a: number; b: number } {
    const n = dados.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = dados;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - a * sumX) / n;

    return { a, b };
  }


  gerarLinhaTendencia(dados: number[]): number[] {
    const n = dados.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = dados;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - a * sumX) / n;

    return x.map(xi => a * xi + b);
  }

  calcularMediaMovel(dados: number[], periodo: number = 5): number[] {
    const resultado: number[] = [];

    for (let i = 0; i < dados.length; i++) {
      if (i < periodo - 1) {
        resultado.push(NaN); // para manter o alinhamento no gráfico
        continue;
      }

      const soma = dados.slice(i - periodo + 1, i + 1).reduce((a, b) => a + b, 0);
      resultado.push(soma / periodo);
    }

    return resultado;
  }

  preverPreco() {
    // Exemplo usando os últimos valores para SMA e momentum
    const dadosValidos = this.data.filter(val => !isNaN(val));
    const sma = this.calcularMediaMovel(dadosValidos, 5).at(-1) || 0;
    const momentum = dadosValidos.length > 1 ? dadosValidos.at(-1)! - dadosValidos.at(-2)! : 0;

    this.ativoService.preverPreco(sma, momentum).subscribe({
      next: (res) => {
        this.precoPrevisto = res.precoPrevisto;
        alert(`📈 Preço previsto: R$ ${res.precoPrevisto.toFixed(2)}`);
      },
      error: () => {
        alert('Erro ao gerar previsão.');
      }
    });
  }

  treinarModelo() {
    if (!this.codigoAtivo) return;

    this.carregando = true;

    fetch('http://localhost:3000/api/treinar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo: this.codigoAtivo,
        interval: this.intervaloSelecionado,
        outputsize: this.outputSelecionado
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Treinamento concluído!');
        this.carregando = false;
      })
      .catch(() => {
        alert('Erro ao treinar o modelo');
        this.carregando = false;
      });
  }
}
