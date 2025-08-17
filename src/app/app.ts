import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly baseUrl = environment.apiUrl;
  messages: any[] = [];
  private http = inject(HttpClient);

  constructor() {
    this.getMessages();
  }

  getMessages() {
    this.http.get<any[]>(`${this.baseUrl}/`).subscribe({
      next: (data) => this.messages = data,
      error: (err) => console.error(err)
    });
  }
}
