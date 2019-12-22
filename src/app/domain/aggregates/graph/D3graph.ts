import { ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { DataForDrawGraph, Point } from '../../../interfaces/D3Graph-interfaces';
import { DataOfGraph } from './DataOfGraph';

// Клас построения графиков и обочка для D3.js
// TODO: возможно стоит раделить построение графика и оболочку для D3.js
// TODO: реализовать механизм адаптации к различным разрешениям/размерам экрана
// TODO: реализовать метод перерисовки графика при resize window
export class D3graph {
    private svg: any;
    private width: number;
    private height: number;
    private chartWidth: number;
    private chartHeight: number;
    private margin: number = 50;
    private dataOfGraphs: Array<DataOfGraph> = [];
    private xScale: any;
    private yScale: any;
    private line: any;

    constructor(svg: ElementRef<SVGElement>, width: number, height: number) {
        this.svg = d3.select(svg.nativeElement);
        this.width = width;
        this.height = height;
        this.chartWidth = width - this.margin;

        this.chartHeight =  this.width / (16/9);
    }

    drawGraph(dataForDrawGraph: ReadonlyArray<DataForDrawGraph>) { 
        this.svg.selectAll('#line').remove();
        if (dataForDrawGraph.length === 0) {
            return;
        }

        this.addGraph(dataForDrawGraph);
        this.setAxis();

        // Волшедное число отвечающее за количество дней
        // TODO: должно быть хранилище текущих настроек криптовалют откуда и берется данное число
        const n = 30

        this.svg
            .attr('viewBox', `0 0 ${this.chartWidth + this.margin} ${this.chartHeight + 2 * this.margin}`)
            .attr('preserveAspectRatio', 'xMinYMid');

        this.svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#FBFCFC");

        this.svg.selectAll('g').remove();

        this.line = d3.line()
            .x(d => this.xScale(d.x))
            .y(d => this.yScale(d.y))
            .curve(d3.curveMonotoneX);

        this.svg.append('g')
            .attr('transform', `translate(${this.margin}, ${this.margin})`)
            .call(d3.axisLeft(this.yScale)
                .ticks(Math.min(Math.floor(this.chartHeight / 15), n)));

        this.svg.append('g')
            .attr('transform', `translate(${this.margin}, ${this.chartHeight + this.margin + 5})`)
            .call(d3.axisBottom(this.xScale)
                .ticks(Math.floor(this.chartWidth / n))
                .tickFormat(d => {
                    const day = d.getDate();
                    const month = d.getMonth() + 1;
                    return (day + '.' + month);
                } ));

        this.drawLineGraph();
    }

    private drawLineGraph() {
        this.dataOfGraphs.forEach((dataOfGraphs) => {
            this.svg
                .append('g')
                .attr('transform', `translate(${this.margin}, ${this.margin})`)
                .append('path')
                .attr('id','line')
                .datum(dataOfGraphs.dataForDrawGraph.points)
                .attr('fill', 'none')
                .attr('stroke', dataOfGraphs.dataForDrawGraph.color)
                .attr('stroke-width', 1)
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('d', this.line);
        });
    }

    private addGraph(dataForDrawGraph: ReadonlyArray<DataForDrawGraph>) {
        this.dataOfGraphs = dataForDrawGraph.map((dataGraph) => {
            return new DataOfGraph(dataGraph);
        });
    }

    private setAxis() {
        const pointMax = this.getMaxPointValue();
        const pointMin = this.getMinPointValue();

        this.xScale = d3.scaleTime()
            .domain([pointMin.x, pointMax.x])
            .range([0, this.chartWidth]);

        this.yScale = d3.scaleLinear()
            .domain([pointMin.y, pointMax.y])
            .range([this.chartHeight, 0]);
    }

    private getMaxPointValue (): Point {
        const pointsAxisX = [];
        const pointsAxisY = [];
        this.dataOfGraphs.forEach( point => {
            pointsAxisX.push(point.pointMax.x);
            pointsAxisY.push(point.pointMax.y);
        });

        const x = pointsAxisX.reduce( (prev, curr) => {return Math.max(prev, curr)});
        const y = pointsAxisY.reduce( (prev, curr) => {return Math.max(prev, curr)});

        return {x: x, y: y} as Point;
    }

    private getMinPointValue (): Point {
        const pointsAxisX = [];
        const pointsAxisY = [];
        this.dataOfGraphs.forEach( point => {
            pointsAxisX.push(point.pointMin.x);
            pointsAxisY.push(point.pointMin.y);
        });

        const x = pointsAxisX.reduce( (prev, curr) => {return Math.min(prev, curr)});
        const y = pointsAxisY.reduce( (prev, curr) => {return Math.min(prev, curr)});

        return {x: x, y: y} as Point;
    }
}