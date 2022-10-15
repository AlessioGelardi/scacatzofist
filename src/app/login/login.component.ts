import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpLogin } from '../services/httpLogin';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Player } from '../interface/player';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('myinput') elementInputName?: ElementRef;

  @Output() checkLogin = new EventEmitter<string>();

  loginForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required)
  });

  signinForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', Validators.required),
    domanda: new UntypedFormControl('', Validators.required),
    risposta: new UntypedFormControl('', Validators.required)
  });

  recuperaForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    domanda: new UntypedFormControl('', Validators.required),
    risposta: new UntypedFormControl('', Validators.required)
  });

  viewSignIn = false;
  viewRecupero = false;
  viewRegistrati = false;
  viewConfermaRecupero = false;

  ipAddress = '';

  player: Player | undefined;

  questions = [
    "Cibo preferito?",
    "Nome della tua maestra dell'elementari?",
    "Nome del tuo animale preferito?",
    "Anno di nascita di un tuo genitore?",
    "Parola segreta?"
  ]

  constructor(private httpLoginService: HttpLogin,
    private spinnerService: NgxSpinnerService,
    private http:HttpClient) { }

  ngOnInit(): void {
    this.getIPAddress();
  }

  async login() {
    if(this.loginForm.valid) {
      const user = this.loginForm.value.name;
      const password = this.loginForm.value.password;
  
      try {
        this.spinnerService.show();
        this.httpLoginService.login(user,password,this.ipAddress).subscribe({
          next: (result) => {
            if(result) {
              this.checkLogin.emit(result._id);
            }
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            this.viewRegistrati = true;
            this.swalAlert('Attenzione!','Utente e password errati o non ancora registrati','error');
          },
          complete: () => {
            this.spinnerService.hide();
          }
        });
      } catch {
        this.checkLogin.emit();
      }
    } else {
      this.swalAlert('Attenzione!','Username e password obbligatori','error');
    }
  }
  
  async signin() {
    if(this.signinForm.valid) {
      const user = this.signinForm.value.name;
      const password = this.signinForm.value.password;
      const email = this.signinForm.value.email;
      const domanda = this.signinForm.value.domanda;
      const risposta = this.signinForm.value.risposta;

      const player = {
        'name': user,
        'pss': password,
        'email': email,
        'domanda': domanda,
        'risposta': risposta,
        'ips': [this.ipAddress]
      }
  
      try {
        this.spinnerService.show();
        this.httpLoginService.signin(player).subscribe({
          next: (result: boolean) => {
            if(result) {
              this.viewRegistrati = false;
              this.doRegistrati();
            }
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            if(error.status===401) {
              this.swalAlertError401();
            }
          },
          complete: () => {
            this.swalAlert('Successo!','Utente registrato con successo, adesso puoi fare il login','success');
            this.spinnerService.hide();
          }
        });
      } catch {
        this.swalAlert('Attenzione!','User e/o password non registrati, riprovare','warning');
      }
    } else {
      this.swalAlert('Attenzione!','Tutti i campi sono obbligatori','warning');
    }

  }

  recuperaCheck() {
    if(this.recuperaForm.valid) {
      const domanda = this.recuperaForm.value.domanda;
      const risposta = this.recuperaForm.value.risposta;
      if(this.player?.domanda===domanda && this.player?.risposta===risposta) {
        this.swalAlert('Recuperata!','La tua password è -->'+this.player?.pss+"<br> ma non dirla a nessuno <br><br>Copiala e salvala con cura",'success');
        this.doRecupera();
      } else {
        this.swalAlert('Attenzione!','La domanda o la risposta non combaciano, puoi chiamare Alessio per recuperare il tuo account','error');
      }
    } else {
      this.swalAlert('Attenzione!','Domanda e risposta sono obbligatori','warning');
    }
  }

  async recupera() {
    const user = this.recuperaForm.value.name;
    const email = this.recuperaForm.value.email;
    if(user || email) {
      try {
        this.spinnerService.show();
        this.httpLoginService.recupera(user,email).subscribe({
          next: (result) => {
            if(result.email === email || result.name === user) {
              this.player = result;
            }
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            if(error.status===402) {
              //devi far comparire la possibilita di registrarsi.
              this.swalAlert('Attenzione!','non ho trovato nulla con questo user o con questo email, probabilmente devi fare la registrazione','warning');
            }
          },
          complete: () => {
            this.spinnerService.hide();
            this.viewConfermaRecupero = true;
          }
        });
      } catch {
        this.swalAlert('Attenzione!','Qualcosa non va con il servizio recupera, chiama il programmatore','error');
      }
      finally {
        this.spinnerService.hide();
      }
    } else {
      this.swalAlert('Attenzione!','Almeno uno dei campi è obbligatorio','warning');
    }
  }

  doRegistrati() {
    this.viewSignIn=!this.viewSignIn;
    this.svuotaForm();
  }

  doRecupera() {
    this.viewRecupero=!this.viewRecupero;
    this.svuotaForm();
  }

  private getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }

  private svuotaForm() {
    //gestione login form
    this.loginForm.patchValue({
      name: '',
      password: ''
    });

    //gestione signin form
    this.signinForm.patchValue({
      name: '',
      password: '',
      email: '',
      domanda: '',
      risposta: ''
    });

    //gestione recupera form
    this.recuperaForm.patchValue({
      name: '',
      email: '',
      domanda: '',
      risposta: ''
    });
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

  private swalAlertError401() {
    Swal.fire({
      title: 'User presente!',
      text: 'password dimenticata, vuoi recuperarla?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
      icon: 'error'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.doRegistrati();
        this.doRecupera();
      }
    });
  }
}
