import { take } from 'rxjs/operators';
import { MembersService } from './../../Services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/models/pagination';
import { AccountService } from 'src/app/Services/account.service';
import { UserParams } from 'src/app/models/UserParams';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }]

  constructor(
    private memberService: MembersService,
    //private accountService: AccountService,
    ) {
      this.userParams = this.memberService.UserParams;
    }

  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers() {
   this.memberService.UserParams = this.userParams;

   this.memberService.getMembers(this.userParams)
   .subscribe(response => {
     this.members = response.result;
     this.pagination = response.pagination;
   });
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.UserParams = this.userParams;
    this.loadMembers();
  }

}
