import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { MatDrawerContainer, MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatToolbarModule, IconButtonComponent, MatDrawerContainer, MatSidenavModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private router = inject(Router)

  aoClicarDeveRedirecionarParaLogin() {
    this.router.navigate(['/login'])
  }

}
