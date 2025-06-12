import { CommonModule,} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component , AfterViewInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';

declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-planning',
  imports: [ CommonModule , FormsModule , DbSidebarForComponent , DbNavbarComponent, MatIconModule ] ,
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.css'
})
export class PlanningComponent implements OnInit {
  showModal = false;
  planning = {
    title: '',
    datetime: '',
    duration: 1,
    description: '',
    formateur: { id: null } // L'ID sera inséré automatiquement
  };
  plannings: any[] = [];
  formateurs: any[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFormateurs();
    this.setFormateurFromLocalStorage(); // Récupère l'ID du formateur connecté
    this.getPlannings(); // Charge les planifications de l'utilisateur connecté
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetPlanning();
  }

  // Récupère les formateurs depuis l'API
  getFormateurs() {
    this.http.get<any[]>('http://localhost:8081/api/formateurs').subscribe(data => {
      this.formateurs = data;
    });
  }

  // Récupère les planifications du formateur connecté
  getPlannings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const formateurId = user.id; // ID du formateur connecté
    if (formateurId) {
      this.http.get<any[]>(`http://localhost:8081/api/plannings/formateur/${formateurId}`)
        .subscribe(data => {
          this.plannings = data;
        });
    } else {
      console.error('Utilisateur non connecté');
    }
  }

  // Insère automatiquement l'ID du formateur dans le planning
  setFormateurFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.planning.formateur.id = user.id; // Assigne l'ID du formateur connecté
      } catch (e) {
        console.error('Erreur de parsing JSON:', e);
      }
    }
  }

  // Envoie du planning avec l'ID du formateur sélectionné
  submitPlanning() {
    const body = {
      ...this.planning,
      formateur: { id: this.planning.formateur.id }
    };

    this.http.post('http://localhost:8081/api/plannings', body).subscribe({
      next: () => {
        alert('Live planifié avec succès !');
        this.getPlannings(); // Recharge les planifications après ajout
      },
      error: () => alert('Erreur lors de la planification.') ,
    });
  }

  // Réinitialise les champs du formulaire
  resetPlanning() {
    this.planning = { title: '', datetime: '', duration: 1, description: '', formateur: { id: null } };
    this.message = '';
  }

  // Méthode pour supprimer une planification
  deletePlanning(planningId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette planification ?')) {
      this.http.delete(`http://localhost:8081/api/plannings/${planningId}`).subscribe({
        next: () => {
          // Supprimer localement la planification supprimée
          this.plannings = this.plannings.filter(p => p.id != planningId);
          alert('Planification supprimée avec succès.')
     
        },
        error: () => {
         alert('Erreur de supprimée la planification')
        },
        
       
      });
    }
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }  
 
}
