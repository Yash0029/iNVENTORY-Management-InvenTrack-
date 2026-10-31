import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {

    this.error = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    )
      .subscribe({

        next: (user) => {

          localStorage.setItem(
            'currentUser',
            JSON.stringify(user)
          );

          this.router.navigate(['/dashboard']).then(() => this.cdr.markForCheck());
        },

        error: (err) => {

          this.error = typeof err.error === 'string' ? err.error : err.error?.message || 'Invalid email or password.';
        }

      });
  }
}
