import { DataForDrawGraph, Point } from '../../../interfaces/D3Graph-interfaces';

// Вспомогательный класс для построения графика по данным
// TODO: методы getMax.../getMin... работают идентично и для D3Graph - вынести в сервис либо через abstract
export class DataOfGraph {
    readonly dataForDrawGraph: DataForDrawGraph;
    readonly length: number;
    readonly pointMax: Point;
    readonly pointMin: Point;

    constructor(dataForDrawGraph: DataForDrawGraph) {
        this.dataForDrawGraph = dataForDrawGraph;
        this.length = dataForDrawGraph.points.length;
        this.pointMax = this.getMaxPointValue();
        this.pointMin = this.getMinPointValue();
    }

    private getMaxPointValue (): Point {
        const pointsAxisX = [];
        const pointsAxisY = [];
        this.dataForDrawGraph.points.forEach( point => {
            pointsAxisX.push(point.x);
            pointsAxisY.push(point.y);
        });

        const x = pointsAxisX.reduce( (prev, curr) => {return Math.max(prev, curr)});
        const y = pointsAxisY.reduce( (prev, curr) => {return Math.max(prev, curr)});

        return {x: x, y: y} as Point;
    }

    private getMinPointValue (): Point {
        const pointsAxisX = [];
        const pointsAxisY = [];
        this.dataForDrawGraph.points.forEach( point => {
            pointsAxisX.push(point.x);
            pointsAxisY.push(point.y);
        });

        const x = pointsAxisX.reduce( (prev, curr) => {return Math.min(prev, curr)});
        const y = pointsAxisY.reduce( (prev, curr) => {return Math.min(prev, curr)});

        return {x: x, y: y} as Point;
    }
}