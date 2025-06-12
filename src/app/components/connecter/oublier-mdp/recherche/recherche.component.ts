import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recherche',
  imports: [ RouterLink ],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.css'
})

  export class RechercheComponent {
   
    codeDigits: string[] = ['', '', '', '', '', ''];
 email: string = '';
  user: any;

  constructor(private http: HttpClient, private router: Router) {
  }
  

   ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
  console.log('storedEmail :', storedEmail);

  if (storedEmail) {
    this.email = storedEmail;
    console.log('Email récupéré:', this.email);

    // Si tu veux appeler l'API en te basant sur un ID, il faut une autre clé pour le stocker, ex:
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userParsed = JSON.parse(storedUser);
        const id = userParsed.id;
        this.http.get<any>(`http://localhost:8081/users/${id}`).subscribe(data => {
          console.log('Données utilisateur:', data);
          this.user = data;
          this.email = data.email; // met à jour l'email depuis la réponse API
        });
      } catch (e) {
        console.error("Erreur JSON lors de la lecture de l'utilisateur:", e);
      }
    }
  } else {
    console.warn('Aucun email trouvé dans localStorage');
  }}

  moveToNext(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    // Stocke la valeur
    this.codeDigits[index - 1] = value;

    if (value.length === 1 && index < 6) {
      const nextInput = input.parentElement.children[index];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  verifyCode(): void {
    const code = this.codeDigits.join('');

    if (code.length < 6 || !this.email) {
      alert("Veuillez entrer un code valide et votre email.");
      return;
    }

    const payload = {
      email: this.email,
      code: code
    };

    this.http.post<any>('http://localhost:8081/auth/verify-code', payload).subscribe({
      next: (res) => { 
         localStorage.setItem('code', code);
        alert(res.message || 'Code vérifié avec succès');
       
        this.router.navigate(['/reset-password']); // redirige vers la page de réinitialisation
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Échec de la vérification du code');
      }
    });
  }
  resendCode(event?: Event): void {
  if (event) event.preventDefault(); // empêche la page de se recharger

  if (!this.email) {
    alert("Adresse email introuvable. Veuillez réessayer.");
    return;
  }

  const payload = { email: this.email };

  this.http.post<any>('http://localhost:8081/auth/send-code', payload).subscribe({
    next: (res) => {
      alert(res.message || "Un nouveau code vous a été envoyé par e-mail.");
    },
    error: (err) => {
      console.error("Erreur lors du renvoi du code :", err);
      alert(err.error?.message || "Erreur lors du renvoi du code. Veuillez réessayer.");
    }
  });
  }
}
