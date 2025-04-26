import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamePageComponent } from './game/game-page/game-page.component';
import { GameCategoryComponent } from './game/game-category/game-category.component';
import { GameItemsContainerComponent } from './game/game-items-container/game-items-container.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsApplierComponent } from './settings/settings-applier/settings-applier.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { HomeComponent } from './home/home.component';
import { UserHistoryComponent } from './users-history/user-history/user-history.component';
import { CreateExerciceComponent } from './create-exercice/create-exercice.component';
import { ExerciceListComponent } from './exercice-list/exercice-list.component';
import { HeaderComponent } from './header/header.component';

// Ajoutez ces imports si vous avez des composants User
import { UserComponent } from './users/user/user.component';
import { UserFormComponent } from './users/user-form/user-form.component';

@NgModule({
  declarations: [
    AppComponent,
    GamePageComponent,
    GameCategoryComponent,
    GameItemsContainerComponent,
    SettingsComponent,
    SettingsApplierComponent,
    UserListComponent,
    HomeComponent,
    UserHistoryComponent,
    CreateExerciceComponent,
    ExerciceListComponent,
    HeaderComponent,
    UserComponent,
    UserFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }