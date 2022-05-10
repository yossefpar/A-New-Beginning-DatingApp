import { MembersService } from './../Services/members.service';
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Member } from "../models/member";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {

  constructor(private membersService: MembersService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Member>{
   return this.membersService.getMember(route.paramMap.get('username') as string);
  }

}
