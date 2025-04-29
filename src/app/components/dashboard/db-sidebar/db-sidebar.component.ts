import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-db-sidebar',
  standalone: true,
  imports: [ RouterLink, MatIconModule],
  templateUrl: './db-sidebar.component.html',
  styleUrl: './db-sidebar.component.css'
})
export class DbSidebarComponent {
  isSidebarCollapsed = true; // Gérer l'état du sidebar

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Alterner entre ouvert et fermé
  }
  constructor(private http : HttpClient, private router: Router) {}

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
