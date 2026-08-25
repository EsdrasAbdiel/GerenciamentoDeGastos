
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading-skeleton',
	imports: [],
	standalone: true,
	templateUrl: './loading-skeleton.component.html',
	styleUrl: './loading-skeleton.component.scss'
})
export class LoadingSkeletonComponent {
    @Input() loading = true;
}
