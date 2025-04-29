import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-db-navbar',
  imports: [ MatIconModule , RouterLink ],
  templateUrl: './db-navbar.component.html',
  styleUrl: './db-navbar.component.css'
})
export class DbNavbarComponent {
 
}
