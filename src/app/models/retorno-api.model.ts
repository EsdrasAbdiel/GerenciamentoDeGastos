export interface RetornoApi<T> {
    sucesso?: boolean;
    mensagem?: string;
    resultado: T;
    error: any
}
