import { Injectable } from '@angular/core';
import { HttpService } from './../../services/http.service';
import { Currency } from './../aggregates/cryptocurrency/currency';
import { Cryptocurrency, CryptocurrencyJSON } from './../aggregates/cryptocurrency/cryptocurrency';
import { CryptocurrencyValuePerDateJSON, CryptocurrencyValuePerDate } from './../aggregates/cryptocurrency/cryptocurrency_value_per_date';

enum LoadHistoryFor {
  Bitcoin = 'Bitcoin',
  Ethereum ='Ethereum',
  Stellar = 'Stellar'
}

export interface CryptoJSON {
    data: any;
}

// Класс создания криптовалют и их компонентов
@Injectable()
export class CryptocurrencyFactory {

  private data: Array<Cryptocurrency> = [];

  constructor(private httpService: HttpService) {
  }

  async makeHistoryFromJSON(id: number, timeframe: string): Promise<any> {
    const cryptocurrencyHistoryJSON = (await this.httpService.getCryptocurrencyHistory(id, timeframe) as CryptoJSON).data.history; 
    const history = this.makeHistory(cryptocurrencyHistoryJSON);
    return history;
  }

  async makeAllFromJSON(): Promise<any> {
    const cryptocurrencies = await this.httpService.getCryptocurrencies() as CryptoJSON;
    const currency = new Currency(cryptocurrencies.data.base);

    for (const coin of cryptocurrencies.data.coins) {
        const cryptocurrency = this.makeCryptocurreny(coin, currency, coin.history);
        if (cryptocurrency.name === LoadHistoryFor.Bitcoin ||
            cryptocurrency.name === LoadHistoryFor.Ethereum ||
            cryptocurrency.name === LoadHistoryFor.Stellar) {
          const history = await this.makeHistoryFromJSON(cryptocurrency.id, '30d');
          cryptocurrency.rebuildHistory(history);
        }       
        this.data.push(cryptocurrency);
    }
    
    return this.data;
  }

  private makeCryptocurreny (cnt: CryptocurrencyJSON, currency: Currency, cryptocurrencyHistoryJSON: Array<CryptocurrencyValuePerDateJSON>) {
    return new Cryptocurrency(cnt, currency, cryptocurrencyHistoryJSON);
  }

  private makeHistory(historyJSON: any): Array<CryptocurrencyValuePerDate> {
    const isTimestampExist = !!(historyJSON[0].timestamp);
      let history = [];

      if(isTimestampExist) {
          for (let i = 0; i < historyJSON.length; i++) {
              const cryptocurrencyValuePerDate = new CryptocurrencyValuePerDate(historyJSON[i]);
              history.push(cryptocurrencyValuePerDate);
          }
      } else {
          const date = new Date();
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDay();

          for (let i = 0; i < historyJSON.length; i++) {
              const timestamp = new Date(year, month, day - i).getTime().toString();
              const price = historyJSON[i];
              const cryptocurrencyValuePerDateJSON = {timestamp: timestamp, price: price};
              const cryptocurrencyValuePerDate = new CryptocurrencyValuePerDate(cryptocurrencyValuePerDateJSON);
              history.push(cryptocurrencyValuePerDate);
          }
      }
    return history;
  }
}