import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return next(request);
  if (request.url.includes('/api/auth/login') || request.url.includes('/api/auth/register')) return next(request);
  const saved = localStorage.getItem('currentUser');
  let token: string | null = null;
  try { token = saved ? JSON.parse(saved).token : null; } catch { localStorage.removeItem('currentUser'); }
  return next(token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request);
};
