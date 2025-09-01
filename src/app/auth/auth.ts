import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

const baseApi = environment.apiUrl;

@Component({
  selector: 'app-auth',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  @Input() visible = false;
  @Input() mode: 'login' | 'signup' = 'login';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() modeChange = new EventEmitter<'login' | 'signup'>();
  @Output() loginSuccess = new EventEmitter<void>();

  authForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.modeChange.emit(this.mode);
    this.errorMessage = null;
    this.authForm.reset();
  }

  close() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.http.post<{
        user: object;
        token: string
      }>(`${baseApi}/auth/${this.mode}`, this.authForm.value)
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.visible = false;
            this.visibleChange.emit(false);
            this.loginSuccess.emit();
            // this.router.navigate(['/']);
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = err.error?.message || 'Authentication failed';
          }
        });
    }
  }
}
