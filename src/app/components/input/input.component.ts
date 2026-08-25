import { NgTemplateOutlet } from '@angular/common';
import { Component, forwardRef, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-input',
	standalone: true,
	imports: [NgTemplateOutlet, ReactiveFormsModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true
		},
	],
	templateUrl: './input.component.html',
	styleUrl: './input.component.scss'
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() error?: TemplateRef<unknown>;
  @Input() mask!: string;

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
  	this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
  	this.onChange = fn;
  }

  registerOnTouched(fn:  () => void): void {
  	this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  	this.disabled = isDisabled;
  }

  onInput(event: Event) {
  	const input = event.target as HTMLInputElement;
  	this.value = input.value;
  	this.onChange(this.value);
  	this.onTouched();
  }
}
