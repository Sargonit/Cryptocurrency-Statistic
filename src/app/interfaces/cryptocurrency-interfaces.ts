export interface CryptocurrencyJSON {
  readonly color: string;
  readonly name: string;
  readonly id: number;
  readonly price: number;
  readonly symbol: string;
}

export interface CryptocurrencySimplifiedList {
  name: string;
  id: number;
  maxPrice: number;
  minPrice: number;
  isChecked: boolean;
}