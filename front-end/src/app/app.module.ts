import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GamePageComponent } from './game/game-page/game-page.component';
import { GameCategoryComponent } from './game/game-category/game-category.component';
import { GameItemsContainerComponent } from './game/game-items-container/game-items-container.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserComponent } from './users/user/user.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserHistoryComponent } from './users-history/user-history/user-history.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsApplierComponent } from './settings/settings-applier/settings-applier.component';
import { CreateExerciceComponent } from './create-exercice/create-exercice.component';
import { ExerciceListComponent } from './exercice-list/exercice-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GamePageComponent,
    GameCategoryComponent,
    GameItemsContainerComponent,
    UserListComponent,
    UserComponent,
    UserFormComponent,
    UserHistoryComponent,
    HomeComponent,
    SettingsComponent,
    SettingsApplierComponent,
    CreateExerciceComponent,
    ExerciceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule // Ajout pour résoudre l'erreur formGroup
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }