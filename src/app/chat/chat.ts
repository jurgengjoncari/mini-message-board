import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../auth/auth';
import {groupByDate} from '../_utils/helpers';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    Auth
  ],
  templateUrl: './chat.html',
  standalone: true,
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {
  protected readonly baseUrl = environment.apiUrl;
  messages: any[] = [];
  private http = inject(HttpClient);
  newMessage: string = '';
  token = localStorage.getItem('token');
  isLoggedIn = !!this.token;
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  errorMessage: string | null = null;
  loading: boolean = true;
  authVisible = false;
  authMode: 'login' | 'signup' = 'login';

  get currentUserId() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.http.get<any[]>(`${this.baseUrl}/`).subscribe({
      next: (data) => {
        this.messages = groupByDate(data);
        setTimeout(() => this.scrollToBottom(), 0);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  sendMessage() {
    this.http.post(`${this.baseUrl}/`, {
      content: this.newMessage
    }, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).subscribe({
      next: (data) => {
        this.messages.push(data);
        this.newMessage = '';
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to send message. Please try again.';
      }
    });
  }

  showLogin() {
    this.authMode = 'login';
    this.authVisible = true;
  }

  showSignup() {
    this.authMode = 'signup';
    this.authVisible = true;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
  }

  scrollToBottom() {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  onLoginSuccess() {
    this.token = localStorage.getItem('token');
    this.isLoggedIn = !!this.token;
  }
}
