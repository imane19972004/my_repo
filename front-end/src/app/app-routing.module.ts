import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './game/game-page/game-page.component';
import {UserListComponent} from "./users/user-list/user-list.component";
import { HomeComponent } from './home/home.component';
import {UserHistoryComponent} from "./users/user-history/user-history.component";
import { CreateExerciceComponent } from "./exercice-list/create-exercice/create-exercice.component"; // Ajout du composant de création d'exercice
import { ExerciceListComponent } from "./exercice-list/exercice-list-manager/exercice-list.component"; // Ajout du composant de liste des exercices
import {PatientExerciceListComponent} from "./patient-exercice-list/patient-exercice-list/patient-exercice-list.component"



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'game', component: GamePageComponent },
  { path: ':idUser/game/:idExercice', component: GamePageComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'choose-user', component: UserListComponent },
  { path: ':idUser/choose-exercice', component: ExerciceListComponent },
  { path: 'users/:id/history', component: UserHistoryComponent},
  { path: 'users/:id/exercices', component: PatientExerciceListComponent }, // Nouvelle route
  { path: 'exercice-list', component: ExerciceListComponent },
  { path: 'exercice-list-manager', component: ExerciceListComponent }, // Page pour voir la liste des exercices
  { path: 'create-quiz', component: CreateExerciceComponent },
  { path: 'create-exercice', component: CreateExerciceComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
