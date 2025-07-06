import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AtivoResponse {
  precoAtual: number;
  datas: string[];
  valores: number[];
}

@Injectable({
  providedIn: 'root',
})
export class AtivoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  buscarAtivo(codigo: string, interval: string, outputsize: string) {
    return this.http.get<any>(`${this.apiUrl}/ativo`, {
      params: { symbol: codigo, interval, outputsize }
    });
  }

  preverPreco(sma: number, momentum: number) {
    return this.http.post<any>(`${this.apiUrl}/prever`, {
      body: {
        sma: sma.toString(),
        momentum: momentum.toString()
      }
    });
  }
}
