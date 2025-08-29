import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedesSocialesConsultarComponent } from './redes-sociales-consultar.component';

describe('RedesSocialesConsultarComponent', () => {
  let component: RedesSocialesConsultarComponent;
  let fixture: ComponentFixture<RedesSocialesConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedesSocialesConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedesSocialesConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
