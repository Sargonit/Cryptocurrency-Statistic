export interface DataForDrawGraph {
    id: number;
    name: string;
    points: Array<Point>;
    color: string;
    maxPrice: number;
    minPrice: number;
}

export interface Point {
    x: number | any;
    y: number | any;
}