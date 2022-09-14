import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable, observable } from 'rxjs';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    
    return request.currentUser.isAdmin;
  }
}
