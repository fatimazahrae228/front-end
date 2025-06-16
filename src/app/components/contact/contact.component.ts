import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  constructor(private http: HttpClient) {}

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
