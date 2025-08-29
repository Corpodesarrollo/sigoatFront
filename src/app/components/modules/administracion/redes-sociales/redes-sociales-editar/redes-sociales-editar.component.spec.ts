import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedesSocialesEditarComponent } from './redes-sociales-editar.component';

describe('RedesSocialesEditarComponent', () => {
  let component: RedesSocialesEditarComponent;
  let fixture: ComponentFixture<RedesSocialesEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedesSocialesEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedesSocialesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
