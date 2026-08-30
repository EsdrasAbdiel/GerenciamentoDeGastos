export interface RetornoApi<T> {
    sucesso?: boolean;
    mensagem?: string;
    resultado: T;
    error: string;
}

export interface RetornoBase {
  mensagem?: string;
  erro?: string;
  sucesso: boolean;
}
