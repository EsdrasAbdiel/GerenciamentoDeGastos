
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading-skeleton-dashboard',
	standalone: true,
	imports: [],
	templateUrl: './loading-skeleton-dashboard.component.html',
	styleUrl: './loading-skeleton-dashboard.component.scss'
})
export class LoadingSkeletonDashboardComponent {
  @Input() loading = false;

}
