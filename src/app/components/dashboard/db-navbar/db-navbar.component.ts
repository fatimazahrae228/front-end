
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-db-navbar',
  imports: [ MatIconModule , RouterLink ],
  templateUrl: './db-navbar.component.html',
  styleUrl: './db-navbar.component.css'
})
export class DbNavbarComponent implements OnInit{
   user = {
    id:'',
    nom: '',
    prenom: '',
    etat: '',
    numTelephone: '',
    email: '',
    photoUrl: '', 
  };
  profilePhotoUrl: string = '';
constructor(private http: HttpClient) {}  // 'http' est défini ici
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

          // Ici, on définit l'URL complète après réception des données
          if (this.user.photoUrl) {
            this.profilePhotoUrl = `http://localhost:8081/users/${this.user.id}/photo`;
          } else {
            this.profilePhotoUrl = 'assets/user-profile.jpg'; // image par défaut locale
          }
        });
    } catch (e) {
      console.error("Erreur de parsing JSON:", e);
    }
  } else {
    console.warn('Aucun utilisateur dans le localStorage');
    this.profilePhotoUrl = 'assets/user-profile.jpg'; // image par défaut si pas d'utilisateur
  }
}

}