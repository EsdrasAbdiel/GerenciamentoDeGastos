import { DespesaItem } from "./despesaItem.model";
import { EntradaItem } from "./entradaItem.model";

export interface ResumoFinanceiroMensal {
  ano: number;
  dataInclusao: Date;
  id: string;
  itensDespesa: DespesaItem[];
  itensEntrada: EntradaItem[];
  mes: number;
  valorTotal: number;
}
