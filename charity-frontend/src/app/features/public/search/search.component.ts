import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../core/services/event.service';
import { Event, Category } from '../../../core/models/event.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  categories: Category[] = [];
  events: Event[] = [];
  date = '';
  location = '';
  categoryId?: number;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    // 加载分类
    this.eventService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  // 执行搜索
  doSearch(): void {
    this.eventService.searchEvents(this.date, this.location, this.categoryId).subscribe(events => {
      this.events = events;
    });
  }

  // 清除搜索条件
  clearSearch(): void {
    this.date = '';
    this.location = '';
    this.categoryId = undefined;
    this.events = [];
  }

  // 计算进度
  getProgress(raised: number, goal: number): number {
    return Math.min(100, Math.round((raised / goal) * 100));
  }
}