import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  currentUser$: Observable<User>;
  model: any ={};

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
    ) {
      this.currentUser$ = this.accountService.currentUser$;
     }

  ngOnInit(): void {
  }
  login(){
    this.accountService.login(this.model)
    .subscribe(res => {
      this.router.navigateByUrl('/members');
      console.log(res);
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
   test() {
    JSON.parse('./test.js');

   }


}




