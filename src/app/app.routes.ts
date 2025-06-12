import { Routes } from '@angular/router';
import { ConnecterComponent } from './components/connecter/connecter.component'; 
import { AccueilComponent } from "./components/accueil/accueil.component";
import { ContactComponent } from './components/contact/contact.component';
import { ServiceComponent } from './components/service/service.component';
import { InscrireComponent } from './components/inscrire/inscrire.component';
import { RechercheComponent } from './components/connecter/oublier-mdp/recherche/recherche.component';
import { OublierMdpComponent } from './components/connecter/oublier-mdp/oublier-mdp.component';
import { DbAdminComponent } from './components/dashboard/db-admin/db-admin.component';
import { EtudiantComponent } from './components/etudiant/etudiant.component';
import { FormateurComponent } from './components/formateur/formateur.component';
import { CoursComponent } from './components/dashboard/cours/cours.component';
import { DbSidebarComponent } from './components/dashboard/db-sidebar/db-sidebar.component';
import { DbNavbarComponent } from './components/dashboard/db-navbar/db-navbar.component';
import { PlanningComponent } from './components/dashboard/planning/planning.component';
import { PaiementComponent } from './components/dashboard/paiement/paiement.component';
import { DbFormateurComponent } from './components/dashboard/db-formateur/db-formateur.component';
import { DbEtudiantComponent } from './components/dashboard/db-etudiant/db-etudiant.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { DbSidebarEtuComponent } from './components/dashboard/db-sidebar-etu/db-sidebar-etu.component';
import { LiveComponent } from './components/dashboard/live/live.component';
import { NotificationComponent } from './components/dashboard/notification/notification.component';
import { ResetPasswordComponent } from './components/connecter/oublier-mdp/reset-password/reset-password.component';

export const routes: Routes = [
    { 
        path:'',
        redirectTo : 'accueil',
        pathMatch: 'full',
    },
    { path: 'accueil',
         component: AccueilComponent }, // Page d'accueil par défaut

    { path : 'service',
         component : ServiceComponent }, 


    { path : 'contact',
         component : ContactComponent },
         
         { path : 'connecter',
            component : ConnecterComponent }, 

    { path : 'inscrire',
         component : InscrireComponent },   
         
     { 
     path : 'recherche',
     component : RechercheComponent  } ,
     
     {
      path : 'oublier-mdp',
      component : OublierMdpComponent } ,

        {
      path : 'reset-password',
      component : ResetPasswordComponent } ,
      {
          path : 'db-sidebar',
          component : DbSidebarComponent
     }, 
     {
          path : 'notification',
          component : NotificationComponent
     },

     {
        path : 'live',
        component : LiveComponent
   },

   {
     path : 'notinication',
     component : NotificationComponent
},

     {
        path : 'db-sidebar-etu',
        component : DbSidebarEtuComponent
   },
     {
          path : 'db-navbar' ,
          component : DbNavbarComponent  } ,
      {
     path : 'db-admin' ,
     component : DbAdminComponent  } ,
     
    
     {
      path : 'etudiant' ,
          component : EtudiantComponent  } ,
      
     {
      path : 'formateur' ,
          component : FormateurComponent  } ,

          {
                path : 'db-formateur',
                component : DbFormateurComponent
          },
          {
               path : 'db-etudiant',
               component: DbEtudiantComponent
          },
      {
      path : 'cours' ,
           component : CoursComponent } ,

           {
            path : 'admin' ,
                 component : AdminComponent } ,
     
      {
      path : 'planning' ,
          component : PlanningComponent } ,

      {
       path : 'paiement' ,
           component : PaiementComponent } ,

           {
       path : "profile",
       component : ProfileComponent
           },
];
