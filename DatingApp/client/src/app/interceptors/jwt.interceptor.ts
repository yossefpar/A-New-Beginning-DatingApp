import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AccountService } from '../Services/account.service';
import { User } from '../models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private account: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User = {token: '', username: '', photoUrl: '', gender: '', knownAs: '' };
    this.account.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
    if(currentUser?.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }
    return next.handle(request);

  }
}
