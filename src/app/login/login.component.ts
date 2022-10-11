import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpLogin } from '../services/httpLogin';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('myinput') elementInputName?: ElementRef;

  @Output() checkLogin = new EventEmitter<boolean>();

  loginForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required)
  });

  viewSignIn = false;
  viewRegistrati = false;

  constructor(private httpLoginService: HttpLogin,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.elementInputName?.nativeElement.focus();
  }

  async login() {
    if(this.loginForm.valid) {
      const user = this.loginForm.value.name;
      const password = this.loginForm.value.password;
  
      try {
        this.spinnerService.show();
        this.httpLoginService.login(user,password).subscribe(
          result => {
            if(result) {
              this.checkLogin.emit(true);
            } else {
              this.viewRegistrati = true;
              this.swalAlert('Attenzione!','Utente e password errati o non ancora registrati','error');
            }
            this.spinnerService.hide();
          }
        )
      } catch {
        this.checkLogin.emit(false);
      }
    } else {
      this.swalAlert('Attenzione!','Nome e password obbligatori','error');
    }
  }

  async signin() {
    if(this.loginForm.valid) {
      const user = this.loginForm.value.name;
      const password = this.loginForm.value.password;
  
      try {
        this.spinnerService.show();
        this.httpLoginService.signin(user,password).subscribe(
          result => {
            if(result) {
              this.spinnerService.hide();
              this.swalAlert('Successo!','Utente registrato con successo, adesso puoi fare il login','success');
              this.viewRegistrati = false;
              this.doRegistrati();
            }
          }
        )
      } catch {
        this.swalAlert('Attenzione!','User e/o password non registrati, riprovare','error');
      }
    } else {
      this.swalAlert('Attenzione!','Nome e password obbligatori','error');
    }

  }

  doRegistrati() {
    this.viewSignIn=!this.viewSignIn;
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }
}
