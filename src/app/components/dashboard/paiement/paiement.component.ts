import { Component } from '@angular/core';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { HttpClient } from '@angular/common/http';
import AgoraRTC from 'agora-rtc-sdk';

@Component({
  selector: 'app-paiement',
  imports: [],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent {
  private client: any;
  private localStream: any;
  private channelName: string = 'maSalleDeConference';
  private appId: string = 'YOUR_AGORA_APP_ID';
  private token: string = '';
  public isConferenceRunning: boolean = false;

  constructor(private http: HttpClient) {}

  startConference(uid: string = '123456') {
    const url = `http://localhost:8081/api/agora/token?channelName=${this.channelName}&uid=${uid}`;

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (generatedToken) => {
        this.token = generatedToken;
        this.initializeAgora(uid);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du token Agora', err);
      }
    });
  }

  private initializeAgora(uid: string) {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    this.client.init(this.appId, () => {
      console.log('Client Agora initialisé');
      this.joinChannel(uid);
    }, (err: any) => {
      console.error('Erreur d\'initialisation du client Agora', err);
    });
  }

  private joinChannel(uid: string) {
    this.client.join(this.token, this.channelName, uid, (userId: number) => {
      console.log('Rejoint le canal avec UID:', userId);
      this.isConferenceRunning = true;
      this.startLocalStream(userId);
    }, (err: any) => {
      console.error('Erreur lors de la connexion au canal', err);
    });
  }

  private startLocalStream(uid: number) {
    this.localStream = AgoraRTC.createStream({
      streamID: uid,
      audio: true,
      video: true,
      screen: false
    });

    this.localStream.init(() => {
      console.log('Flux local prêt');
      this.localStream.play('agora-container');
      this.client.publish(this.localStream, (err: any) => {
        console.error('Erreur de publication du flux', err);
      });
    }, (err: any) => {
      console.error('Erreur lors de l\'initialisation du flux local', err);
    });
  }

  endConference() {
    if (!this.client) return;

    this.client.leave(() => {
      console.log('Quitte le canal avec succès');
      this.localStream?.stop();
      this.localStream?.close();
      this.isConferenceRunning = false;
    }, (err: any) => {
      console.error('Erreur lors de la déconnexion du canal', err);
    });
  }
}