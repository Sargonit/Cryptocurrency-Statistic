import { Component, OnInit } from '@angular/core';
import { CryptocurrencyControllerService } from '../../services/cryptocurrency-controller.service';
import { CryptocurrencySimplifiedList } from '../../interfaces/cryptocurrency-interfaces';

enum TypeSorting {
    increase = 'increase',
    decrease = 'decrease'
}

@Component({
    selector: 'cryptocurrency-list',
    templateUrl: './cryptocurrency-list.component.html',
    styleUrls: ['./cryptocurrency-list.component.css']
})

// Список доступных криптовалют с некоторыми данными и возможностью выбрать для отображения более детальной инф.
export class CryptocurrencyListComponent implements OnInit {

    cryptocurrencySimplifiedList: Array<CryptocurrencySimplifiedList>;
    sorting(event: any): void {
        const param = event.srcElement.dataset.name;
        const sortingWay = event.srcElement.dataset.sort;
        event.srcElement.dataset.sort = (sortingWay !== TypeSorting.increase) ? TypeSorting.increase : TypeSorting.decrease;
        this.sortingByWay(param, event.srcElement.dataset.sort);
    }
    
    constructor(private cryptocurrencyControllerService: CryptocurrencyControllerService) {}

    async ngOnInit() {
        this.cryptocurrencySimplifiedList = await this.cryptocurrencyControllerService.cryptocurrencySimplifiedList;
        
        this.cryptocurrencyControllerService.changeCryptocurrencysList(1);
        this.cryptocurrencyControllerService.changeCryptocurrencysList(2);
        this.cryptocurrencyControllerService.changeCryptocurrencysList(6);
    }

    // TODO: подобный метод уже есть, вынести в отдельный класс/сервис
    private sortingByWay(param: string, sortingWay: string) {  
        switch(sortingWay) {
            case TypeSorting.increase:
                this.cryptocurrencySimplifiedList.sort((a, b) => { 
                    return this.comparatorIncrease(a, b, param);
                });
                break;
            case TypeSorting.decrease:
                this.cryptocurrencySimplifiedList.sort((a, b) => { 
                    return this.comparatorDecrease(a, b, param);
                });
                break;
            default:
                this.cryptocurrencySimplifiedList.sort((a, b) => { 
                    return this.comparatorIncrease(a, b, param);
                });
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

    checkValue(event: any) {
        const id = +event.srcElement.dataset.id;
        this.cryptocurrencyControllerService.changeCryptocurrencysList(id);
    }
}