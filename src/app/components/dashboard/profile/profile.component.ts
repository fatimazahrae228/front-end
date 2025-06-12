import { Component , OnInit } from '@angular/core';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-profile',
  imports: [ DbNavbarComponent, NgIf , FormsModule , DbSidebarEtuComponent , DbSidebarComponent , DbSidebarForComponent , MatIcon ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  
})
export class ProfileComponent  implements OnInit {
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
  photoPreview: string | null = null;
  photoFile: File | null = null;
  showPasswordForm = false;
email: string = '';
  code: string = '';

  confirmPassword: string = '';
 codeDigits: string ='';
show= true;
  showPassword = false;
  showConfirmPassword = false;

  message = '';
  codeError = '';

  oldPassword = '';
  newPassword = '';
 

   constructor(private http: HttpClient, private router: Router) {}
  
 
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
 const storedEmail = JSON.parse(storedUser).email;
    if (storedEmail){this.email = storedEmail;
    } 
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


  onPhotoSelectionnee(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photoFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.photoFile);
      
    }
  }

  uploadPhoto(): void {
  if (this.photoFile) {
    const formData = new FormData();
    formData.append('photo', this.photoFile, this.photoFile.name);

    this.http.post<any>('http://localhost:8081/users/' + this.user.id + '/upload-photo', formData)
      .subscribe(
        (response: any) => {
          console.log('Réponse du serveur:', response);

          if (response.success) {
        this.user.photoUrl = 'http://localhost:8081/uploads/' + response.photo;
            localStorage.setItem('user', JSON.stringify(this.user));
            console.log('photoUrl final =', this.user.photoUrl);
            alert('Photo mise à jour avec succès');
          } else {
            alert('Erreur lors de la mise à jour de la photo: ' + response.message);
          }
        },
        (error: any) => {
          console.error('Erreur lors de l\'upload de la photo:', error);
          alert('Une erreur est survenue lors de l\'upload de la photo');
        }
      );
  } else {
    alert('Aucune photo sélectionnée');
  }
}

  annulerPhoto(): void {
    this.photoPreview = null;
    this.photoFile = null;
  }

  supprimerPhoto(): void {
    this.http.delete(`http://localhost:8081/users/${this.user.id}/delete-photo`)  // Remplace {id} par this.user.id
      .subscribe(
        () => {
       
                    alert('Photo supprimée avec succès');
        },
        error => {
          console.error('Erreur lors de la suppression de la photo', error);
        }
      );
  }

  
startPasswordReset(): void {
  this.showPasswordForm = true;
  this.show=false;
  this.sendCode();
}

sendCode(): void {
  if (!this.email) {
    alert('Email introuvable.');
    return;
  }

  const payload = { email: this.email };

  this.http.post<any>('http://localhost:8081/auth/send-code', payload).subscribe({
    next: (res) => {
      console.log("Réponse succès :", res);
      alert(res.message || 'Code envoyé');
    },
    error: (err) => {
      console.log("Réponse erreur :", err);
      alert(err.error?.message || 'Erreur lors de l\'envoi du code');
    }
  });
}

resetPassword(): void {
  console.log("code digits est :",this.codeDigits);
  if (!this.codeDigits || this.codeDigits.length < 6) {
    alert("Veuillez entrer un code de vérification valide.");
    return;
  }

  if (!this.newPassword || !this.confirmPassword) {
    alert('Veuillez remplir les deux champs de mot de passe.');
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    alert('Les mots de passe ne correspondent pas.');
    return;
  }

  if (!this.email) {
    alert("Email introuvable.");
    return;
  }

  // Étape 1 : Vérifier le code
  const verifyPayload = {
    email: this.email,
    code: this.codeDigits
  };

  this.http.post<any>('http://localhost:8081/auth/verify-code', verifyPayload).subscribe({
    next: (res) => {
      console.log("✅ Code vérifié :", res);

      // Étape 2 : Réinitialiser le mot de passe après vérification réussie
      const resetPayload = {
        email: this.email,
        code: this.codeDigits,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      };

      this.http.post<any>('http://localhost:8081/auth/reset-password', resetPayload).subscribe({
        next: (res) => {
          this.message = res.message || 'Mot de passe réinitialisé avec succès';
          alert(this.message);
          this.showPasswordForm = false;
          this.codeDigits = '';
          this.newPassword = '';
          this.confirmPassword = '';
          localStorage.removeItem('email');
          this.show=true;
        },
        error: (err) => {
          console.error("Erreur reset:", err);
          alert(err.error?.message || 'Erreur lors de la réinitialisation');
        }
      });

    },
    error: (err) => {
      console.error("Code incorrect:", err);
      alert(err.error?.message || 'Code de vérification invalide');
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