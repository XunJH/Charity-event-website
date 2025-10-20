import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Category } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'https://24517241.it.scu.edu.au/root/api'; // 后端接口地址

  constructor(private http: HttpClient) { }

  // 新增活动（管理员）
  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event);
  }

  // 更新活动（管理员）
  updateEvent(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}`, event);
  }

  // 删除活动（管理员）
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

  // 获取所有活动
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  // 搜索活动
  searchEvents(date?: string, location?: string, categoryId?: number): Observable<Event[]> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    if (location) params = params.set('location', location);
    if (categoryId) params = params.set('category_id', categoryId);
    return this.http.get<Event[]>(`${this.apiUrl}/events/search`, { params });
  }

  // 获取活动详情
  getEventDetail(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`);
  }

  // 获取所有分类
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}