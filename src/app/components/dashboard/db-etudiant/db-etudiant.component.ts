import { Component } from '@angular/core';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-db-etudiant',
  imports: [ DbNavbarComponent , DbSidebarEtuComponent ],
  templateUrl: './db-etudiant.component.html',
  styleUrl: './db-etudiant.component.css'
})
export class DbEtudiantComponent {
user = {
    id:'',
    nom: '',
    prenom: '',
    etat: '',
    numTelephone: '',
    email: '',
    photoUrl: '', 
  };
  constructor(private http: HttpClient) {}
 ngOnInit(): void {
  const storedUser = localStorage.getItem('user');
  console.log('storedUser:', storedUser); // pour debug

  if (storedUser) {
    try {
      const id = JSON.parse(storedUser).id;
      console.log('ID extrait:', id);
 
      this.http.get<any>(`http://localhost:8081/users/${id}`)
        .subscribe(data => {
          console.log('Données récupérées:', data);
          this.user = data;
          localStorage.setItem('user', JSON.stringify(data));

        });
    } catch (e) {
      console.error("Erreur de parsing JSON:", e);
    }
}
}}

