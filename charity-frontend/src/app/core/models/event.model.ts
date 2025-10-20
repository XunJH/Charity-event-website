export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string; // 格式："YYYY-MM-DD"
  location: string;
  goal_amount: number;
  raised_amount: number;
  category_id: number;
  category_name: string;
  registrations?: Registration[]; // 活动详情包含的报名列表
}

export interface Registration {
  id?: number;
  event_id: number;
  user_name: string;
  email: string;
  phone: string;
  tickets: number;
  registration_date?: string;
}

export interface Category {
  id: number;
  name: string;
}