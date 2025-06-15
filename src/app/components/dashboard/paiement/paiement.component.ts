import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { environment } from '../../environments/environment';
import { loadScript, PayPalScriptOptions } from '@paypal/paypal-js';

interface Cours {
  id: number;
  titre: string;
  filiere: string;
  niveau: string;
  type: 'Gratuit' | 'Payant';
  documentType?: string;
  prix?: number;
  fichierNom?: string;
  isPaid?: boolean;
  pdfUrlView?: string;
  pdfUrlDownload?: string;
}

interface PayPalButtonConfig {
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onError?: (err: any) => void;
}

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DbNavbarComponent,
    MatIcon,
    DbSidebarForComponent,
    RouterOutlet,
    DbSidebarComponent,
    DbSidebarEtuComponent
  ],
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent implements OnInit {
  coursPayants: Cours[] = [];
  coursFiltresAppliques: Cours[] = [];
  user: any = {};
  paymentProcessing = false;
  selectedCourseId: number | null = null;
  private readonly API_URL = environment.apiUrl;

  rechercheCours = {
    titre: '',
    filiere: '',
    niveau: '',
    type: '',
    documentType: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
    }
    this.getCoursPayants();
    this.loadPaypalScript();
  }

  getCoursPayants() {
    this.http.get<Cours[]>(`${this.API_URL}/api/cours`)
      .subscribe({
        next: data => {
          this.coursPayants = data.filter(c => c.type === 'Payant');
          this.coursFiltresAppliques = [...this.coursPayants];
          this.coursPayants.forEach(cours => {
            cours.pdfUrlView = `${this.API_URL}/api/cours/view/${cours.fichierNom}`;
            cours.pdfUrlDownload = `${this.API_URL}/api/cours/download/${cours.fichierNom}`;
            this.checkIfPaid(cours);
          });
        },
        error: err => console.error('Erreur chargement cours:', err)
      });
  }

  checkIfPaid(cours: Cours) {
    const userId = this.user.id;
    this.http.get<boolean>(`${this.API_URL}/api/payments/check?userId=${userId}&courseId=${cours.id}`)
      .subscribe({
        next: isPaid => cours.isPaid = isPaid,
        error: err => console.error('Erreur vérification paiement:', err)
      });
  }

  

  appliquerFiltre(): void {
    this.coursFiltresAppliques = this.coursPayants.filter((cours: Cours) => {
      return (
        (!this.rechercheCours.titre || 
         cours.titre.toLowerCase().includes(this.rechercheCours.titre.toLowerCase())) &&
        (!this.rechercheCours.filiere || 
         cours.filiere === this.rechercheCours.filiere) &&
        (!this.rechercheCours.niveau || 
         cours.niveau === this.rechercheCours.niveau) &&
        (!this.rechercheCours.type || 
         cours.type === this.rechercheCours.type) &&
        (!this.rechercheCours.documentType || 
         (cours.documentType === this.rechercheCours.documentType))
      );
    });
  }

  loadPaypalScript() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => console.log('PayPal SDK chargé');
    script.onerror = () => console.error('Erreur chargement PayPal SDK');
    document.body.appendChild(script);
  }

  async initierPaiement(cours: Cours) {
    if (cours.isPaid || this.paymentProcessing) return;

    try {
      const paypalOptions: PayPalScriptOptions = {
        clientId: environment.paypalClientId,
        currency: 'USD'
      };

      const paypal = await loadScript(paypalOptions);

      if (paypal?.Buttons) {
        const containerId = `paypal-button-${cours.id}`;
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';

        const buttonConfig: PayPalButtonConfig = {
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: this.convertDhToUsdNumber(cours.prix || 0),
                  currency_code: 'USD'
                },
                description: `Paiement pour le cours: ${cours.titre}`
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              this.processPayment(cours);
              return details;
            } catch (err) {
              console.error('Erreur capture paiement:', err);
              throw err;
            }
          },
          onError: (err: any) => {
            console.error('Erreur PayPal:', err);
            alert('Erreur lors du processus de paiement');
          }
        };

        paypal.Buttons(buttonConfig).render(`#${containerId}`);
      }
    } catch (error) {
      console.error('Erreur initialisation PayPal:', error);
    }
  }

  processPayment(cours: Cours) {
    this.paymentProcessing = true;
    this.selectedCourseId = cours.id;

    const paymentData = {
      userId: this.user.id,
      courseId: cours.id,
      amount: cours.prix,
      paymentDate: new Date().toISOString()
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post(`${this.API_URL}/api/payments`, paymentData, { headers })
      .subscribe({
        next: () => {
          cours.isPaid = true;
          this.paymentProcessing = false;
          this.selectedCourseId = null;
          alert('Paiement effectué avec succès!');
        },
        error: (err) => {
          this.paymentProcessing = false;
          this.selectedCourseId = null;
          console.error('Erreur enregistrement paiement:', err);
          alert('Erreur lors du paiement. Veuillez réessayer.');
        }
      });
  }

  private convertDhToUsdNumber(montantDh: number): string {
  // Vérification que le montant est valide
  if (!montantDh || montantDh <= 0) {
    console.error('Montant invalide:', montantDh);
    return '10.00'; // Valeur par défaut sécurisée
  }
  return (montantDh / 10).toFixed(2);
}
ouvrirPdf(url: string | undefined) {
  if (!url) return;
  window.open(url, '_blank');
}
public convertDhToUsd(montantDh: number | undefined): string {
  if (montantDh === undefined) return 'N/A USD';
  return (montantDh / 10).toFixed(2) + ' USD';
}

telechargerPdf(url: string | undefined) {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = url.split('/').pop() || 'cours.pdf';
  link.click();
}
}