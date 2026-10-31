import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicOnlyGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  const session = localStorage.getItem('currentUser');
  return session && JSON.parse(session).token ? router.createUrlTree(['/dashboard']) : true;
};
