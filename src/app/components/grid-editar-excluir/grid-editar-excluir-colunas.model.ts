import { TemplateRef } from "@angular/core";

export interface GridEditarExcluirColunas<T> {
  id: keyof T;          // chave do objeto
  tituloColuna: string;
  colspan: number;

  template?: TemplateRef<any>;
}

