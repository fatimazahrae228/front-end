import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component , OnInit } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';

declare var JitsiMeetExternalAPI: any; 
@Component({
  selector: 'app-live',
  imports: [  FormsModule , MatIconModule , CommonModule , DbSidebarForComponent , DbNavbarComponent ],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css'
})
export class LiveComponent implements AfterViewInit{
  api: any;
    roomName: string = 'maSalleDeFormation';
    user = {
    id:'',
    nom: '',
    prenom: '',
    etat: '',
    numTelephone: '',
    email: '',
    photoUrl: '', 
  };
  rappel={
    titre:'',
lienLive :"",
duree: 0,
 formateur: { id: null } 
  };

 rappels: any[] = [];
  formateurs: any[] = [];
  message ='';
  showModal=false;
    constructor(private http: HttpClient) {}
      ngOnInit(): void {
      this.getFormateurs();
      this.setFormateurFromLocalStorage(); // Récupère l'ID du formateur connecté
    }
      openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
    // Récupère les formateurs depuis l'API
    getFormateurs() {
      this.http.get<any[]>('http://localhost:8081/api/formateurs').subscribe(data => {
        this.formateurs = data;
      });
    }

  
  
    setFormateurFromLocalStorage() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.rappel.formateur.id = user.id; // Assigne l'ID du formateur connecté
        } catch (e) {
          console.error('Erreur de parsing JSON:', e);
        }
      }
    }
       submitRappel() {
    const body = {
      ...this.rappel,
      formateur: { id: this.rappel.formateur.id }
    };

    this.http.post('http://localhost:8081/api/rappels', body).subscribe({
      next: () => {
        alert('Rappel crée avec succes');
       
      },
      error: () => alert('Erreur lors du rappel .') ,
    });
  }
  
    ngAfterViewInit(): void {
      const domain = '8x8.vc'; // ou meet.jit.si si tu n'utilises pas JAAS
      const options = {
        roomName: `vpaas-magic-cookie-7f455d1d598e46e5bc83cda2cdb516c9/${this.roomName}`,
        jwt : "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtN2Y0NTVkMWQ1OThlNDZlNWJjODNjZGEyY2RiNTE2YzkvZDBmMmM3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDcwODc4NTcsImV4cCI6MTc0NzA5NTA1NywibmJmIjoxNzQ3MDg3ODUyLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtN2Y0NTVkMWQ1OThlNDZlNWJjODNjZGEyY2RiNTE2YzkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6IkZvcm1hdGV1ciIsImlkIjoiZ29vZ2xlLW9hdXRoMnwxMDY2NTkyMjAyMTEwMjUxNzYyNDMiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImZvcm1hdGV1ckBnbWFpbC5jb20ifX0sInJvb20iOiIqIn0.ecGmd_Itylqeb68VAXD41EPwaYRUFnWQyeS8Yt-oGqOYq8RAd1qv6mMA9IKNs0MO0egtDNK828q9r9dnOLN84v54vHqpZh-t6_33TwWuG6Vn5RUxl-fEYRkPy8cE59F01p7UjXj-3lvjEH-80toERTzMF-xLTiekBy2AS2Aj9mIbJ_x_ATzYhCa20TU2YMyeP2uP8CJPrAo5n75mjXe8nDtdkiz1f0dmPYT2NBzoiSicHAbn4TYOl7KivEmavbiruBU12aHdzt_Cx9w5NUX7tLXRQv2nWs5hGkKgfVkVQ4CX1XztrSNeJPx_Td4pJeV-xYvbONUqa90NUz602m_QYQ" ,
        width: '100%',
        height: 600,
        parentNode: document.querySelector('#jaas-container'),
        userInfo: {
          displayName: 'Formateur' // Tu peux utiliser une variable de session ici
        }
      };
  
      this.api = new JitsiMeetExternalAPI(domain, options);
  
      // 🔴 Conférence commencée
      this.api.addEventListener('videoConferenceJoined', () => {
        const heureDebut = new Date().toISOString();
        this.http.post('http://localhost:8081/api/live/debut', {
          nomSalle: this.roomName,
          heureDebut: heureDebut,
          formateurId: 55 // Remplace par l'ID du formateur courant
        }).subscribe(() => console.log('✅ Heure de début enregistrée'));
      });
  
      // 🟢 Conférence terminée
      this.api.addEventListener('videoConferenceLeft', () => {
        const heureFin = new Date().toISOString();
        this.http.post('http://localhost:8081/api/live/fin', {
          nomSalle: this.roomName,
          heureFin: heureFin
        }).subscribe(() => console.log('✅ Heure de fin enregistrée'));
      });
  
      // 👥 Participant rejoint
      this.api.addEventListener('participantJoined', (e: any) => {
        const nomParticipant = e.displayName;
        this.http.post('http://localhost:8081/api/live/participant', {
          nomSalle: this.roomName,
          participant: nomParticipant
        }).subscribe(() => console.log('👤 Participant ajouté'));
      });
    }
   
}
 


 


  

