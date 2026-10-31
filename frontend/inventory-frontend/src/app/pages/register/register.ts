import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({ selector: 'app-register', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './register.html', styleUrl: './register.css' })
export class Register {
  name = ''; email = ''; password = ''; confirmPassword = ''; role = 'VIEWER'; loading = false; error = ''; success = '';
  readonly roles = ['VIEWER', 'INVENTORY_MANAGER', 'SALES_MANAGER', 'ADMIN'];
  private readonly auth = inject(AuthService); private readonly router = inject(Router);
  register(): void {
    this.error = ''; this.success = '';
    if (!this.name.trim() || !this.email.trim() || !this.password) { this.error = 'Name, email, and password are required.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(this.email)) { this.error = 'Enter a valid email address.'; return; }
    if (this.password.length < 8) { this.error = 'Password must contain at least 8 characters.'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Password confirmation does not match.'; return; }
    this.loading = true;
    this.auth.register({ name: this.name.trim(), email: this.email.trim(), password: this.password, role: this.role }).subscribe({
      next: () => { this.loading = false; this.success = 'Account created. Redirecting you to sign in…'; setTimeout(() => this.router.navigate(['/login']), 1200); },
      error: err => { this.loading = false; this.error = typeof err.error === 'string' ? err.error : err.error?.message || 'Unable to create your account.'; }
    });
  }
}
