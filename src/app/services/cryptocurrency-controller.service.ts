import { Injectable } from "@angular/core";
import { CryptocurrencySimplifiedList } from "../interfaces/cryptocurrency-interfaces";
import { CryptocurrencyRepositoryService } from "../domain/repositories/cryptocurrency-repository.service";
import { Cryptocurrency } from "../domain/aggregates/cryptocurrency/cryptocurrency";
import { Observable, BehaviorSubject } from "rxjs";
import { DataForDrawGraph, Point } from "../interfaces/D3Graph-interfaces";

// TODO: реализовать механизм задающий данные которые нужно отображать по умолчанию 
// (исправить везде по коду)
const DAFAULT_ID_CHECKED = [1, 2, 6];

// Сервис управления криптовалютами, берет данные из репозитория и формтирует их для компонентов
@Injectable()
export class CryptocurrencyControllerService {

    cryptocurrencies: Promise<ReadonlyArray<Cryptocurrency>>;
    cryptocurrencySimplifiedList: Promise<Array<CryptocurrencySimplifiedList>>;
    private cryptocurrenciesList: ReadonlyArray<Cryptocurrency>;
    
    private cryptocurrenciesDataForGraph: BehaviorSubject<DataForDrawGraph[]> = new BehaviorSubject<DataForDrawGraph[]>([]);
    observerDataForGraph: Observable<any> = this.cryptocurrenciesDataForGraph.asObservable();

    constructor(private cryptocurrencyRepositoryService: CryptocurrencyRepositoryService) { 
        this.cryptocurrencies = this.cryptocurrencyRepositoryService.cryptocurrencies;
        this.cryptocurrencySimplifiedList = this.makeSimplifiedList();
        
        this.cryptocurrencies.then(async (cryptocurrencies) => {
            this.cryptocurrenciesList = cryptocurrencies;
        })
    }

    private makeDataForGraph(id: number): DataForDrawGraph {  
        const cryptocurrency =  this.cryptocurrenciesList.filter( elem => elem.id === id)[0];
        const name = cryptocurrency.name;
        const maxPrice = cryptocurrency.maxPrice;
        const minPrice = cryptocurrency.minPrice;
        const color = cryptocurrency.color;
        const points = cryptocurrency.history.map( value => {
            return {x: value.date, y: value.price} as Point;
        });

        return {id: id, name: name, points: points, color: color, maxPrice: maxPrice, minPrice: minPrice} as DataForDrawGraph;
    }

    private updateDataGraph(dataGraph: DataForDrawGraph) {
        const dataGraphList = this.cryptocurrenciesDataForGraph.getValue();
        dataGraphList.push(dataGraph);
        this.cryptocurrenciesDataForGraph.next(dataGraphList);
    }

    async changeCryptocurrencysList(id: number) {
        const dataGraphList = this.cryptocurrenciesDataForGraph.getValue();
        
        let isAddDataGraph = true;
        for(let i = 0; i < dataGraphList.length; i++) {
            if(dataGraphList[i].id === id) {
                dataGraphList.splice(i, 1);
                this.cryptocurrenciesDataForGraph.next(dataGraphList);
                isAddDataGraph = false;
                break;
            }
        }

        if (isAddDataGraph) {
            await this.changeHistoryIfNeed(id);
            const dataGraph = this.makeDataForGraph(id);
            this.updateDataGraph(dataGraph);
        }
    }

    private makeSimplifiedList (): Promise<Array<CryptocurrencySimplifiedList>> {
        const simlifiedList = new Promise<Array<CryptocurrencySimplifiedList>>((resolve, reject) => {
            resolve(this.setDefaultSimplifiedList());  
        });
        return simlifiedList;
    }

    private async setDefaultSimplifiedList () {
        const resolvePromise = await this.cryptocurrencies;
        const simlifiedList = resolvePromise.map( (cryptocurrency) => {
            const name = cryptocurrency.name;
            const id = cryptocurrency.id;
            const maxPrice = cryptocurrency.maxPrice;
            const minPrice = cryptocurrency.minPrice;
            const isChecked = DAFAULT_ID_CHECKED.find((value) => id === value) ? true : false;
            return {name: name, id: id, maxPrice: maxPrice, minPrice: minPrice, isChecked: isChecked} as CryptocurrencySimplifiedList;  
        });
        return simlifiedList;
    }   

    // TODO: внедрить метод для возможности изменения статистики за определенное время
    private async changeHistoryIfNeed(id: number) { 
        await this.cryptocurrencyRepositoryService.changeHistory(id, '30d');
    }
}