import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { MatIcon } from '@angular/material/icon';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';
import { loadScript } from '@paypal/paypal-js';
import { environment } from '../../environments/environment';

import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


// Assurez-vous d'avoir :

// Déclaration des types PayPal manquants
// Déclaration des types PayPal
interface PayPalButtons {
  render(container: string): void;
}

interface PayPal {
  Buttons(options: {
    createOrder(data: any, actions: any): Promise<string>;
    onApprove(data: any, actions: any): Promise<void>;
    onError(err: Error): void;
  }): PayPalButtons;
}

interface PayPal {
  Buttons(options: {
    createOrder(data: any, actions: any): Promise<string>;
    onApprove(data: any, actions: any): Promise<void>;
    onError(err: Error): void;
  }): PayPalButtons;
}



declare const paypal: {
  Buttons: (options: {
    style?: {
      layout?: 'vertical' | 'horizontal';
      color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
      shape?: 'rect' | 'pill';
      label?: 'paypal' | 'checkout' | 'pay' | 'buynow';
    };
    createOrder: (data: unknown, actions: {
      order: {
        create: (orderRequest: {
          intent: 'CAPTURE' | 'AUTHORIZE';
          purchase_units: Array<{
            amount: {
              value: string;
              currency_code: string;
            };
            description?: string;
          }>;
        }) => Promise<string>;
      };
    }) => Promise<string>;
    onApprove: (data: { orderID: string }, actions: {
      order: {
        capture: () => Promise<{
          id: string;
          status: string;
        }>;
      };
    }) => Promise<void>;
    onError: (err: Error) => void;
    onCancel?: (data: { orderID: string }) => void;
  }) => {
    render: (selector: string) => void;
  };
};
@Component({
  selector: 'app-cours1',
  standalone: true,
  imports: [MatIcon, FormsModule, CommonModule , DbNavbarComponent, DbSidebarComponent, DbSidebarForComponent, DbSidebarEtuComponent],
  templateUrl: './cours1.component.html',
  styleUrl: './cours1.component.css'
})
export class Cours1Component implements OnInit {
 showModal = false;

  




   paypalButtonIds: { [key: number]: string } = {};
  user = {
    id: '',
    nom: '',
    prenom: '',
    etat: '',
    numTelephone: '',
    email: '',
    photoUrl: 'assets/user-profile.jpg',
  };

  nouveauCours = {
    titre: '',
    niveau: '',
    type: '',
    filiere: '',
    documentType: 'Cours',
     
    user: { id: null as number | null },
    prix: 0
    
  };

  rechercheCours = {
    titre: '',
    niveau: '',
    type: '',
    filiere: '',
    documentType: '',
    prix: 0
  };

  selectedFile: File | null = null;
  message: string = '';
  listeCours: any[] = [];
  coursFiltresAppliques: any[] = [];
  likedCourses: { [id: number]: boolean } = {};
  likesCount: { [id: number]: number } = {};
  userId: number | null = null;
  courses: any[] = [];
  private baseUrl = 'http://localhost:8081/api/evaluations';

  constructor(private http: HttpClient,private router: Router,private httpClient: HttpClient ) {}

  ngOnInit(): void {
    this.getCours();
    this.setUserFromLocalStorage();
    this.loadAllLikesCounts();
    this.loadCourses();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const id = JSON.parse(storedUser).id;
        this.http.get<any>(`http://localhost:8081/users/${id}`)
          .subscribe(data => {
            this.user = data;
            localStorage.setItem('user', JSON.stringify(data));
            this.loadUserEvaluations();
          });
      } catch (e) {
        console.error("Erreur parsing JSON:", e);
      }
    }
  }
afficherAlerte() {
  alert("💳 Ce cours est payant. Veuillez l’acheter d’abord.");
}

  loadCourses(): void {
    this.http.get<any[]>('http://localhost:8081/api/cours')
      .subscribe(data => {
        this.courses = data;
        this.loadAllLikesCounts();
      });
  }
authHeaders = new HttpHeaders({
  'Authorization': 'Bearer ton-token-ici'  // 🔁 Remplace par ton vrai token
});
  async setupPayPalButton(cours: any): Promise<void> {
    if (!this.user?.id) {
      this.message = "Vous devez être connecté pour effectuer un paiement";
      return;
    }

    try {
      // Chargement du script PayPal avec la bonne propriété 'clientId'
      await loadScript({
        'clientId': 'ASgnB0BFiqDhgSLVUD2cL3edis2StJ87cQgAc3M0-xUu37P_fZwtx21RCpvmHt-8IQQfLZ3N7h61duFR',  // Note: 'clientId' au lieu de 'client-id'
        currency: 'USD'
      });

      // Vérification que paypal est disponible
      if (typeof paypal === 'undefined' || !paypal.Buttons) {
        throw new Error("PayPal SDK n'est pas disponible");
      }

      // Génération d'un ID unique pour le bouton
      this.paypalButtonIds[cours.id] = `paypal-button-${cours.id}-${Math.random().toString(36).substring(2)}`;

      // Configuration des boutons PayPal avec typage strict
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: async (data: unknown, actions: any): Promise<string> => {
          try {
            return await actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  value: (cours.prix / 10).toFixed(2),
                  currency_code: "USD"
                },
                description: cours.titre.substring(0, 127)
              }]
            });
          } catch (err) {
            console.error("Erreur création commande:", err);
            throw new Error("Échec de la création de la commande PayPal");
          }
        },
        onApprove: async (data: { orderID: string }, actions: any): Promise<void> => {
          try {
            const details = await actions.order.capture();
            
            const paymentData = {
              userId: this.user.id,
              coursId: cours.id,
              amount: cours.prix,
              paypalId: details.id,
              status: details.status,
              date: new Date().toISOString()
            };

            await this.http.post('http://localhost:8081/api/payments', paymentData).toPromise();
            
            cours.paid = true;
            this.message = "Paiement confirmé avec succès!";
            this.getCours();
            
          } catch (err: unknown) {
            console.error("Erreur de paiement:", err);
            this.message = err instanceof Error ? err.message : "Erreur lors du traitement du paiement";
          }
        },
        onError: (err: Error): void => {
          console.error("Erreur PayPal:", err);
          this.message = err.message || "Erreur lors du processus de paiement";
        },
        onCancel: (data: { orderID: string }): void => {
          console.log("Paiement annulé:", data.orderID);
          this.message = "Paiement annulé par l'utilisateur";
        }
      }).render(`#${this.paypalButtonIds[cours.id]}`);
      
    } catch (error: unknown) {
      console.error("Erreur initialisation PayPal:", error);
      this.message = error instanceof Error ? error.message : "Erreur d'initialisation du système de paiement";
    }
  }


  onTypeChange() {
  if (this.nouveauCours.type !== 'Payant') {
    this.nouveauCours.prix = 0;
  }
}

getCours(): void {
  const params = new HttpParams().set('role', this.user.etat || '');
  
  this.http.get<any[]>('http://localhost:8081/api/cours', { params }).subscribe(data => {
    this.listeCours = data.map(cours => {
      // Conversion des valeurs numériques en libellés
      if (typeof cours.documentType === 'number') {
        switch(cours.documentType) {
          case 1: cours.documentType = 'Cours'; break;
          case 2: cours.documentType = 'TD'; break;
          case 3: cours.documentType = 'Examen'; break;
          default: cours.documentType = 'Autre';
        }
      }
      
      // Reste du traitement existant
      const extension = cours.fichierNom?.split('.').pop()?.toLowerCase();
      let fileType = 'autre';
      if (extension) {
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
          fileType = 'image';
        } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension)) {
          fileType = 'video';
        } else if (extension === 'pdf') {
          fileType = 'pdf';
        }
      }
      cours.fileType = fileType;
      cours.pdfUrlView = this.getPdfUrl(cours.id, false);
      cours.pdfUrlDownload = this.getPdfUrl(cours.id, true);
      
      return cours;
    });

    this.coursFiltresAppliques = [...this.listeCours];
  });
}
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetCours();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitCours() {
  // Validation des champs obligatoires
  if (!this.nouveauCours.titre || !this.selectedFile) {
    this.message = 'Le titre et le fichier sont obligatoires';
    return;
  }

  const formData = new FormData();
  
  // Ajout des champs avec vérification de null/undefined
  formData.append('titre', this.nouveauCours.titre.trim());
  formData.append('niveau', this.nouveauCours.niveau || '');
  formData.append('type', this.nouveauCours.type || '');
  formData.append('filiere', this.nouveauCours.filiere || '');
formData.append('documentType', this.nouveauCours.documentType || 'Cours');

formData.append('prix', this.nouveauCours.prix.toString());
  // Vérification plus robuste du formateur
  if (this.nouveauCours.user?.id) {
    formData.append('userId', this.nouveauCours.user.id.toString());
  } else {
    this.message = 'Formateur non spécifié';
    return;
  }

  // Ajout du fichier avec vérification
  if (this.selectedFile) {
    // Validation du type de fichier si nécessaire
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.message = 'Type de fichier non supporté';
      return;
    }
    
    // Validation de la taille du fichier (max 5MB)
    if (this.selectedFile.size > 5 * 1024 * 1024) {
      this.message = 'Fichier trop volumineux (max 5MB)';
      return;
    }
    
    formData.append('fichier', this.selectedFile, this.selectedFile.name);
  }

  // Envoi avec gestion améliorée des erreurs
  this.http.post('http://localhost:8081/api/cours', formData).subscribe({
    next: (response: any) => {
      // Ajout du nouveau cours directement dans la liste pour éviter un rechargement complet
      const nouveauCours = {
        ...this.nouveauCours,
        id: response.id,
        fichierNom: response.fichierNom,
        fileType: this.getFileType(response.fichierNom),
        pdfUrlView: this.getPdfUrl(response.id, false),
        pdfUrlDownload: this.getPdfUrl(response.id, true)
      };
      
      this.listeCours.unshift(nouveauCours);
      this.coursFiltresAppliques.unshift(nouveauCours);
      
      // Notification plus professionnelle qu'un alert()
      this.message = 'Module ajouté avec succès!';
      setTimeout(() => this.closeModal(), 1500);
    },
    error: (error) => {
      console.error('Erreur:', error);
      this.message = error.error?.message || 'Erreur lors de l\'ajout du module';
    }
  });
}
private getFileType(filename: string): string {
  if (!filename) return 'autre';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
    return 'image';
  } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension || '')) {
    return 'video';
  } else if (extension === 'pdf') {
    return 'pdf';
  }
  return 'autre';
}
  resetCours() {
  this.nouveauCours = {
    titre: '',
    niveau: '',
    type: '',
    filiere: '',
    documentType: 'Cours',
    user: { id: this.nouveauCours.user.id },
    prix: 0 // Make sure to include this
  };
  this.selectedFile = null;
  this.message = '';
}

  setUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.nouveauCours.user.id = user.id || null;
      } catch (error) {
        console.error('Erreur parsing JSON:', error);
      }
    }
  }



  getPdfUrl(coursId: number, isDownload: boolean): string {
    const cours = this.listeCours.find(c => c.id === coursId);
    if (!cours || !cours.fichierNom) return '';
    const fileName = cours.fichierNom;
    return `http://localhost:8081/api/cours/${isDownload ? 'download' : 'view'}/${fileName}`;
  }

appliquerFiltre() {
  this.coursFiltresAppliques = this.listeCours.filter(cours => {
    return (
      (!this.rechercheCours.titre || cours.titre.toLowerCase().includes(this.rechercheCours.titre.toLowerCase())) &&
      (!this.rechercheCours.filiere || cours.filiere === this.rechercheCours.filiere) &&
      (!this.rechercheCours.niveau || cours.niveau === this.rechercheCours.niveau) &&
      (!this.rechercheCours.type || cours.type === this.rechercheCours.type) &&
      (!this.rechercheCours.documentType || cours.documentType === this.rechercheCours.documentType)
    );
  });
}

  loadUserEvaluations(): void {
    this.http.get<any[]>(`http://localhost:8081/api/evaluations/user/${this.user.id}`)
      .subscribe(evals => {
        evals.forEach(e => {
          if (e.note == 1) {
            this.likedCourses[e.cours.id] = true;
          }
        });
      });
  }

  loadAllLikesCounts(): void {
    this.courses.forEach((c: any) => this.loadLikesCount(c.id));
  }

  loadLikesCount(coursId: number): void {
    this.http.get<number>(`http://localhost:8081/api/evaluations/likes/${coursId}`)
      .subscribe(count => this.likesCount[coursId] = count);
  }

  toggleLike(coursId: number): void {
    const isLiked = this.likedCourses[coursId];

    if (!isLiked) {
      const params = new HttpParams()
        .set('coursId', coursId)
        .set('userId', this.user.id)
        .set('note', '1');

      this.http.post('http://localhost:8081/api/evaluations/add', {}, {
        params,
        responseType: 'text'
      }).subscribe(() => {
        this.likedCourses[coursId] = true;
        this.loadLikesCount(coursId);
      });
    } else {
      const params = new HttpParams()
        .set('coursId', coursId)
        .set('userId', this.user.id);

      this.http.delete('http://localhost:8081/api/evaluations/delete', {
        params,
        responseType: 'text'
      }).subscribe(() => {
        this.likedCourses[coursId] = false;
        this.loadLikesCount(coursId);
      });
    }
  }
  // Ajoutez cette méthode pour filtrer par type de document
filtrerParTypeDocument(type: string) {
  if (type === 'Tous') {
    this.coursFiltresAppliques = [...this.listeCours];
  } else {
    this.coursFiltresAppliques = this.listeCours.filter(cours => 
      cours.documentType === type
    );
  }
}


// Version à garder (supprimez l'autre)



  // Méthode unique pour le paiement PayPal
// Dans votre classe composant
async initierPaiement(cours: any) {
  if (!this.user?.id) {
    this.message = "Veuillez vous connecter pour payer";
    return;
  }

  const containerId = `paypal-button-container-${cours.id}`;
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Conteneur PayPal #${containerId} non trouvé`);
    return;
  }

  container.innerHTML = '';

  try {
    // Correction ici: utiliser clientId au lieu de 'client-id'
    const paypal = await loadScript({
      clientId: 'ASgnB0BFiqDhgSLVUD2cL3edis2StJ87cQgAc3M0-xUu37P_fZwtx21RCpvmHt-8IQQfLZ3N7h61duFR',
      currency: 'USD',
      intent: 'capture'
    });

    if (!paypal?.Buttons) {
      throw new Error("PayPal SDK non initialisé");
    }

    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: async (data: any, actions: any) => {
        try {
          const amountUsd = this.convertDhToUsd(cours.prix);
          return await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                value: amountUsd,
                currency_code: "USD",
                breakdown: {
                  item_total: {
                    value: amountUsd,
                    currency_code: "USD"
                  }
                }
              },
              description: `Cours: ${cours.titre.substring(0, 127)}`,
              items: [{
                name: cours.titre.substring(0, 127),
                unit_amount: {
                  value: amountUsd,
                  currency_code: "USD"
                },
                quantity: "1",
                category: "DIGITAL_GOODS"
              }]
            }]
          });
        } catch (err) {
          console.error("Erreur création commande:", err);
          throw new Error("Impossible de créer la commande PayPal");
        }
      },
      // ... reste de la configuration PayPal inchangé ...
    }).render(`#${containerId}`);
    
  } catch (error: any) {
    console.error("Erreur initialisation PayPal:", error);
    this.message = error?.message || "Erreur lors de l'initialisation du paiement";
  }
}

private async enregistrerPaiement(cours: any, transactionId: string): Promise<void> {
  const paymentData = {
    userId: this.user.id,
    coursId: cours.id,
    amount: cours.prix,
    currency: "USD",
    paypalTransactionId: transactionId,
    status: "COMPLETED",
    date: new Date().toISOString()
  };

  await this.http.post('http://localhost:8081/api/payments', paymentData).toPromise();
}

private convertDhToUsd(montantDh: number): string {
  // 1 USD = 10 DH (taux approximatif)
  return (montantDh / 10).toFixed(2);
}

 



 coursPayants: any[] = [];
  
  paymentProcessing = false;
  selectedCourseId: number | null = null;

  


  getCoursPayants() {
    this.http.get<any[]>('http://localhost:8081/api/cours')
      .subscribe(data => {
        this.coursPayants = data.filter(c => c.type === 'Payant');
        this.coursPayants.forEach(cours => {
          cours.pdfUrlView = `http://localhost:8081/api/cours/view/${cours.fichierNom}`;
          cours.pdfUrlDownload = `http://localhost:8081/api/cours/download/${cours.fichierNom}`;
          this.checkIfPaid(cours);
        });
      });
  }

  checkIfPaid(cours: any) {
    const userId = this.user.id;
    this.http.get<boolean>(`http://localhost:8081/api/payments/check?userId=${userId}&courseId=${cours.id}`)
      .subscribe(isPaid => {
        cours.isPaid = isPaid;
      });
  }

  loadPaypalScript() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=USD`;
    script.onload = () => {
      console.log('PayPal script loaded');
    };
    document.body.appendChild(script);
  }

  payForCourse(cours: any) {
    if (cours.isPaid || this.paymentProcessing) return;

    this.selectedCourseId = cours.id;

    const interval = setInterval(() => {
      if ((window as any).paypal) {
        clearInterval(interval);
        this.renderPaypalButton(cours);
      }
    }, 100);
  }

  renderPaypalButton(cours: any) {
    const containerId = `paypal-button-${cours.id}`;
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';

    (window as any).paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: cours.prix?.toString() || '10.00'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then(() => {
          this.processPayment(cours);
        });
      },
      onError: (err: any) => {
        console.error('Erreur avec PayPal:', err);
        alert('Une erreur est survenue lors du paiement.');
      }
    }).render('#' + containerId);
  }

  processPayment(cours: any) {
    this.paymentProcessing = true;

    const paymentData = {
      userId: this.user.id,
      courseId: cours.id,
      amount: cours.prix || 100,
      paymentDate: new Date().toISOString()
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post('http://localhost:8081/api/payments', paymentData, { headers })
      .subscribe({
        next: () => {
          cours.isPaid = true;
          this.paymentProcessing = false;
          alert('Paiement effectué avec succès!');
        },
        error: (err) => {
          this.paymentProcessing = false;
          console.error('Erreur de paiement:', err);
          alert('Erreur lors du paiement. Veuillez réessayer.');
        }
      });
  }

  ouvrirPdf(url: string) {
    window.open(url, '_blank');
  }

  telechargerPdf(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || '';
    link.click();
  }

supprimerCours(id: any) {
  if (!id || isNaN(Number(id))) {
    console.error('❌ ID invalide :', id);
    return;
  }

  const token = localStorage.getItem('token'); // ou où que tu stockes le JWT
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  this.httpClient.delete(`http://localhost:8081/api/cours/delete/${id}`, { headers })
    .subscribe({
      next: () => {
        console.log('✅ Cours supprimé avec succès');
        this.getCours(); // rafraîchir la liste
      },
      error: err => {
        console.error('❌ Erreur de suppression :', err);
      }
    });
}




}
