import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserComponent } from './components/usuaris/user.component';
import { PropertyComponent } from './components/property/property.component';
import { HomeComponent } from './components/home/home.component';
import {NgxPaginationModule} from 'ngx-pagination';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige a Home por defecto
  { path: 'home', component: HomeComponent },
  { path: 'user', component: UserComponent },
  { path: 'property', component: PropertyComponent },
  { path: '**', redirectTo: 'home' } // Redirige cualquier ruta desconocida a Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), NgxPaginationModule ], // Activar el modo hash para evitar problemas con el enrutado
  exports: [RouterModule]
})
export class AppRoutingModule {}


