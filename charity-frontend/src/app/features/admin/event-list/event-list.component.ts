import { Component, OnInit } from '@angular/core';
import { Event, Category } from 'src/app/core/models/event.model';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  categories: Category[] = [];
  formVisible = false; // 控制表单弹窗显示
  isEdit = false; // 区分新增/编辑
  currentEvent: Partial<Event> = {}; // 当前操作的活动

  constructor(private eventService: EventService) { }

  // 初始化加载数据
  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
  }

  // 加载所有活动
  loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  // 加载所有分类
  loadCategories() {
    this.eventService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  // 打开新增活动表单
  openAddForm() {
    this.isEdit = false;
    this.currentEvent = {}; // 清空表单
    this.formVisible = true;
  }

  // 打开编辑活动表单
  openEditForm(event: Event) {
    this.isEdit = true;
    this.currentEvent = { ...event }; // 复制活动数据到表单
    this.formVisible = true;
  }

  // 关闭表单弹窗
  closeForm() {
    this.formVisible = false;
  }

  // 刷新活动列表（保存成功后调用）
  refreshEvents() {
    this.loadEvents();
  }

  // 删除活动
  deleteEvent(id: number) {
    if (confirm('确定要删除这个活动吗？')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents(); // 删除后刷新列表
      });
    }
  }
}