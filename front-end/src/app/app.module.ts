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
import {UserHistoryComponent} from "./users-history/user-history/user-history.component";
import {UserHistoryListComponent} from "./users-history/user-history-list/user-history-list.component";
import {CreateExerciceComponent } from "./create-exercice/create-exercice.component";//(Im)
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



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
    UserHistoryListComponent,
    CreateExerciceComponent,//aussi (Im)

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,//pour ngModel
  ],
  providers: [
    provideAnimationsAsync()//(Im)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
