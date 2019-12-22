import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Сервис получения данных с сервера
@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {
  }

// Получаем данные по конкретной криптовалюте (по ID) с Coinranking 
// (В данный момент не используется, была идея переделать для оптимизации загрузки)
  async getCryptocurrency(id: number, timeframe: string) {
   return await this.http.get(`https://api.coinranking.com/v1/public/coin/${id}?base=USD&timePeriod=${timeframe}`).toPromise();
  }

// Получаем историю по конкретной криптовалюте (по ID)
  async getCryptocurrencyHistory(id: number, timeframe: string) {
    return await this.http.get(`https://api.coinranking.com/v1/public/coin/${id}/history/${timeframe}`).toPromise();
  }

// Получаем данные по всем криптовалютам с Coinranking
  async getCryptocurrencies() {
    return await this.http.get(`https://api.coinranking.com/v1/public/coins`).toPromise();
  }
}