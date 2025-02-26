import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { TokenDataService } from '../services/token-data.service';
import { Router } from '@angular/router';

export const userRoleGuardTogether: CanActivateFn = (route, state) => {
  const token = inject(TokenDataService)
  const router = inject(Router)
  const userData = token.getTokenJson()
  if (userData.role_id === 1 || userData.role_id === 2) {
    return true;
  }else {
    router.navigateByUrl('login')
    console.log('No esta permitido')
    return false;
  }
};
