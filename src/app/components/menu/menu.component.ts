import { Component, inject, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { MatDrawerContainer, MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatToolbarModule, IconButtonComponent, MatDrawerContainer, MatSidenavModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() tituloSnackbar: string = 'Gerenciamento de Gastos'
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);

  deveFazerLogout() {
    this.authService.logout().pipe().subscribe({
      next: () => {
        localStorage.clear();
        sessionStorage.clear();

        this.router.navigate(['/auth/login'])

      },
      error: (err) => {
        console.error('Erro ao deslogar', err);
        this.snackbarService.error('Erro ao deslogar');
        this.router.navigate(['/auth/login'])

      }
    })
  }

}
