import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Player } from 'src/app/module/interface/player';
import Swal from 'sweetalert2';
import { LoginService } from '../../httpservices/login.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../../styles/login.css']
})
export class SigninComponent implements OnInit {

  signinForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    domanda: new FormControl('', Validators.required),
    risposta: new FormControl('', Validators.required)
  });

  questions = [
    "Cibo preferito?",
    "Nome della tua maestra dell'elementari?",
    "Nome del tuo animale preferito?",
    "Anno di nascita di un tuo genitore?",
    "Parola segreta?"
  ]

  constructor(private router: Router,
    private spinnerService: NgxSpinnerService,
    private loginService: LoginService,
    private messageService: MessageService) {
      
  }

  ngOnInit(): void {

  }

  returnLogin() {
    this.router.navigate(['/']);
  }

  async signin() {
    if(this.signinForm.valid) {
      const user = this.signinForm.value.name;
      const password = this.signinForm.value.password;
      const email = this.signinForm.value.email;
      const domanda = this.signinForm.value.domanda;
      const risposta = this.signinForm.value.risposta;

      const player:Player = {
        name: user!,
        pss: password!,
        email: email!,
        domanda: domanda!,
        risposta: risposta!
      };
  
      try {
        this.spinnerService.show();
        this.loginService.signin(player).subscribe({
          next: (result: boolean) => {
            if(result) {
              //this.viewRegistrati = false;
              this.svuotaForm();
            }
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            if(error.status===401) {
              this.alertError401();
            }
          },
          complete: () => {
            this.messageService.alert('Successo!','Utente registrato con successo, adesso puoi fare il login','success');
            this.spinnerService.hide();
          }
        });
      } catch {
        this.messageService.alert('Attenzione!','User e/o password non registrati, riprovare','warning');
      }
    } else {
      this.messageService.alert('Attenzione!','Tutti i campi sono obbligatori','warning');
    }

  }

  private svuotaForm() {
    this.signinForm.patchValue({
      name: '',
      password: '',
      email: '',
      domanda: '',
      risposta: ''
    });
  }

  private alertError401() {
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
        this.svuotaForm();
      }
    });
  }

}
