import { Component, OnInit } from '@angular/core';
import { CryptocurrencyControllerService } from '../../services/cryptocurrency-controller.service';
import { DataForDrawGraph } from 'src/app/interfaces/D3Graph-interfaces';
import { Angular2Csv } from 'angular2-csv/';

enum TypeSorting {
    increase = 'increase',
    decrease = 'decrease'
}

enum TypeWay {
    price = 'price',
    date = 'date'
}

@Component({
    selector: 'cryptocurrency-data-table',
    templateUrl: './cryptocurrency-data-table.component.html',
    styleUrls: ['./cryptocurrency-data-table.component.css']
})

// Отображение детальной инф. по крптовалютам
export class CryptocurrencyTableComponent implements OnInit {

    cryptocurrenciesListForView: Array<DataForDrawGraph> = [];
    dateList: Array<string> = [];   

    constructor(private cryptocurrencyControllerService: CryptocurrencyControllerService) {

    }

    async ngOnInit() {
        this.cryptocurrencyControllerService.observerDataForGraph.subscribe( dataGraphList => {
            if(dataGraphList.length !== 0) {
                this.updateDateList(dataGraphList[0]);
                this.updateCryptocurrencyListForView(dataGraphList);
            }
        })      
    }

    private updateDateList(dataGraph: DataForDrawGraph) {
        this.dateList = [];
        dataGraph.points.forEach((point) => {
            const date = point.x.toLocaleString();
            this.dateList.push(date);
        });
    }

    private updateCryptocurrencyListForView (dataGraphList: Array<DataForDrawGraph>) {
        this.cryptocurrenciesListForView = dataGraphList;
    }

    private sortingByWay(param: string, sortingWay: string) {  
        if(param === TypeWay.date || param === TypeWay.price) {
            switch(sortingWay) {
                case TypeSorting.increase:
                    this.cryptocurrenciesListForView.forEach( (crypto) => {
                        crypto.points.sort((a, b) => { 
                            const p = (param === TypeWay.price ? 'y' : 'x');
                            return this.comparatorIncrease(a, b, p);
                        });
                    });
                    break;
                case TypeSorting.decrease:
                    this.cryptocurrenciesListForView.forEach( (crypto) => {
                        crypto.points.sort((a, b) => { 
                            const p = (param === TypeWay.price ? 'y' : 'x');
                            return this.comparatorDecrease(a, b, p);
                        });
                    });
                    break;
                default:
                    this.cryptocurrenciesListForView.forEach( (crypto) => {
                        crypto.points.sort((a, b) => { 
                            const p = (param === TypeWay.price ? 'y' : 'x');
                            return this.comparatorIncrease(a, b, p);
                        });
                    });
            }
            this.updateDateList(this.cryptocurrenciesListForView[0]);
        }
        else {
            switch(sortingWay) {
                case TypeSorting.increase:
                    this.cryptocurrenciesListForView.sort((a, b) => { 
                        return this.comparatorIncrease(a, b, param);
                    });
                    break;
                case TypeSorting.decrease:
                    this.cryptocurrenciesListForView.sort((a, b) => { 
                        return this.comparatorDecrease(a, b, param);
                    });
                    break;
                default:
                    this.cryptocurrenciesListForView.sort((a, b) => { 
                        return this.comparatorIncrease(a, b, param);
                    });
            }
        }            
    }

    private comparatorIncrease(prev: object, curr: object, param: string): number {
        if (prev[param] > curr[param]) {
            return 1;
          }
          if (prev[param] < curr[param]) {
            return -1;
          }
          return 0;
    }

    private comparatorDecrease(prev: object, curr: object, param: string) {
        if (prev[param] < curr[param]) {
            return 1;
          }
          if (prev[param] > curr[param]) {
            return -1;
          }
          return 0;
    }

    sorting(event: any): void {
        const param = event.srcElement.dataset.name;
        const sortingWay = event.srcElement.dataset.sort;
        event.srcElement.dataset.sort = (sortingWay !== TypeSorting.increase) ? TypeSorting.increase : TypeSorting.decrease;
        this.sortingByWay(param, event.srcElement.dataset.sort);
    }

    // TODO: реализовать преобразование данных для корректного сохранения в в файл
    // Данные сохраняются но не пригодны для использования
    downloadCSV() {
        const data = this.cryptocurrenciesListForView;
        new Angular2Csv(data, 'crypto');        
    }

    saveCSV(): void {
        
    }
}