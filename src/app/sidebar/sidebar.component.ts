import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

@Component({
  selector: 'sidebar-utenti',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  users: any;
  constructor(private socket: Socket) {

  }

  getUsersCall() {
    return this.socket.fromEvent('current_users').pipe(map((data: any) => data))
  }

  ngOnInit(): void {
    this.getUsersCall().subscribe(users => {
      this.users = users;
    })
  }

  closeSidebar() {
    this.close.emit();
  }

}
