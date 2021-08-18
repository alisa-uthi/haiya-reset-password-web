import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup
  userId: number = 0
  resetToken: string = ''
  
  resetSuccess: boolean | undefined
  responseMsg: string = ''

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    // Get userId and reset token from query params in URL
    this.route.queryParams
      .subscribe(params => {
        this.userId = params.id;
        this.resetToken = params.token;
      }
    );

    // Initialize form
    this.passwordForm = new FormGroup({
      password: new FormControl('', 
        [Validators.required, Validators.minLength(8)]
      ),
      confirmedPassword: new FormControl('', Validators.required),
    });

    // Set form group validator
    this.passwordForm.setValidators(this.comparisonValidator())
  }

  ngOnInit(): void {
  }

  get password() { return this.passwordForm.get('password') }
  get confirmedPassword() { return this.passwordForm.get('confirmedPassword') }

  comparisonValidator() : any{
      return (group: FormGroup) => {
        const password = group.controls['password'];
        const confirmedPassword = group.controls['confirmedPassword'];
        if (password.value !== confirmedPassword.value) {
            confirmedPassword.setErrors({ message: 'Password must match.'});
        } else {
            confirmedPassword.setErrors(null);
        }
    }
  }

  async onSubmit() {
    if(this.passwordForm.valid) {
      let response = await this.http.post(`http://localhost:8080/api/user/auth/${this.userId}/reset-password`, {
        password: this.password?.value,
        token: this.resetToken
      }).toPromise<any>()
      
      if(response.messageId) {
        this.resetSuccess = true;
        this.responseMsg = response.message
      } else {
        this.resetSuccess = false;
        this.responseMsg = response.message
      }
    } 
  }

}
