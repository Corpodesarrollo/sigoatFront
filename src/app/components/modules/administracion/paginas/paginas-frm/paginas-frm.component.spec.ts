import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginasFrmComponent } from './paginas-frm.component';

describe('PaginasFrmComponent', () => {
  let component: PaginasFrmComponent;
  let fixture: ComponentFixture<PaginasFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginasFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginasFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
