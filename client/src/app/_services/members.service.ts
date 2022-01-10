import { ɵallowPreviousPlayerStylesMerge } from '@angular/animations/browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache: Map<string, PaginatedResult<Member[]>> = new Map<string, PaginatedResult<Member[]>>();
  userParams!: UserParams;
  user!: User;


  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    const key = Object.values(userParams).join('-');
    const response = this.memberCache.get(key);
    if (response) {
      return of(response);
    }

    let httpParams = this.getPaginationHeader(userParams.pageNumber, userParams.pageSize);

    httpParams = httpParams.append('minAge', userParams.minAge.toString());
    httpParams = httpParams.append('maxAge', userParams.maxAge.toString());
    httpParams = httpParams.append('gender', userParams.gender);
    httpParams = httpParams.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', httpParams).pipe(map(response => {
      this.memberCache.set(key, response);
      return response;

    }))
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((previous: Member[], current) => previous.concat(current.result), [])
      .find((member: Member) => member.username === username);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  private getPaginatedResult<T>(url: string, httpParams: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params: httpParams }).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.has('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }

        return paginatedResult;
      })
    );
  }

  private getPaginationHeader(pageNumber: number, pageSize: number) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append("pageNumber", pageNumber.toString())
    httpParams = httpParams.append("pageSize", pageSize.toString())
    return httpParams;
  }

}
