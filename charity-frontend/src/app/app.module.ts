import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
// 1. 导入 FormsModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// 导入你的组件（保持不变）
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './features/public/home/home.component';
import { SearchComponent } from './features/public/search/search.component';
import { EventDetailComponent } from './features/public/event-detail/event-detail.component';
import { RegistrationComponent } from './features/public/registration/registration.component';
import { EventListComponent } from './features/admin/event-list/event-list.component';
import { EventFormComponent } from './features/admin/event-form/event-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    EventDetailComponent,
    RegistrationComponent,
    EventListComponent,
    EventFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }