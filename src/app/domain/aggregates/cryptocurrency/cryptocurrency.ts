import { CryptocurrencyValuePerDate, CryptocurrencyValuePerDateJSON } from './cryptocurrency_value_per_date';
import { Currency } from './currency';
import { Injectable } from '@angular/core';

export interface CryptocurrencyJSON {
    readonly name: string;
    readonly symbol: string;
    readonly color: string;
    readonly id: number;
    readonly history: Array<CryptocurrencyValuePerDateJSON>;
}

// Класс одной криптовалюты
// TODO: можно оптимизировать способ создания и записи истории
@Injectable()
export class Cryptocurrency {
    readonly name: string;
    readonly symbol: string;
    readonly color: string;
    readonly id: number;
    readonly currency: Currency;
    history: Array<CryptocurrencyValuePerDate> = [];
    maxPrice: number;
    minPrice: number;

  constructor(cnt: CryptocurrencyJSON, currency: Currency, cryptocurrencyHistoryJSON: Array<CryptocurrencyValuePerDateJSON>) {
    this.name = cnt.name;
    this.symbol = cnt.symbol;
    this.color = cnt.color || this.getRandomColor();
    this.id = cnt.id;
    this.currency = currency;
    this.history = this.makeHistory(cryptocurrencyHistoryJSON);
    this.maxPrice = this.getMaxPrice(this.history);
    this.minPrice = this.getMinPrice(this.history);
  }

  private makeHistory (historyJSON: Array<CryptocurrencyValuePerDateJSON>): Array<CryptocurrencyValuePerDate> {
    const existIndexHistory = historyJSON.findIndex( (value) => value !== null);
    const isTimestampExist = (existIndexHistory > -1) ? historyJSON[existIndexHistory].hasOwnProperty('timestamp') : false;
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
            const price = (existIndexHistory === 0) ? historyJSON[i] : 0;
            const cryptocurrencyValuePerDateJSON = {timestamp: timestamp, price: price};
            const cryptocurrencyValuePerDate = new CryptocurrencyValuePerDate(cryptocurrencyValuePerDateJSON);
            history.push(cryptocurrencyValuePerDate);
        }
    }
    return history;
  }

  private getMaxPrice (history: Array<CryptocurrencyValuePerDate>): number {
    const priceHistory = history.map( valuePerDate => valuePerDate.price);
    return Math.max(...priceHistory);
  }  
  
  private getMinPrice (history: Array<CryptocurrencyValuePerDate>): number {
    const priceHistory = history.map( valuePerDate => valuePerDate.price);
    return Math.min(...priceHistory);
  }

  private getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  rebuildHistory(history: Array<CryptocurrencyValuePerDate>) {
    this.history = history;
    this.maxPrice = this.getMaxPrice(this.history);
    this.minPrice = this.getMinPrice(this.history);
  }
}