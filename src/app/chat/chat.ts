import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-chat',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
  }

  scrollToBottom() {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
