import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    const jwtValue = request.headers.authorization?.split('Bearer ') [1] || '';
    const payload = this.authService.verify(jwtValue);
    
    request.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email
    };

    return true;
  }
}