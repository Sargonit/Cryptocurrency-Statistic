import { Injectable } from '@angular/core';
import { Cryptocurrency } from './../aggregates/cryptocurrency/cryptocurrency';
import { CryptocurrencyFactory } from './../factories/cryptocurrency-factory';

// Сервис хранения данных по криптовалютам и изменения их
// то, откуда данные попадают ко всем компонентам
@Injectable()
export class CryptocurrencyRepositoryService {

  cryptocurrencies: Promise<ReadonlyArray<Cryptocurrency>>;

  constructor(private cryptocurrencyFactory: CryptocurrencyFactory) {
    this.cryptocurrencies = this.cryptocurrencyFactory.makeAllFromJSON();
  }

  async changeHistory(id: number, timeframe: string) {
    const history = await this.cryptocurrencyFactory.makeHistoryFromJSON(id, timeframe);
    (await this.cryptocurrencies).filter((cryptocurrency) => {
      cryptocurrency.rebuildHistory(history);
      cryptocurrency.id === id;
    });
  }

}