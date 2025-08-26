import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

const baseApi = environment.apiUrl;

@Component({
  selector: 'app-auth',
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  mode: 'login' | 'signup' = 'login';
  authForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(data => {
      this.mode = data['mode'];
    })
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.http.post<{
        user: object;
        token: string
      }>(
        `${baseApi}/auth/${this.mode}`,
        this.authForm.value
      ).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Authentication failed';
        }
      });
    }
  }
}
