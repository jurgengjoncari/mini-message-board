import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService, User} from '../_services/auth';
import {Auth} from '../auth/auth';
import {GroupByDatePipe} from '../_pipes/group-by-date-pipe';
import {DatePipe} from '@angular/common';

const {apiUrl} = environment;

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
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput?: ElementRef<HTMLInputElement>;

  messages: any[] = [];
  newMessage: string = '';
  errorMessage: string | null = null;
  loading: boolean = true;
  authVisible = false;
  authMode: 'login' | 'signup' = 'login';

  get currentUser() {
    return this.authService.currentUser;
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.authService.user$.subscribe(() => {
      // update UI when user state changes
    });
    this.getMessages();
  }

  getMessages() {
    this.http.get<any[]>(`${apiUrl}/`, {withCredentials: true}).subscribe({
      next: (data) => {
        this.messages = data;
        setTimeout(() => this.scrollToBottom(), 0);
        this.loading = false;
      },
      error: (err) => console.error(err)
    });
  }

  sendMessage() {
    this.http.post(`${apiUrl}/`, {content: this.newMessage}, {withCredentials: true}).subscribe({
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

  getAuthor({displayName, email, firstName, lastName, username}: User) {
    return displayName
      || firstName && lastName && (firstName + ' ' + lastName)
      || username
      || email;
  }

  logout() {
    this.authService.logout();
  }

  scrollToBottom() {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  onLoginSuccess() {
    setTimeout(() => {
      this.messageInput?.nativeElement.focus();
    }, 0);
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) img.src = 'default-avatar.jpg';
  }

  onInputFocus() {
    if (!this.isLoggedIn) this.authVisible = true;
  }
}
