import { Component } from '@angular/core';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';


@Component({
  selector: 'app-db-formateur',
  imports: [ DbNavbarComponent , DbSidebarForComponent ],
  templateUrl: './db-formateur.component.html',
  styleUrl: './db-formateur.component.css'
})
export class DbFormateurComponent {
  
  }
