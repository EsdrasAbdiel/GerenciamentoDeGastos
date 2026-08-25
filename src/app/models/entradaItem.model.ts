export interface EntradaItem {
  id: number;
  entradaDescricao: string;
  entradaValor: number;
  entrada_id: string;
  dataPagamento: Date | string;
  tipo?: string;
}
