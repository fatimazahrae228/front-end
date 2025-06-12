import { Component, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-reset-password',
  imports: [ FormsModule , MatIcon  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
 email: string = '';
  code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    const storedCode = localStorage.getItem('code');

    if (storedEmail) this.email = storedEmail;
    if (storedCode) this.code = storedCode;

    console.log('Email:', this.email);
    console.log('Code:', this.code);
  }

  resetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      alert('Veuillez remplir les deux champs de mot de passe.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const payload = {
      email: this.email,
      code: this.code,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.http.post<any>('http://localhost:8081/auth/reset-password', payload).subscribe({
      next: (res) => {
        this.message = res.message || 'Mot de passe réinitialisé avec succès';
        alert(this.message);
        localStorage.removeItem('email');
        localStorage.removeItem('code');
        this.router.navigate(['/connecter']);
      },
      error: (err) => {
        console.error('Erreur lors de la réinitialisation:', err);
        alert(err.error?.message || 'Erreur lors de la réinitialisation');
      }
    });
  }
 toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
