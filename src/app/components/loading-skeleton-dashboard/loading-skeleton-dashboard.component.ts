import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton-dashboard',
  standalone: true,
  imports: [NgIf],
  templateUrl: './loading-skeleton-dashboard.component.html',
  styleUrl: './loading-skeleton-dashboard.component.scss'
})
export class LoadingSkeletonDashboardComponent implements OnInit {
  @Input() loading: boolean = false;

  ngOnInit(): void {
    console.log(this.loading);

  }

}
