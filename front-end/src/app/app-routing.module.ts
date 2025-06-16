import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './game/game-page/game-page.component';
import {UserListComponent} from "./users/user-list/user-list.component";
import { HomeComponent } from './home/home.component';
import {UserHistoryComponent} from "./users/user-history/user-history.component";
import { CreateExerciceComponent } from "./exercice-list/create-exercice/create-exercice.component"; // Ajout du composant de création d'exercice
import { ExerciceListComponent } from "./exercice-list/exercice-list-manager/exercice-list.component";
import {UserExerciseListComponent} from "./users/user-exercise-list/user-exercise-list.component";
import {UserFormComponent} from "./users/user-form/user-form.component";
import {EditExerciceComponent} from "./exercice-list/edit-exercice/edit-exercice.component"; // Ajout du composant de liste des exercices



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'game', component: GamePageComponent },
  { path: 'user/:idUser/exercises', component: UserExerciseListComponent },
  { path: ':idUser/game/:idExercice', component: GamePageComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'choose-user', component: UserListComponent },
  { path: ':idUser/choose-exercice', component: UserExerciseListComponent, data: { mode: 'play' } },
  { path: 'users/:id/history', component: UserHistoryComponent},
  { path: 'exercice-list-manager', component: ExerciceListComponent },
  { path: 'create-user', component: UserFormComponent },
  { path: 'create-exercice', component: CreateExerciceComponent },
  { path: 'edit-exercice/:id', component: EditExerciceComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
