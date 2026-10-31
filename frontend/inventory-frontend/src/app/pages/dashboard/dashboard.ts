import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Product, ProductService } from '../../services/product';
import { Inventory, InventoryService } from '../../services/inventory';
import { Order, OrderService } from '../../services/order';
import { Warehouse, WarehouseService } from '../../services/warehouse';

@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './dashboard.html', styleUrl: './dashboard.css' })
export class Dashboard {
  stats = [
    { title: 'Total Products', value: '0', change: 'Live', icon: '📦' },
    { title: 'Inventory Value', value: '₹0', change: 'Live', icon: '₹' },
    { title: 'Low Stock Items', value: '0', change: 'Action needed', icon: '⚠' },
    { title: 'Pending Orders', value: '0', change: 'Live', icon: '▱' }
  ];
  recentOrders: { id: string; customer: string; amount: string; status: string }[] = [];
  lowStock: { product: string; sku: string; stock: number; minimum: number }[] = [];
  warehouseStock: { name: string; quantity: number }[] = [];
  totalUnits = 0;
  private readonly products = inject(ProductService);
  private readonly inventory = inject(InventoryService);
  private readonly orders = inject(OrderService);
  private readonly warehouses = inject(WarehouseService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() { this.loadDashboard(); }

  private loadDashboard(): void {
    forkJoin({ products: this.products.getProducts(), inventory: this.inventory.getInventory(), orders: this.orders.getOrders(), warehouses: this.warehouses.getWarehouses() })
      .subscribe({ next: data => { this.populate(data.products, data.inventory, data.orders, data.warehouses); this.cdr.markForCheck(); }, error: () => this.cdr.markForCheck() });
  }

  private populate(products: Product[], inventory: Inventory[], orders: Order[], warehouses: Warehouse[]): void {
    const productById = new Map(products.map(product => [product.id, product]));
    this.totalUnits = inventory.reduce((sum, record) => sum + record.quantity, 0);
    const value = inventory.reduce((sum, record) => sum + record.quantity * (productById.get(record.productId)?.price || 0), 0);
    this.lowStock = inventory.filter(record => record.quantity <= record.minimumStock).map(record => {
      const product = productById.get(record.productId);
      return { product: product?.name || `Product #${record.productId}`, sku: product?.sku || '—', stock: record.quantity, minimum: record.minimumStock };
    });
    this.stats[0].value = String(products.length);
    this.stats[1].value = `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    this.stats[2].value = String(this.lowStock.length);
    this.stats[3].value = String(orders.filter(order => ['PENDING', 'PROCESSING', 'Pending', 'Processing'].includes(order.status)).length);
    this.recentOrders = orders.slice(-5).reverse().map(order => ({ id: `#ORD-${order.id}`, customer: order.customerName, amount: `₹${order.totalAmount.toLocaleString('en-IN')}`, status: order.status }));
    this.warehouseStock = warehouses.map(warehouse => ({ name: warehouse.name, quantity: inventory.filter(record => record.warehouseId === warehouse.id).reduce((sum, record) => sum + record.quantity, 0) }));
  }
}
