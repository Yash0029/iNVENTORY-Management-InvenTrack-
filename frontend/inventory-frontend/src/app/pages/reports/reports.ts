import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { InventoryService } from '../../services/inventory';
import { ProductService } from '../../services/product';
import { WarehouseService } from '../../services/warehouse';
import { OrderService } from '../../services/order';

@Component({ selector: 'app-reports', standalone: true, imports: [CommonModule], templateUrl: './reports.html', styleUrl: './reports.css' })
export class Reports {
  reportCards = [
    { title: 'Inventory Report', description: 'Export quantities and minimum-stock levels.', icon: '📦', type: 'inventory' },
    { title: 'Sales Report', description: 'Export customer orders and order values.', icon: '📊', type: 'orders' },
    { title: 'Low Stock Report', description: 'Export items needing a replenishment.', icon: '⚠', type: 'low-stock' },
    { title: 'Warehouse Report', description: 'Export storage locations and managers.', icon: '🏢', type: 'warehouses' }
  ];
  summary = { products: 0, warehouses: 0, transfers: 0, orders: 0 };
  private readonly inventory = inject(InventoryService);
  private readonly products = inject(ProductService);
  private readonly warehouses = inject(WarehouseService);
  private readonly orders = inject(OrderService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() { this.loadSummary(); }

  export(type: string): void {
    forkJoin({ inventory: this.inventory.getInventory(), products: this.products.getProducts(), warehouses: this.warehouses.getWarehouses(), orders: this.orders.getOrders() })
      .subscribe({ next: data => {
        const productName = new Map(data.products.map(item => [item.id, item.name]));
        let rows: (string | number)[][];
        if (type === 'orders') rows = [['Order ID', 'Customer', 'Email', 'Amount', 'Status'], ...data.orders.map(item => [item.id || '', item.customerName, item.customerEmail, item.totalAmount, item.status])];
        else if (type === 'warehouses') rows = [['Warehouse ID', 'Name', 'Location', 'Manager'], ...data.warehouses.map(item => [item.id || '', item.name, item.location, item.manager])];
        else {
          const filtered = type === 'low-stock' ? data.inventory.filter(item => item.quantity <= item.minimumStock) : data.inventory;
          rows = [['Product', 'Warehouse ID', 'Quantity', 'Minimum Stock'], ...filtered.map(item => [productName.get(item.productId) || item.productId, item.warehouseId, item.quantity, item.minimumStock])];
        }
        const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `${type}-report.csv`; link.click(); URL.revokeObjectURL(link.href);
      }, error: () => {} });
  }

  private loadSummary(): void {
    forkJoin({ products: this.products.getProducts(), warehouses: this.warehouses.getWarehouses(), orders: this.orders.getOrders(), inventory: this.inventory.getInventory() })
      .subscribe({ next: data => { this.summary = { products: data.products.length, warehouses: data.warehouses.length, transfers: data.inventory.length, orders: data.orders.length }; this.cdr.markForCheck(); }, error: () => this.cdr.markForCheck() });
  }
}
