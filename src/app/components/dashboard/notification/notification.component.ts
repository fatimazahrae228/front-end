import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { DbEtudiantComponent } from '../db-etudiant/db-etudiant.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification',
  imports: [ CommonModule , DbSidebarComponent, DbSidebarEtuComponent ,DbNavbarComponent , MatIconModule ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];

  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.http.get<any[]>('http://localhost:8081/api/notifications')
      .subscribe(data => {
        this.notifications = data.reverse().map(notif => {
          return {
            ...notif,
            dateCreated: this.formatDate(notif.dateCreated)
          };
        });
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  }
}
