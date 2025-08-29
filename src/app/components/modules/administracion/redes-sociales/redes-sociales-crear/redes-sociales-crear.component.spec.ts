import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedesSocialesCrearComponent } from './redes-sociales-crear.component';

describe('RedesSocialesCrearComponent', () => {
  let component: RedesSocialesCrearComponent;
  let fixture: ComponentFixture<RedesSocialesCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedesSocialesCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedesSocialesCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
