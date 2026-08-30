import { TemplateRef } from '@angular/core';

export interface GridAcoesModel {
  key: string;
  label: string;
  template?: TemplateRef<unknown>;
  type: string;
}

