import { Component, NgModule  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';



@Component({
  selector: 'app-oublier-mdp',
  imports: [ RouterLink , FormsModule ],
  templateUrl: './oublier-mdp.component.html',
  styleUrl: './oublier-mdp.component.css'
})
export class OublierMdpComponent {
  
  email: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}



  sendCode(): void {
    if (!this.email) {
      alert('Veuillez entrer un email.');
      return;
    }

    const payload = { email: this.email };

    this.http.post<any>('http://localhost:8081/auth/send-code', payload).subscribe({
      next: (res) => {
        // On stocke l'email pour les prochaines étapes
        localStorage.setItem('email', this.email);
        alert(res.message || 'Code envoyé avec succès');
        this.router.navigate(['/recherche']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du code:', err);
        alert(err.error?.message || 'Erreur lors de l\'envoi du code');
      }
    });
  }

}