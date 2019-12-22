import { Component, ViewChild, ElementRef, Host, OnInit } from '@angular/core';
import { D3graph } from '../../domain/aggregates/graph/D3graph';
import { DataForDrawGraph, Point } from '../../interfaces/D3Graph-interfaces';
import { CryptocurrencyControllerService } from '../../services/cryptocurrency-controller.service';

@Component({
    selector: 'graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css']
})

// Отображение графика
export class GraphComponent implements OnInit {
    @ViewChild('graph', {read: ElementRef, static: true})
    private graph: ElementRef<SVGElement>;
    private d3Graph: D3graph;

    constructor(@Host() private host: ElementRef<HTMLElement>, 
                private cryptocurrencyControllerService: CryptocurrencyControllerService) {  

    }

    async ngOnInit() {
        this.startDrawing ();
        this.cryptocurrencyControllerService.observerDataForGraph.subscribe( dataGraphList => {
            this.d3Graph.drawGraph(dataGraphList);
        });
    }

    private startDrawing() {
        this.d3Graph = new D3graph(this.graph, 1000, 1000);
    }
}