import { Component, OnInit , inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from '../admin.service'
import { DbSidebarComponent } from '../db-sidebar/db-sidebar.component';
import { DbNavbarComponent } from '../db-navbar/db-navbar.component';


@Component({
  selector: 'app-db-admin',
  standalone:true ,
  imports: [  CommonModule, HttpClientModule , DbSidebarComponent , MatCardModule , DbNavbarComponent, MatIconModule],
  templateUrl: './db-admin.component.html',
  styleUrl: './db-admin.component.css'
})

    export class DbAdminComponent implements OnInit {
        etudiantCount = 0;
        formateurCount = 0;
        adminCount = 0;
        userCount= 0;
        
        private adminService = inject(AdminService); // Injection sans constructeur
      
        ngOnInit(): void {
          this.loadCounts();
        }
      
        loadCounts(): void {
          this.adminService.getEtudiantCount().subscribe(count => {
            this.etudiantCount = count;
          });
      
          this.adminService.getFormateurCount().subscribe(count => {
            this.formateurCount = count;
          });

          this.adminService.getAdminCount().subscribe(count => {
            this.adminCount = count;
          });
        
          this.adminService.getUserCount().subscribe(count => {
            this.userCount = count;
          });
        
        }
      }
