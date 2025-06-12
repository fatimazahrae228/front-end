import { CommonModule } from '@angular/common';
import { HttpClient , HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { MatIcon } from '@angular/material/icon';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';


@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [ MatIcon , FormsModule ,CommonModule , DbNavbarComponent, DbSidebarComponent , DbSidebarForComponent , DbSidebarEtuComponent  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
  export class CoursComponent implements OnInit {
    showModal = false;
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
    formateur: { id: null as number | null }
  };

   isLiked: boolean = false;

  rechercheCours = {
    titre: '',
    niveau: '',
    type: '',
    filiere: ''
  };

  selectedFile: File | null = null;
  message: string = '';
  listeCours: any[] = [];
  coursFiltresAppliques: any[] = [];
  likedCourses: { [id: number]: boolean } = {};
  likesCount: { [id: number]: number } = {};
userId : number | null = null ;
  private baseUrl = 'http://localhost:8081/api/evaluations';
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCours();
    this.setFormateurFromLocalStorage();
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
  
loadCourses(): void {
  this.http.get<any[]>('http://localhost:8081/api/cours')
    .subscribe(data => {
      this.courses = data;
      this.loadAllLikesCounts(); // Maintenant qu’on a les cours
    });
}

getCours(): void {
  this.http.get<any[]>('http://localhost:8081/api/cours').subscribe(data => {
    this.listeCours = data;

    this.listeCours.forEach(cours => {
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

      // Ajouter les URLs de visualisation / téléchargement
      cours.pdfUrlView = this.getPdfUrl(cours.id, false);
      cours.pdfUrlDownload = this.getPdfUrl(cours.id, true);
    
         
    });

    this.coursFiltresAppliques = [...this.listeCours]; // Copie pour les filtres
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
    const formData = new FormData();
    formData.append('titre', this.nouveauCours.titre);
    formData.append('niveau', this.nouveauCours.niveau);
    formData.append('type', this.nouveauCours.type);
    formData.append('filiere', this.nouveauCours.filiere);

    if (this.nouveauCours.formateur.id !== null) {
      formData.append('formateurId', this.nouveauCours.formateur.id.toString());
    }

    if (this.selectedFile) {
      formData.append('fichier', this.selectedFile);
    }

    this.http.post('http://localhost:8081/api/cours', formData).subscribe({
      next: () => {
        alert('Cours ajouté avec succès !'),
        this.getCours();
      },
      error: () => {
        alert('Erreur lors de l\’ajout du cours.')
      }
    });
  }

  resetCours() {
    this.nouveauCours = {
      titre: '',
      niveau: '',
      type: '',
      filiere: '',
      formateur: { id: this.nouveauCours.formateur.id }
    };
    this.selectedFile = null;
    this.message = '';
  }

  setFormateurFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.nouveauCours.formateur.id = user.id || null;
      } catch (error) {
        console.error('Erreur parsing JSON:', error);
      }
    }
  }

  ouvrirPdf(url: string) {
    window.open(url, '_blank');
  }

  telechargerPdf(pdfUrl: string): void {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfUrl.split('/').pop() || '';
    link.click();
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
        (!this.rechercheCours.filiere || cours.filiere == this.rechercheCours.filiere) &&
        (!this.rechercheCours.niveau || cours.niveau == this.rechercheCours.niveau) &&
        (!this.rechercheCours.type || cours.type == this.rechercheCours.type)
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

courses: any[] = [];

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
      // Like : POST
      const params = new HttpParams()
        .set('coursId', coursId)
        .set('userId', this.user.id)
        .set('note', '1');

      this.http.post('http://localhost:8081/api/evaluations/add', {}, {
         params, 
          responseType:'text'
        })
        .subscribe(() => {
          this.likedCourses[coursId] = true;
          this.loadLikesCount(coursId);
        });

    } else {
      // Unlike : DELETE
      const params = new HttpParams()
        .set('coursId', coursId)
        .set('userId', this.user.id);

      this.http.delete('http://localhost:8081/api/evaluations/delete', { 
        params,
        responseType:'text'
       })
        .subscribe(() => {
          this.likedCourses[coursId] = false;
          this.loadLikesCount(coursId);
        });
    }
  }
  }
