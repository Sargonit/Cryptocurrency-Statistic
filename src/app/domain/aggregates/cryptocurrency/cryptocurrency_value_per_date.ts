
export interface CryptocurrencyValuePerDateJSON {
  price: string;
  timestamp: string;
}

// Калсс отвечающий за 1 еденицу истории цена/дата
// TODO: можно улучшить способ хранения и доступа к данным
export class CryptocurrencyValuePerDate {
    readonly price: number;
    readonly date: Date | null;

  constructor(cnt) {
      const price = +(cnt.price ? cnt.price : cnt);
      this.price = +(price.toFixed(2));
      this.date = new Date(+cnt.timestamp);
  }
}