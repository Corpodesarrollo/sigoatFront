import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidosFrmComponent } from './contenidos-frm.component';

describe('ContenidosFrmComponent', () => {
  let component: ContenidosFrmComponent;
  let fixture: ComponentFixture<ContenidosFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidosFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
