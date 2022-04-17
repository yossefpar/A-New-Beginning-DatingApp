import { MembersService } from './../../Services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] =[];
  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.leadMembers();
  }
  leadMembers() {
   this.membersService.getMembers()
   .subscribe(member => {
     this.members = this.members;
   })
  }

}
