import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private apiUrl = 'https://24517241.it.scu.edu.au/root/api';

  constructor(private http: HttpClient) { }

  // 提交报名
  createRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(`${this.apiUrl}/registrations`, registration);
  }

  getEventRegistrations(eventId: number): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}/events/${eventId}/registrations`);
  }
}