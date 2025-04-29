import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recherche',
  imports: [ RouterLink ],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.css'
})

  export class RechercheComponent {
    moveToNext(event: any, index: number) {
      if (event.target.value.length === 1) {
  
        const nextInput = document.getElementsByClassName('input-code')[index] as HTMLInputElement;
        if (nextInput) {
          nextInput.focus(); 
        }
      }
    }
  }
