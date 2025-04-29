import { Component, OnInit } from '@angular/core';
import { DbSidebarComponent } from "../dashboard/db-sidebar/db-sidebar.component";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Importer HttpClient ici
import { Observable } from 'rxjs'; // Pour gérer les Observables
import { CommonModule } from '@angular/common';
import { DbNavbarComponent } from '../dashboard/db-navbar/db-navbar.component';
import { DbSidebarForComponent } from '../dashboard/db-sidebar-for/db-sidebar-for.component';

@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [  MatIconModule , CommonModule , DbNavbarComponent, FormsModule , DbSidebarComponent , DbSidebarForComponent ],
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit{
  etudiantArray: any[] = [];
   isResultLoaded = false;
   isUpdateFormActive = false;
   showModal = false;
   modeEdition = true;
   user = {
    id:'',
    nom: '',
    prenom: '',
    etat: '',
    numTelephone: '',
    email: '',
    photoUrl: 'assets/user-profile.jpg',
  };
 
   // Variables du etudiant
   etudiant = {
     id: null,
     nom: '',
     prenom: '',
     email: '',
     numTelephone: '',
     motsPasse : ''
   };
 
   constructor(private http: HttpClient) {}
 
   ngOnInit(): void {
     this.getAllEtudiants();
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
   
 
   // 🔹 Récupérer tous les etudiants
   getAllEtudiants() {
     this.http.get("http://localhost:8081/api/etudiants")
       .subscribe((res: any) => {
         this.isResultLoaded = true;
         this.etudiantArray = res;
       }, error => {
         console.error("Erreur lors du chargement des etudiants", error);
       });
   }
 
   // 🔹 Ajouter ou mettre à jour un etudiant
   save() {
     if (!this.etudiant.nom || !this.etudiant.prenom || !this.etudiant.email || !this.etudiant.numTelephone || !this.etudiant.motsPasse) {
       alert("Tous les champs sont obligatoires !");
       return;
     }
 
     if (this.etudiant.id) {
       this.updateEtudiant();
     } else {
       this.registerEtudiant();
     }
   }
 
   // 🔹 Enregistrer un nouveau formateur
   registerEtudiant() {
     this.http.post("http://localhost:8081/api/etudiants", this.etudiant)
       .subscribe(() => {
         alert("Etudiant inscrit avec succès !");
         this.getAllEtudiants();
         this.resetForm();
       }, error => {
         console.error("Erreur lors de l'inscription", error);
       });
   }
 
   // 🔹 Mettre à jour un formateur
   updateEtudiant() {
     this.http.put(`http://localhost:8081/api/etudiants/${this.etudiant.id}`, this.etudiant)
       .subscribe(() => {
         alert("Mise à jour réussie !");
         this.getAllEtudiants();
         this.resetForm();
         this.closeModal();
       }, error => {
         console.error("Erreur lors de la mise à jour", error);
       });
   }
 
   // 🔹 Sélectionner un etudiant pour modification
   setUpdate(data: any) {
     this.etudiant = { ...data };
     this.modeEdition = true;
  this.showModal = true;
   }
 
   // 🔹 Supprimer un etudiant
   setDelete(id: number) {
     if (confirm("Voulez-vous vraiment supprimer ce etudiant ?")) {
       this.http.delete(`http://localhost:8081/api/etudiants/${id}`)
         .subscribe(() => {
           alert("Etudiant supprimé !");
           this.getAllEtudiants();
         }, error => {
           console.error("Erreur lors de la suppression", error);
         });
     }
   }
 
   // 🔹 Réinitialiser le etudiant
   resetForm() {
     this.etudiant = { id: null, nom: '', prenom: '', email: '', numTelephone: '' , motsPasse: '' };
   }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  
}