import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { Event } from '../../../core/models/event.model';
import { Registration } from '../../../core/models/event.model'; // 确保导入

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event?: Event;
  loading = true;
  registrationsCount = 0; // 已声明
  registrationsList: Registration[] = []; // 新增：声明报名列表变量

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    
    // 获取活动详情（原有逻辑）
    this.eventService.getEventDetail(eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    // 获取报名列表并赋值（确保这部分代码存在）
    this.registrationService.getEventRegistrations(eventId).subscribe({
      next: (registrations: Registration[]) => {
        this.registrationsCount = registrations.length;
        this.registrationsList = registrations; // 给列表变量赋值
      }
    });
  }

  // 其他方法（不变）
  getProgress(raised: number, goal: number): number {
    return Math.min(100, Math.round((raised / goal) * 100));
  }

  goToRegistration(): void {
    if (this.event) {
      this.router.navigate(['/register', this.event.id]);
    }
  }
}