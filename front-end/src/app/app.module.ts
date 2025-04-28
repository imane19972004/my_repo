import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GameItemsContainerComponent} from "./game/game-items-container/game-items-container.component";
import {GamePageComponent} from "./game/game-page/game-page.component";
import {GameCategoryComponent} from "./game/game-category/game-category.component";
import {UserComponent} from "./users/user/user.component";
import {UserFormComponent} from "./users/user-form/user-form.component";
import {UserListComponent} from "./users/user-list/user-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {HeaderComponent} from "./header/header.component";
import {HomeComponent} from "./home/home.component";
import {UserHistoryComponent} from "./users/user-history/user-history.component";
import {CreateExerciceComponent } from "./exercice-list/create-exercice/create-exercice.component";//(Im)
import {ExerciceListComponent} from "./exercice-list/exercice-list-manager/exercice-list.component";
import { SettingsComponent } from './settings/settings.component';
import { SettingsApplierComponent } from './settings/settings-applier/settings-applier.component';
import { PatientExerciceListComponent } from './patient-exercice-list/patient-exercice-list/patient-exercice-list.component';






@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserFormComponent,
    UserListComponent,
    GamePageComponent,
    GameItemsContainerComponent,
    GameCategoryComponent,
    HomeComponent,
    HeaderComponent,
    UserHistoryComponent,
    CreateExerciceComponent,//aussi (Im)
    ExerciceListComponent,
    SettingsComponent,
    SettingsApplierComponent,
    PatientExerciceListComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,//pour ngModel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
