import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridAcoesComponent } from './grid-acoes.component';

interface TesteRow {
  id: number;
  nome: string;
}

// ARRANGE
// ↓
// prepara o cenário

// ACT
// ↓
// executa o comportamento

// ASSERT
// ↓
// verifica o resultado

const row = {
  id: 1,
  nome: 'teste'
}

describe('GridAcoesComponent', () => {
  let component: GridAcoesComponent<TesteRow>;
  let fixture: ComponentFixture<GridAcoesComponent<TesteRow>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridAcoesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(
      GridAcoesComponent<TesteRow>
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com linhaClicavel como false', () => {
    expect(component.linhaClicavel).toBeFalse();
  });

  it('deve habilitar linhaClicavel, se atribuido true', () => {
    component.dados = [row];
    component.linhaClicavel = true;

    fixture.detectChanges();

    const linha = fixture.nativeElement.querySelector('tr[mat-row]');

    expect(linha.classList.contains('cursor-pointer')).toBeTrue();
  })
});
