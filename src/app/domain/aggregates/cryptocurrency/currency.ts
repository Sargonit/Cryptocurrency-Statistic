export interface CurrencyJSON {
  sign: string;
  symbol: string;
}

// Класс валюты
export class Currency {
  readonly symbol: string;
  readonly name: string;

  constructor(cnt: CurrencyJSON) {   
    this.symbol = cnt.sign;
    this.name = cnt.symbol;
  }
}