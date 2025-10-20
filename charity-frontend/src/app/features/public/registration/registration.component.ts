import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { EventService } from 'src/app/core/services/event.service';
import { Registration, Event } from 'src/app/core/models/event.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registration: Registration = {
    event_id: 0,
    user_name: '',
    email: '',
    phone: '',
    tickets: 1
  };
  eventTitle = ''; // 显示活动名称

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private registrationService: RegistrationService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    // 从路由参数获取活动ID
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.registration.event_id = eventId;

    // 加载活动名称（显示在表单中）
    this.eventService.getEventDetail(eventId).subscribe(event => {
      this.eventTitle = event.title;
    });
  }

  // 提交报名
  onSubmit() {
    this.registrationService.createRegistration(this.registration).subscribe({
      next: () => {
        alert('报名成功！我们会尽快与您联系~');
        this.router.navigate(['/event', this.registration.event_id]); // 跳转回活动详情页
      },
      error: (err) => {
        console.error('报名失败', err);
        alert('报名失败，请稍后再试');
      }
    });
  }
}