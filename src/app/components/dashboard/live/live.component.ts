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
  
    constructor(private http: HttpClient) {}
  
    ngAfterViewInit(): void {
      const domain = '8x8.vc'; // ou meet.jit.si si tu n'utilises pas JAAS
      const options = {
        roomName: `vpaas-magic-cookie-7f455d1d598e46e5bc83cda2cdb516c9/${this.roomName}`,
        jwt : "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtN2Y0NTVkMWQ1OThlNDZlNWJjODNjZGEyY2RiNTE2YzkvZDBmMmM3LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDU3MTQ0MDIsImV4cCI6MTc0NTcyMTYwMiwibmJmIjoxNzQ1NzE0Mzk3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtN2Y0NTVkMWQ1OThlNDZlNWJjODNjZGEyY2RiNTE2YzkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImZvcm1hdGV1ciIsImlkIjoiZ29vZ2xlLW9hdXRoMnwxMDY2NTkyMjAyMTEwMjUxNzYyNDMiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImZvcm1hdGV1ckBnbWFpbC5jb20ifX0sInJvb20iOiIqIn0.hGe1frV4GM8C2twmKqajCDR5Vo72gT9W0SZtO6ks2fR5zh4QdBrbZApLHmiR7wpIUmHoLmvzFARPt1j5zJ68iFqWQt0K5VSHBpvyaznZv8tuSVSX-NRjnHPRF3G93f3WY-J2qx-PbCmJiXTV3qz2SMbY0Mj9Z8rYV7I2rvGOusbC9tsNNOhK_SbZOJcjmkh-WnfUoUJ_pFh9lKmMhUnmqNn70ALE-ZjMBKhokAN13-z-XaylJG4kIPqMoiwtHRrZrrNlNr2qiLsBQRnNL6tTZ2iejyWQiaMdTgh7tAYpJBJ7UeDiOyJM2_zjOJ_7tFyVP8JCvZqVIJY0RVa0qRA2xA" ,
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