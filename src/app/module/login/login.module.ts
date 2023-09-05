import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecoverComponent } from './component/recover/recover.component';
import { SigninComponent } from './component/signin/signin.component';
import { LoginRoutingModule } from './login-routing.module';
import { FortuneWheelComponent } from './component/fortune-wheel/fortune-wheel.component';
import { ZainoModule } from '../zaino/zaino.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://websocketio.onrender.com', options: {} };

@NgModule({
  declarations: [
    LoginComponent,
    RecoverComponent,
    SigninComponent,
    FortuneWheelComponent
  ],
  imports: [
    ZainoModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    SocketIoModule.forRoot(config)
  ]
})
export class LoginModule { }
