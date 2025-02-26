import type { CanActivateFn } from '@angular/router';
import { TokenDataService } from '../services/token-data.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const editOwnUserGuard: CanActivateFn = (route, state) => {
  const token = inject(TokenDataService)
  const router = inject(Router);
  const userData = token.getTokenJson();
  if ((Number(userData.user_id) === Number(route.params['id'])) || userData.role_id === 1) {
    return true
  }else {
    console.log('No está permitido')
    router.navigateByUrl('login')
    return false;
  }
};
