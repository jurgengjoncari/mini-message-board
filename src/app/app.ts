import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly baseUrl = environment.apiUrl;
  messages: any[] = [];
  private http = inject(HttpClient);
  newMessage: string = '';

  constructor() {
    this.getMessages();
  }

  getMessages() {
    this.http.get<any[]>(`${this.baseUrl}/`).subscribe({
      next: (data) => this.messages = data,
      error: (err) => console.error(err)
    });
  }

  sendMessage() {
    this.http.post(`${this.baseUrl}/`, {content: this.newMessage}).subscribe({
      next: (data) => {
        this.messages.push(data);
        this.newMessage = '';
      },
      error: (err) => console.error(err)
    });
  }
}
