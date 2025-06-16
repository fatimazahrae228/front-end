import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {  MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-service',
  imports: [ MatIconModule , NgIf],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
 showModal = false;
  openModal() {
    this.showModal = true;
  }

}
