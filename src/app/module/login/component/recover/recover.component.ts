import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Player } from 'src/app/module/interface/player';
import { LoginService } from '../../httpservices/login.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['../../styles/login.css']
})
export class RecoverComponent implements OnInit {

  questions = [
    "Cibo preferito?",
    "Nome della tua maestra dell'elementari?",
    "Nome del tuo animale preferito?",
    "Anno di nascita di un tuo genitore?",
    "Parola segreta?"
  ]

  recuperaForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    domanda: new FormControl('', Validators.required),
    risposta: new FormControl('', Validators.required)
  });

  viewConfermaRecupero = false;

  player: Player | undefined;

  constructor(private router: Router,
    private spinnerService: NgxSpinnerService,
    private loginService: LoginService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  returnLogin() {
    this.router.navigate(['/']);
  }

  recupera() {
    const user = this.recuperaForm.value.name;
    const email = this.recuperaForm.value.email;
    if(user || email) {
      try {
        this.spinnerService.show();
        this.loginService.recupera(user,email).subscribe({
          next: (result) => {
            if(result.email === email || result.name === user) {
              this.player = result;
            }
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            if(error.status===402) {
              //devi far comparire la possibilita di registrarsi.
              this.messageService.alert('Attenzione!','non ho trovato nulla con questo user o con questo email, probabilmente devi fare la registrazione','warning');
            }
          },
          complete: () => {
            this.spinnerService.hide();
            this.viewConfermaRecupero = true;
          }
        });
      } catch {
        this.messageService.alert('Attenzione!','Qualcosa non va con il servizio recupera, chiama il programmatore','error');
      }
      finally {
        this.spinnerService.hide();
      }
    } else {
      this.messageService.alert('Attenzione!','Almeno uno dei campi è obbligatorio','warning');
    }
  }

  recuperaCheck() {
    if(this.recuperaForm.valid) {
      const domanda = this.recuperaForm.value.domanda;
      const risposta = this.recuperaForm.value.risposta;
      if(this.player?.domanda===domanda && this.player?.risposta===risposta) {
        this.messageService.alert('Recuperata!','La tua password è -->'+this.player?.pss+"<br> ma non dirla a nessuno <br><br>Copiala e salvala con cura",'success');
        this.svuotaForm();
      } else {
        this.messageService.alert('Attenzione!','La domanda o la risposta non combaciano, puoi chiamare Alessio per recuperare il tuo account','error');
      }
    } else {
      this.messageService.alert('Attenzione!','Domanda e risposta sono obbligatori','warning');
    }
  }

  private svuotaForm() {
    this.recuperaForm.patchValue({
      name: '',
      email: '',
      domanda: '',
      risposta: ''
    });
  }

}
