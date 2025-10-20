import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './features/admin/event-list/event-list.component';
import { HomeComponent } from './features/public/home/home.component';
import { SearchComponent } from './features/public/search/search.component';
import { EventDetailComponent } from './features/public/event-detail/event-detail.component';
import { RegistrationComponent } from './features/public/registration/registration.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'register/:eventId', component: RegistrationComponent },
  { path: 'admin/events', component: EventListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }