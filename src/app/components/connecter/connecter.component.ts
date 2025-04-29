import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms'; 
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-connecter',
  standalone: true, 
  imports: [ RouterLink, FormsModule , ReactiveFormsModule, HttpClientModule],
  templateUrl: './connecter.component.html',
  styleUrl: './connecter.component.css'
})

export class ConnecterComponent {
  data = new FormGroup({
    email: new FormControl(''),
    motspasse: new FormControl('')
  });

  constructor(private httpClient: HttpClient, private router: Router) {}

  public handleSubmit() {
    console.log(this.data.value);

    this.httpClient.post('http://localhost:8081/users/login', this.data.value)
      .subscribe((response: any) => {
        console.log(response);

        if (response.success && response.role  && response.user) {
          alert(`Connexion réussie en tant que ${response.role}`);

          // Enregistrer l'utilisateur dans le localStorage
          localStorage.setItem('user', JSON.stringify(response.user));

          // Redirection selon le rôle
          switch (response.role) {
            case 'admin':
              this.router.navigate(['/db-admin']);
              break;
            case 'formateur':
              this.router.navigate(['/db-formateur']);
              break;
            case 'etudiant':
              this.router.navigate(['/db-etudiant']);
              break;
            default:
              alert("Rôle inconnu !");
          }
        } else {
          alert("Identifiants erronés. Veuillez réessayer.");
        }
      }, error => {
        console.error("Erreur lors de la connexion:", error);
        alert("Une erreur s'est produite. Vérifie ton backend.");
      });
  }
}