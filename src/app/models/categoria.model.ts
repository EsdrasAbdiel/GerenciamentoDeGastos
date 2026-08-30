import { Despesa } from "./despesa.model";

export interface Categoria {
  id: number;
  descricao: string;
  despesas: Despesa
}
