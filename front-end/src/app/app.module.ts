import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GamePageComponent } from './game/game-page/game-page.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserHistoryComponent } from './users-history/user-history/user-history.component';
import { CreateExerciceComponent } from './create-exercice/create-exercice.component';
import { ExerciceListComponent } from './exercice-list/exercice-list.component';
import { SettingsComponent } from './settings/settings.component';
// import { SettingsApplierComponent } from './settings-applier/settings-applier.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GamePageComponent,
    UserListComponent,
    UserHistoryComponent,
    CreateExerciceComponent,
    ExerciceListComponent,
    SettingsComponent,
    // SettingsApplierComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }