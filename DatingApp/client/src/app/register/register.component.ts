import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../Services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter<boolean>();
  model: any = {};
  constructor(
    private toastr: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  register() {
    this.accountService.register(this.model).subscribe((res)=> {
      console.log(res);
      this.cancel();
    },
    err => {
      console.log(err);
      this.toastr.error(err.error);
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
