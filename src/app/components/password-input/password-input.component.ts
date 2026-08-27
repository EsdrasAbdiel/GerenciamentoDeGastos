import { Component, ContentChild, AfterContentInit } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
	selector: 'app-password-input',
	standalone: true,
	imports: [IconButtonComponent],
	templateUrl: './password-input.component.html',
	styleUrl: './password-input.component.scss'
})
export class PasswordInputComponent implements AfterContentInit {

  @ContentChild(InputComponent) input!: InputComponent;

  showPassword = false;

  ngAfterContentInit() {
  	this.input.type = 'password';
  }

  togglePassword() {
  	this.showPassword = !this.showPassword;
  	this.input.type = this.showPassword ? 'number' : 'password';
  }
}
