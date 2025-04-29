import { Component } from '@angular/core';
import { DbSidebarComponent } from "../dashboard/db-sidebar/db-sidebar.component";
import { DbNavbarComponent } from '../dashboard/db-navbar/db-navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Importer HttpClient ici
import { Observable } from 'rxjs'; // Pour gérer les Observables
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-formateur',
  imports: [MatIconModule, CommonModule, FormsModule, DbSidebarComponent , DbNavbarComponent ],
  templateUrl: './formateur.component.html',
  styleUrl: './formateur.component.css'
})
export class FormateurComponent {
  formateurArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  showModal = false;
  modeEdition = true;

  // Variables du formateur
  formateur = {
    id: null,
    nom: '',
    prenom: '',
    email: '',
    numTelephone: '',
    motsPasse : ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllFormateurs();
  }

  // 🔹 Récupérer tous les formateurs
  getAllFormateurs() {
    this.http.get("http://localhost:8081/api/formateurs")
      .subscribe((res: any) => {
        this.isResultLoaded = true;
        this.formateurArray = res;
      }, error => {
        console.error("Erreur lors du chargement des formateurs", error);
      });
  }

  // 🔹 Ajouter ou mettre à jour un formateur
  save() {
    if (!this.formateur.nom || !this.formateur.prenom || !this.formateur.email || !this.formateur.numTelephone || !this.formateur.motsPasse) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    if (this.formateur.id) {
      this.updateFormateur();
    } else {
      this.registerFormateur();
    }
  }

  // 🔹 Enregistrer un nouveau formateur
  registerFormateur() {
    this.http.post("http://localhost:8081/api/formateurs", this.formateur)
      .subscribe(() => {
        alert("Formateur inscrit avec succès !");
        this.getAllFormateurs();
        this.resetForm();
      }, error => {
        console.error("Erreur lors de l'inscription", error);
      });
  }

  // 🔹 Mettre à jour un formateur
  updateFormateur() {
    this.http.put(`http://localhost:8081/api/formateurs/${this.formateur.id}`, this.formateur)
      .subscribe(() => {
        alert("Mise à jour réussie !");
        this.getAllFormateurs();
        this.resetForm();
        this.closeModal();
      }, error => {
        console.error("Erreur lors de la mise à jour", error);
      });
  }

  // 🔹 Sélectionner un formateur pour modification
  setUpdate(data: any) {
    this.formateur = { ...data };
    this.modeEdition = true;
  this.showModal = true;
  }

  // 🔹 Supprimer un formateur
  setDelete(id: number) {
    if (confirm("Voulez-vous vraiment supprimer ce formateur ?")) {
      this.http.delete(`http://localhost:8081/api/formateurs/${id}`)
        .subscribe(() => {
          alert("Formateur supprimé !");
          this.getAllFormateurs();
        }, error => {
          console.error("Erreur lors de la suppression", error);
        });
    }
  }

  // 🔹 Réinitialiser le formulaire
  resetForm() {
    this.formateur = { id: null, nom: '', prenom: '', email: '', numTelephone: '' , motsPasse: '' };
  }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }
 }