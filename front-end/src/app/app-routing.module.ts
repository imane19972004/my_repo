import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './game/game-page/game-page.component';
import {UserListComponent} from "./users/user-list/user-list.component";
import { HomeComponent } from './home/home.component';
import {UserHistoryComponent} from "./users-history/user-history/user-history.component";
import { CreateExerciceComponent } from "./create-exercice/create-exercice.component"; // Ajout du composant de création d'exercice
import { ExerciceListComponent } from "./exercice-list/exercice-list.component"; // Ajout du composant de liste des exercices



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GamePageComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'users/:id/history', component: UserHistoryComponent},
  { path: 'exercice-list', component: ExerciceListComponent }, // Page pour voir la liste des exercices
  { path: 'create-exercice', component: CreateExerciceComponent },
  { path: 'create-quiz', component: CreateExerciceComponent },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




