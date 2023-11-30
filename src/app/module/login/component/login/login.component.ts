import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { LoginService } from '../../httpservices/login.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../styles/login.css','./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('username') elementInputName?: ElementRef;

  showPassword = false;

  loginForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  viewActionButton = false;

  constructor(private router: Router,
    private loginService: LoginService,
    private spinnerService: NgxSpinnerService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService,
    private socket: Socket) {
      //this.socket.on('user_offline', () => this.updateUserStatus('offline'));
  }
  
  ngOnInit(): void {
    this.playerStateService.resetState();
  }

  async login() {
    if(this.loginForm.valid) {

  
      try {
        this.spinnerService.show();
        this.loginService.getIPAddress().subscribe((response: any) => {
          const user = this.loginForm.value.name!;
          const password = this.loginForm.value.password!;
          const ip = response['ip'];
          this.loginService.login(user,password,ip).subscribe({
            next: (result) => {
              if(result) {
                if(user!=="StarterDeck") {
                  this.socket.emit('sign_in', user);
                }
                this.router.navigate(['/home',{id:result._id}]);
              }
            },
            error: (error: any) => {
              this.spinnerService.hide();
              this.messageService.alert('Attenzione!','Utente e password errati o non ancora registrati','error');
              this.viewActionButton=true;
            },
            complete: () => {
              this.spinnerService.hide();
            }
          });
        });
        
      } catch {
        this.messageService.alert('Attenzione!','Qualcosa è andato storto durante la chiamata del servizio.','error');
      }
    } else {
      this.messageService.alert('Attenzione!','Username e password obbligatori','error');
    }
  }

  doRegistrati() {
    this.svuotaForm();
    this.router.navigate(['/signin']);
  }

  doRecupera() {
    this.router.navigate(['/recover']);
    this.svuotaForm();
  }

  showPss() {
    this.showPassword = !this.showPassword;
  }

  private svuotaForm() {
    this.loginForm.patchValue({
      name: '',
      password: ''
    });

  }
}
