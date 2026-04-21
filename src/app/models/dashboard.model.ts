import { ResumoFinanceiroMensal } from "./resumo-financeiro-mensal.model";

export interface Dashboard {
  id: string;
  ano: number;
  mes: number;
  dataInclusao: string;
  usuarioId: string;
  usuario: any | null;
  quantidadeRegistro: number;
  valorDespesaTotal: number;
  valorEntradaTotal: number;
  totalDespesas: number;
  totalEntradas: number;
  totalSaldo: number;
  registros: ResumoFinanceiroMensal[];
}
