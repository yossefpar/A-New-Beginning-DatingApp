import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AccountService } from '../Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  //loggedIn: boolean = false;
  currentUser$: Observable<User>;
  model: any ={};
  constructor(
    private accountService: AccountService,

    ) {
      this.currentUser$ = this.accountService.currentUser$;
     }

  ngOnInit(): void {
  }
  login(){
    this.accountService.login(this.model)
    .subscribe(res => {
      console.log(res);
    },
    err => {
      console.log(err);
    });
  }

  logout() {
    this.accountService.logout();
  }


}
