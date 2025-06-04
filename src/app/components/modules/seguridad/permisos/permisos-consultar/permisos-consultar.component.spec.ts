import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosConsultarComponent } from './permisos-consultar.component';

describe('PermisosConsultarComponent', () => {
  let component: PermisosConsultarComponent;
  let fixture: ComponentFixture<PermisosConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisosConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisosConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
