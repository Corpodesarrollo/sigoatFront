import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosEditarComponent } from './modulos-editar.component';

describe('ModulosEditarComponent', () => {
  let component: ModulosEditarComponent;
  let fixture: ComponentFixture<ModulosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulosEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
