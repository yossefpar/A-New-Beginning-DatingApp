import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../Services/account.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter<boolean>();
  model: any = {};
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
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
    this.registerForm.get('password')?.valueChanges.subscribe(()=> {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    })
  }
  matchValues(matchTo: string):ValidatorFn {
    return (control: AbstractControl): {[key: string]:any } | null => {
      return control?.value === (control?.parent as FormGroup)?.controls[matchTo].value ? null : { isMatching: true };

    }
  }
  register() {
      this.accountService.register(this.registerForm.value).subscribe((res)=> {
      this.router.navigate(['/members']);
      this.cancel();
    },
    err => {
      this.validationErrors= err;

    });
  }

  cancel() {
    console.log(this.registerForm.value);
  }
}
