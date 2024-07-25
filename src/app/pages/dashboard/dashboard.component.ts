import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCollectionComponent } from '../../components/product-collection/product-collection.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProductCollectionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
