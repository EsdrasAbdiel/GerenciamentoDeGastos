import { ResumoFinanceiroMensal } from './resumo-financeiro-mensal.model';

export interface Dashboard {
  quantidadeRegistro: number;
  totalDespesas: number;
  totalEntradas: number;
  totalSaldo: number;
  registros: ResumoFinanceiroMensal[];
}
