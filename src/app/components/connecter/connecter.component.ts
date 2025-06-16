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
  const { email, motspasse } = this.data.value;

  // تحقق محلي قبل الإرسال
  if (email === 'fatimazahraeel28@gmail.com' && motspasse === '123456') {
    alert("Connexion réussie en tant qu'admin");

    // Simuler utilisateur admin
    const user = { email, nom: 'Fatima Zahrae', role: 'admin' };

    // تخزين المستخدم في localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // إعادة التوجيه مباشرة لصفحة الادمن
    this.router.navigate(['/db-admin']);
    return; // نوقف هنا لأننا أرسلنا التوجيه محلياً
  }

  // إذا ماكانش هو الحساب الخاص، نستعمل طلب الـ backend الطبيعي
  this.httpClient.post('http://localhost:8081/users/login', this.data.value)
    .subscribe((response: any) => {
      if (response.success && response.role && response.user) {
        alert(`Connexion réussie en tant que ${response.role}`);

        localStorage.setItem('user', JSON.stringify(response.user));

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