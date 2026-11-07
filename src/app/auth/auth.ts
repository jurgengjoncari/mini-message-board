import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';
import {environment} from '../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, User} from '../_services/auth';

const baseApi = environment.apiUrl;
declare var google: any;

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth implements OnInit, AfterViewChecked {
  @Input() mode: 'login' | 'signup' = 'login';

  private readonly client_id = environment.googleClientId;
  private buttonRendered = false;
  authForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private location: Location
  ) {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: this.client_id,
      callback: () => {
        window.location.href = `${baseApi}/auth/google`
      }
    });
  }

  ngAfterViewChecked() {
    if (!this.buttonRendered) {
      this.renderGoogleButton();
    }
  }

  private renderGoogleButton() {
    const buttonElement = document.getElementById("googleBtn");
    if (buttonElement && !this.buttonRendered) {
      google.accounts.id.renderButton(buttonElement, {
        size: "large",
        logo_alignment: "center",
        width: buttonElement.offsetWidth,
        text: "continue_with"
      });
      this.buttonRendered = true;
    }
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.errorMessage = null;
    this.authForm.reset();
    this.buttonRendered = false; // Reset button state
  }

  close() {
    this.buttonRendered = false; // Reset button state
    this.location.back();
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.http.post<{
        user: User;
        token: string
      }>(`${baseApi}/auth/${this.mode}`, this.authForm.value)
        .subscribe({
          next: (res) => {
            this.authService.login(res.user, res.token);
            this.location.back();
          },
          error: (err) => {
            console.error();
            this.errorMessage = err.error?.message || 'Authentication failed';
          }
        });
    }
  }
}
