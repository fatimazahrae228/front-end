import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { DbSidebarComponent } from '../dashboard/db-sidebar/db-sidebar.component';
import { DbNavbarComponent } from '../dashboard/db-navbar/db-navbar.component';


@Component({
  selector: 'app-admin',
  imports: [MatIconModule, CommonModule, FormsModule, DbSidebarComponent , DbNavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  adminArray: any[] = [];
    isResultLoaded = false;
    isUpdateFormActive = false;
    showModal = false;
   modeEdition = true;
  
    // Variables du formateur
    admin = {
      id: null,
      nom: '',
      prenom: '',
      email: '',
      numTelephone: '',
      motsPasse : ''
    };
  
    constructor(private http: HttpClient) {}
  
    ngOnInit(): void {
      this.getAllAdmins();
    }
  
    // 🔹 Récupérer tous les admins
    getAllAdmins() {
      this.http.get("http://localhost:8081/api/admins")
        .subscribe((res: any) => {
          this.isResultLoaded = true;
          this.adminArray = res;
        }, error => {
          console.error("Erreur lors du chargement des admins", error);
        });
    }
  
    // 🔹 Ajouter ou mettre à jour un admin
    save() {
      if (!this.admin.nom || !this.admin.prenom || !this.admin.email || !this.admin.numTelephone || !this.admin.motsPasse) {
        alert("Tous les champs sont obligatoires !");
        return;
      }
  
      if (this.admin.id) {
        this.updateAdmin();
      } else {
        this.registerAdmin();
      }
    }
  
    // 🔹 Enregistrer un nouveau admin
    registerAdmin() {
      this.http.post("http://localhost:8081/api/admins", this.admin)
        .subscribe(() => {
          alert("admin inscrit avec succès !");
          this.getAllAdmins();
          this.resetForm();
        }, error => {
          console.error("Erreur lors de l'inscription", error);
        });
    }
  
    // 🔹 Mettre à jour un admin
    updateAdmin() {
      this.http.put(`http://localhost:8081/api/admins/${this.admin.id}`, this.admin)
        .subscribe(() => {
          alert("Mise à jour réussie !");
          this.getAllAdmins();
          this.resetForm();
          this.closeModal();
        }, error => {
          console.error("Erreur lors de la mise à jour", error);
        });
    }
  
    // 🔹 Sélectionner un formateur pour modification
    setUpdate(data: any) {
      this.admin = { ...data };
      this.modeEdition = true;
      this.showModal = true;
    }
  
    // 🔹 Supprimer un admin
    setDelete(id: number) {
      if (confirm("Voulez-vous vraiment supprimer ce admin ?")) {
        this.http.delete(`http://localhost:8081/api/admins/${id}`)
          .subscribe(() => {
            alert("Admin supprimé !");
            this.getAllAdmins();
          }, error => {
            console.error("Erreur lors de la suppression", error);
          });
      }
    }
  
    // 🔹 Réinitialiser le formulaire
    resetForm() {
      this.admin = { id: null, nom: '', prenom: '', email: '', numTelephone: '' , motsPasse: '' };
    }
    openModal() {
      this.showModal = true;
    }
  
    closeModal() {
      this.showModal = false;
      this.resetForm();
    }
}
