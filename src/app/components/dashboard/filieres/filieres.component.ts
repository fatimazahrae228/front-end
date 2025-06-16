import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DbNavbarComponent } from '../../dashboard/db-navbar/db-navbar.component';
import { DbSidebarComponent } from '../../dashboard/db-sidebar/db-sidebar.component';
import { DbSidebarForComponent } from '../../dashboard/db-sidebar-for/db-sidebar-for.component';

@Component({
  selector: 'app-filieres',
  standalone: true,
  imports: [MatIconModule, CommonModule, DbNavbarComponent, FormsModule, DbSidebarComponent, DbSidebarForComponent],
  templateUrl: './filieres.component.html',
  styleUrls: ['./filieres.component.css']
})
export class FilieresComponent implements OnInit {
  filiereArray: any[] = [];
  isResultLoaded = false;
  showModal = false;
  modeEdition = true;
  filiere = {
    id: null,
    nom: '',
    description: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllFiliere();
  }

  // 🔹 Récupérer toutes les filières
  getAllFiliere() {
    this.http.get("http://localhost:8081/api/filiere")
      .subscribe((res: any) => {
        this.isResultLoaded = true;
        this.filiereArray = res;
      }, error => {
        console.error("Erreur lors du chargement des filières", error);
      });
  }

  // 🔹 Ajouter ou mettre à jour une filière
  save() {
    if (!this.filiere.nom || !this.filiere.description) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    if (this.filiere.id) {
      this.updateFiliere();
    } else {
      this.registerFiliere();
    }
  }

  // 🔹 Enregistrer une nouvelle filière
  registerFiliere() {
    this.http.post("http://localhost:8081/api/filiere", this.filiere)
      .subscribe(() => {
        alert("Filière ajoutée avec succès !");
        this.getAllFiliere();
        this.resetForm();
      }, error => {
        console.error("Erreur lors de l'ajout de la filière", error);
      });
  }

  // 🔹 Mettre à jour une filière
  updateFiliere() {
    this.http.put(`http://localhost:8081/api/filiere/${this.filiere.id}`, this.filiere)
      .subscribe(() => {
        alert("Mise à jour réussie !");
        this.getAllFiliere();
        this.resetForm();
        this.closeModal();
      }, error => {
        console.error("Erreur lors de la mise à jour de la filière", error);
      });
  }

  // 🔹 Sélectionner une filière pour modification
  setUpdate(data: any) {
    this.filiere = { ...data };
    this.modeEdition = true;
    this.showModal = true;
  }

  // 🔹 Supprimer une filière
  setDelete(id: number) {
    if (confirm("Voulez-vous vraiment supprimer cette filière ?")) {
      this.http.delete(`http://localhost:8081/api/filiere/${id}`)
        .subscribe(() => {
          alert("Filière supprimée !");
          this.getAllFiliere();
        }, error => {
          console.error("Erreur lors de la suppression de la filière", error);
        });
    }
  }

  // 🔹 Réinitialiser le formulaire
  resetForm() {
    this.filiere = { id: null, nom: '', description: '' };
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }
}
