import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { PaginatedResult } from './../models/pagination';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserParams } from '../models/UserParams';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './PaginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
members:Member[] = [];
userParams: UserParams;
user: User;
memberCache = new Map<string , PaginatedResult<Member[]>>();

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    ) {
      accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
        this.userParams = new UserParams(user);
      });
    }

    public get UserParams(): UserParams {
      return this.userParams;
    }

    public set UserParams(userParams : UserParams) {
      this.userParams = userParams;
    }

    resetUserParams() {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }

  getMembers(userParams: UserParams){
    const cacheKey = Object.values(userParams).join('-');
    const response = this.memberCache.get(cacheKey);
    if(response) return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(`${this.baseUrl}users`, params, this.http)
    .pipe(
      tap(res => this.memberCache.set(cacheKey , res))
    )

  }

  getMember(username: string){
    const member = [...this.memberCache.values()];
    const allUsers = member.reduce((arr, elem) => arr.concat(elem.result), [] as Member[]);
    const foundMember = allUsers.find(m => m.username === username);
    if(foundMember) return of(foundMember);

    return this.http.get<Member>(`${this.baseUrl}users/${username}`);
  }
  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}users`, member).pipe(
      tap(()=> {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  addLike(username: string) {
    const url = `${this.baseUrl}likes/${username}`;
    return this.http.post(url , {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber ,pageSize );
    params = params.append('predicate', predicate)
    return getPaginatedResult<Partial<Member>[]>(`${this.baseUrl}likes`, params, this.http);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photoId}`);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url,
    {
      observe:'response',
      params
    }).pipe(
      map(response => {
        paginatedResult.result = response.body as T;
        if(response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') || '');
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let headers = new HttpParams();
    headers = headers.append('pageNumber', pageNumber.toString());
    headers = headers.append('pageSize', pageSize.toString());
    return headers;
  }
}
