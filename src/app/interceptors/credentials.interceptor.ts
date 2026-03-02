import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {

  const rotasPublicas = [
    '/auth/login',
    '/auth/registro',
    '/auth/esqueci-senha'
  ];

  const isPublic = rotasPublicas.some(url =>
    req.url.includes(url)
  );

  if (isPublic) {
    return next(req);
  }

  const cloned = req.clone({
    withCredentials: true
  });

  return next(cloned);
};