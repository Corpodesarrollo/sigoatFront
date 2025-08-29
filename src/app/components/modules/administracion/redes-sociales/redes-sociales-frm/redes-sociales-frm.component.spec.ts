import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedesSocialesFrmComponent } from './redes-sociales-frm.component';

describe('RedesSocialesFrmComponent', () => {
  let component: RedesSocialesFrmComponent;
  let fixture: ComponentFixture<RedesSocialesFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedesSocialesFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedesSocialesFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
