import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  imports: [NgIf],
  standalone: true,
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss'
})
export class LoadingSkeletonComponent implements OnInit {
    @Input() loading: boolean = true;

  ngOnInit(): void {
    console.log(this.loading);
    ;
  }
}
