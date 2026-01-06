import { DespesaItem } from "./despesaItem.model";

export interface Despesa {
  ano: number;
  dataInclusao: Date;
  id: string;
  itensDespesa: DespesaItem[];
  mes: number;
  valorTotal: number;
}