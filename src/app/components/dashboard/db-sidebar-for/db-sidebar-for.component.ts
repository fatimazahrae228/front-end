import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-db-sidebar-for',
  imports: [ RouterLink , MatIconModule ],
  templateUrl: './db-sidebar-for.component.html',
  styleUrl: './db-sidebar-for.component.css'
})
export class DbSidebarForComponent {
  isSidebarCollapsed = true; // Gérer l'état du sidebar

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Alterner entre ouvert et fermé
  }
   constructor(private http: HttpClient, private router: Router) {}
  
    
  logout() {
    // Suppression des informations de l'utilisateur du localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Appel à l'API de déconnexion pour supprimer la session côté serveur
    this.http.post('http://localhost:8081/users/logout', {}).subscribe({
      next: (response : any) => {
        console.log('Déconnexion réussie');
        // Redirection vers la page de profil après la déconnexion
        this.router.navigate(['/accueil']);
      },
      error: (err: any) => {
        console.error('Erreur lors de la déconnexion', err);
      }
    });
  }
}
