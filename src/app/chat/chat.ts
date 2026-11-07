import {AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService, User} from '../_services/auth';
import {GroupByDatePipe} from '../_pipes/group-by-date-pipe';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

const {apiUrl} = environment;

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    GroupByDatePipe,
    DatePipe
  ],
  templateUrl: './chat.html',
  standalone: true,
  styleUrl: './chat.scss'
})
export class Chat implements OnInit, AfterViewInit, OnDestroy {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private mutationObserver?: MutationObserver;

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput?: ElementRef<HTMLInputElement>;
  private loginButton?: ElementRef<HTMLButtonElement>;

  @ViewChild('loginButton')
  set loginButtonElement(button: ElementRef<HTMLButtonElement> | undefined) {
    this.loginButton = button;

    if (button && !this.isLoggedIn) {
      setTimeout(() => button.nativeElement.focus({preventScroll: true}), 0);
    }
  }

  messages: any[] = [];
  newMessage: string = '';
  errorMessage: string | null = null;
  loading: boolean = true;
  get currentUser() {
    return this.authService.currentUser;
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    // this.authService.user$.subscribe(() => {
    //   // update UI when user state changes
    // });
    this.getMessages();
  }

  ngAfterViewInit() {
    if (this.messagesContainer) {
      // Scroll to bottom when new messages are added
      this.mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            this.scrollToBottom();
          }
        });
      });
      this.mutationObserver.observe(this.messagesContainer.nativeElement, { childList: true });
    }
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }

  getMessages() {
    this.http.get<any[]>(`${apiUrl}/`, {withCredentials: true}).subscribe({
      next: (data) => {
        this.messages = data;
        setTimeout(() => this.scrollToBottom(), 0);
        this.loading = false;
        this.focusLoginButton();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.focusLoginButton();
      }
    });
  }

  sendMessage() {
    if (!this.isLoggedIn) {
      this.openLogin();
      return;
    }

    this.http.post(`${apiUrl}/`, {
      content: this.newMessage
    }).subscribe({
      next: (data) => {
        this.messages.push(data);
        this.newMessage = '';
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
    this.focusLoginButton();
  }

  openLogin() {
    this.router.navigate(['/login']);
  }

  scrollToBottom() {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  private focusLoginButton() {
    if (!this.isLoggedIn) {
      setTimeout(() => {
        this.loginButton?.nativeElement.focus();
      }, 0);
    }
  }

  // onImgError(event: Event) {
  //   const img = event.target as HTMLImageElement;
  //   if (img) img.src = 'default-avatar.jpg';
  // }
}
