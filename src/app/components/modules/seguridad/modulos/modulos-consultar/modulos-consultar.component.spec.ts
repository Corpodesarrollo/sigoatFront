import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosConsultarComponent } from './modulos-consultar.component';

describe('ModulosConsultarComponent', () => {
  let component: ModulosConsultarComponent;
  let fixture: ComponentFixture<ModulosConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulosConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulosConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
