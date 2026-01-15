import { DespesaItem } from "./despesaItem.model";

export interface Despesa {
  ano: number;
  dataInclusao: Date;
  id: string;
  itensDespesa: DespesaItem[];
  itensEntrada: any;
  mes: number;
  valorTotal: number;
}