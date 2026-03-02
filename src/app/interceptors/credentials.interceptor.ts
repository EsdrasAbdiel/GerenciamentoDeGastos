import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor funcional responsável por adicionar
// withCredentials=true nas requisições protegidas
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {

  // Lista de rotas públicas que NÃO precisam enviar cookies
  const rotasPublicas = [
    '/auth/login',
    '/auth/registro',
    '/auth/esqueci-senha'
  ];

  // Verifica se a URL da requisição contém alguma rota pública
  // some() retorna true se encontrar pelo menos uma correspondência
  const isPublic = rotasPublicas.some(url =>
    req.url.includes(url)
  );

  // Se for uma rota pública:
  // deixa a requisição seguir sem modificações
  if (isPublic) {
    return next(req);
  }

  // HttpRequest é imutável, então precisamos clonar
  // a requisição para alterar suas configurações
  const cloned = req.clone({
    // withCredentials=true faz o navegador enviar cookies
    // automaticamente (ex: JWT em cookie HttpOnly)
    withCredentials: true
  });

  // Envia a requisição clonada para o próximo interceptor
  // ou diretamente para a API
  return next(cloned);
};