import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../Services/account.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter<boolean>();
  model: any = {};
  registerForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required ],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password:['',[Validators.required, Validators.minLength(4) , Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    });
  }
  matchValues(matchTo: string):ValidatorFn {
    return (control: AbstractControl): {[key: string]:any }| null => {
      return control?.value === (control?.parent as FormGroup)?.controls[matchTo].value ? null : { isMatching: true };

    }
  }
  register() {
    // this.accountService.register(this.model).subscribe((res)=> {
    //   console.log(res);
    //   this.cancel();
    // },
    // err => {
    //   console.log(err);
    //   this.toastr.error(err.error);
    // });
  }

  cancel() {
    console.log(this.registerForm.value);
  }
}
