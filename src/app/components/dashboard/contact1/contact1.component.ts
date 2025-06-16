import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DbSidebarEtuComponent } from '../db-sidebar-etu/db-sidebar-etu.component';
import { DbSidebarForComponent } from '../db-sidebar-for/db-sidebar-for.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact1',
  standalone: true,
  imports: [FormsModule , DbSidebarEtuComponent, DbSidebarForComponent , DbNavbarComponent , NgIf],
  templateUrl: './contact1.component.html',
  styleUrls: ['./contact1.component.css'],
})
export class Contact1Component {
  user = {
    id: '',
    nom: '',
    prenom: '',
    etat: '',
    numTelephone: '',
    email: '',
    photoUrl: 'assets/user-profile.jpg',
  };
  constructor(private http: HttpClient) {}
    ngOnInit(): void {

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const id = JSON.parse(storedUser).id;
          this.http.get<any>(`http://localhost:8081/users/${id}`)
            .subscribe(data => {
              this.user = data;
              localStorage.setItem('user', JSON.stringify(data));

            });
        } catch (e) {
          console.error("Erreur parsing JSON:", e);
        }
      }
    }

  onSubmit(form: any) {
  const emailData = {
    sender_name: form.value.name,
    sender_email: form.value.email,
    subject: form.value.subject,
    content: form.value.message
  };

  this.http.post('http://127.0.0.1:5000/send-email', emailData)
    .subscribe({
      next: () => alert('📬 Message envoyé avec succès!'),
      error: (err) => {
        console.error(err);
        alert('❌ Erreur lors de l\'envoi');
      }
    });
}


}
