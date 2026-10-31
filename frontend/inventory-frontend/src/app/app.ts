import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter, forkJoin } from 'rxjs';
import { AuthService, User } from './services/auth';
import { InventoryService } from './services/inventory';
import { OrderService } from './services/order';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  sidebarCollapsed = false;
  darkMode = false;
  isLoginPage = false;
  currentUser: User | null = null;
  searchTerm = '';
  notificationsOpen = false;
  notifications: { message: string; type: string }[] = [];
  notificationsRead = false;
  readonly searchItems = [
    { label: 'Dashboard', route: '/dashboard' }, { label: 'Inventory', route: '/inventory' },
    { label: 'Stock Transfers', route: '/stock-transfers' }, { label: 'Orders', route: '/orders' },
    { label: 'Fulfillment', route: '/fulfillment' }, { label: 'Reports', route: '/reports' },
    { label: 'Products', route: '/products' }, { label: 'Categories', route: '/categories' },
    { label: 'Suppliers', route: '/suppliers' }, { label: 'Warehouses', route: '/warehouses' }
  ];
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly inventoryService = inject(InventoryService);
  private readonly orderService = inject(OrderService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.isLoginPage = this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
    this.darkMode = typeof localStorage !== 'undefined' && localStorage.getItem('theme') === 'dark';
    this.refreshSession();
    this.notificationsRead = typeof localStorage !== 'undefined' && localStorage.getItem('notificationsRead') === 'true';
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isLoginPage = this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
      this.refreshSession();
      if (!this.isLoginPage) this.loadNotifications();
    });
    if (!this.isLoginPage) this.loadNotifications();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed =
      !this.sidebarCollapsed;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    if (typeof localStorage !== 'undefined') localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  toggleNotifications(): void { this.notificationsOpen = !this.notificationsOpen; }
  closePanels(): void { this.sidebarCollapsed = true; this.notificationsOpen = false; }
  markNotificationsRead(): void { this.notificationsRead = true; localStorage.setItem('notificationsRead', 'true'); }
  get hasUnreadNotifications(): boolean { return this.notifications.length > 0 && !this.notificationsRead; }

  get initials(): string { return this.currentUser?.name?.trim().charAt(0).toUpperCase() || 'I'; }
  get searchResults() { const term = this.searchTerm.trim().toLowerCase(); return term ? this.searchItems.filter(item => item.label.toLowerCase().includes(term)) : []; }

  openSearchResult(route: string): void { this.searchTerm = ''; this.router.navigate([route]); }

  private loadNotifications(): void {
    forkJoin({ inventory: this.inventoryService.getInventory(), orders: this.orderService.getOrders() }).subscribe({
      next: data => { this.notifications = [
        ...data.inventory.filter(item => item.quantity <= item.minimumStock).map(item => ({ type: 'warning', message: `Low stock: product #${item.productId} has ${item.quantity} units.` })),
        ...data.orders.filter(order => ['PENDING', 'PROCESSING', 'Pending', 'Processing'].includes(order.status)).map(order => ({ type: 'info', message: `Order #${order.id} is ${order.status.toLowerCase()}.` }))
      ]; this.cdr.markForCheck(); },
      error: () => { this.notifications = []; this.cdr.markForCheck(); }
    });
  }

  private refreshSession(): void { this.currentUser = this.authService.currentUser(); }

}
