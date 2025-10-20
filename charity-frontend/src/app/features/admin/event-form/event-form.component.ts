import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event, Category } from 'src/app/core/models/event.model';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  @Input() isVisible = false; // 控制弹窗显示
  @Input() isEdit = false; // 区分新增/编辑
  @Input() event: Partial<Event> = {}; // 活动数据
  @Input() categories: Category[] = []; // 分类列表
  @Output() closeModal = new EventEmitter(); // 关闭弹窗
  @Output() saveSuccess = new EventEmitter(); // 保存成功

  constructor(private eventService: EventService) { }

  // 关闭弹窗
  close() {
    this.closeModal.emit();
  }

  // 提交表单
  onSubmit() {
    if (this.isEdit && this.event.id) {
      // 编辑活动
      this.eventService.updateEvent(this.event.id, this.event).subscribe(() => {
        this.saveSuccess.emit();
        this.close();
      });
    } else {
      // 新增活动
      this.eventService.createEvent(this.event).subscribe(() => {
        this.saveSuccess.emit();
        this.close();
      });
    }
  }
}