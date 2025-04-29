import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-inscrire',
  imports: [ ReactiveFormsModule , RouterLink ] ,
  templateUrl: './inscrire.component.html',
  styleUrl: './inscrire.component.css'
})
export class InscrireComponent {
  register  = new FormGroup({
    nom: new FormControl(''),
    prenom: new FormControl(''),
    numTelephone: new FormControl(''),
    etat: new FormControl(''),
    email: new FormControl(''),
    name: new FormControl(''),
    motsPasse: new FormControl('')
  });

  constructor(private httpClient: HttpClient) {}

  public handleSubmit() {
    console.log(this.register.value);

    this.httpClient.post('http://localhost:8081/users/addUser', this.register.value).subscribe((data:any) =>{
      alert("Inscription réussie !!")
    }, error => {
      console.log(error);
    })
}

}

