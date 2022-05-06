import { MembersService } from 'src/app/Services/members.service';
import { Member } from 'src/app/models/member';
import { Component, OnInit } from '@angular/core';
import { Pagination } from '../models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
 members: Partial<Member>[] = []
 predicate = 'liked';
 pageNumber = 1;
 pageSize = 5;
 pagination: Pagination;

  constructor(
    private memberService: MembersService
  ) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(members => {
      this.members = members.result;
      this.pagination = members.pagination;
      });
  }

  pageChanged(event: any): void {
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
