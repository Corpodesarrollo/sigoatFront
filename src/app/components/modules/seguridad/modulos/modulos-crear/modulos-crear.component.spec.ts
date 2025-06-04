import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosCrearComponent } from './modulos-crear.component';

describe('ModulosCrearComponent', () => {
  let component: ModulosCrearComponent;
  let fixture: ComponentFixture<ModulosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulosCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
