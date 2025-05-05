import { Component } from '@angular/core';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { HttpClient } from '@angular/common/http';
import AgoraRTC from 'agora-rtc-sdk';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paiement',
  imports: [ CommonModule , FormsModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent {
  paiement = {
    nom: '',
    numeroCarte: '',
    expiration: '',
    cvv: ''
  };

  message = '';

  validerPaiement() {
    // Logique réelle à connecter à une API ou service de paiement
    console.log('Paiement en cours :', this.paiement);
    this.message = 'Paiement effectué avec succès !';
  }
}