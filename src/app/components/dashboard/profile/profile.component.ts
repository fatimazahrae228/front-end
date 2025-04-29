import { Component , OnInit } from '@angular/core';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';


@Component({
  selector: 'app-profile',
  imports: [ DbNavbarComponent, NgIf , FormsModule , DbSidebarEtuComponent , DbSidebarComponent , DbSidebarForComponent],
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
    photoUrl: 'assets/user-profile.jpg',
  };
  
  photoPreview: string | null = null;
  photoFile: File | null = null;
  showPasswordForm = false;

  oldPassword = '';
  newPassword = '';

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
          });
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
      }
    } else {
      console.warn('Aucun utilisateur dans le localStorage');
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
  
      // Envoie la photo au backend
      this.http.post<any>('http://localhost:8081/users/' + this.user.id + '/upload-photo', formData)
        .subscribe(
          (response: any) => {
            console.log('Réponse du serveur:', response); // Pour déboguer et vérifier la réponse
            
            if (response.success) {
              // Mise à jour de la photo de l'utilisateur dans le frontend
              this.user.photoUrl = 'http://localhost:8081/users/uploads/' + response.photo; // Adapte le chemin si nécessaire
              alert('Photo mise à jour avec succès');
            } else {
              alert('Erreur lors de la mise à jour de la photo: ' + response.message);
            }
  
            // Réinitialise le fichier et l'aperçu de la photo
            this.photoFile = null;
            this.photoPreview = null;
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
          this.user.photoUrl = 'assets/user-profile.jpg'; // Remet l'image par défaut
          console.log('Photo supprimée avec succès');
        },
        error => {
          console.error('Erreur lors de la suppression de la photo', error);
        }
      );
  }

  updatePassword(): void {
    const userId = 63; // Exemple d'ID de l'utilisateur
    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };
    interface ResponseMessage {
      message: string;
    }
    // Spécifie que la réponse attendue est de type ResponseMessage
    this.http.post<ResponseMessage>(`http://localhost:8081/users/${userId}/update-password`, payload)
      .subscribe({
        next: (response) => {
          alert(response.message);  // Affiche le message de succès retourné par le backend
          this.showPasswordForm = false;
          this.oldPassword = '';
          this.newPassword = '';
        },
        error: (err) => {
          console.error('Erreur backend complète :', err);
          const message = err.error?.message || 'Une erreur est survenue';
          alert('Erreur : ' + message);
        }
      });
}
  }