import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // localStorage exists only in the browser. Server-side rendering must not
  // attempt to read it while Angular prepares the application shell.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const currentUser = localStorage.getItem('currentUser');

  if (currentUser && JSON.parse(currentUser).token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
