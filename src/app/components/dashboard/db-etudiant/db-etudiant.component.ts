import { Component } from '@angular/core';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';

@Component({
  selector: 'app-db-etudiant',
  imports: [ DbNavbarComponent , DbSidebarEtuComponent],
  templateUrl: './db-etudiant.component.html',
  styleUrl: './db-etudiant.component.css'
})
export class DbEtudiantComponent {

}
