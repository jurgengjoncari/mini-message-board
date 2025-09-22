import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../auth/auth';
import {GroupByDatePipe} from '../_pipes/group-by-date-pipe';
import {DatePipe} from '@angular/common';

interface Author {
  displayName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    Auth,
    GroupByDatePipe,
    DatePipe
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
  // token = localStorage.getItem('token');
  isLoggedIn = !!this.token;
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput?: ElementRef<HTMLInputElement>;
  errorMessage: string | null = null;
  loading: boolean = true;
  authVisible = false;
  authMode: 'login' | 'signup' = 'login';

  get currentUser() {
    const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
    return match ? JSON.parse(decodeURIComponent(match[2])) : null;
  }

  get token() {
    const match = document.cookie.match(new RegExp('(^| )jwt=([^;]+)'));
    return match ? match[2] : null;
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.http.get<any[]>(`${this.baseUrl}/`).subscribe({
      next: (data) => {
        this.messages = data;
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

  getAuthor({displayName, email, firstName, lastName, username}: Author) {
    return displayName
      || firstName && lastName && (firstName + ' ' + lastName)
      || username
      || email;
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
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    this.isLoggedIn = false;
  }

  scrollToBottom() {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  onLoginSuccess() {
    // this.token = localStorage.getItem('token');
    this.isLoggedIn = !!this.token;
    setTimeout(() => {
      this.messageInput?.nativeElement.focus();
    }, 0);
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/default-avatar.jpg';
    }
  }

  onInputFocus() {
    if (!this.isLoggedIn) {
      this.showLogin();
    }
  }
}
