import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  @Input() updateSelectedRoles = new EventEmitter();
  user!: User;
  roles: any[] = [];
  //rolesObservableSubject$: Subject<any[]> = new Subject<any[]>();


  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  updateRoles() {
    //this.rolesObservableSubject$.next(this.roles)    
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();

  }

}
