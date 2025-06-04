import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginasCrearComponent } from './paginas-crear.component';

describe('PaginasCrearComponent', () => {
  let component: PaginasCrearComponent;
  let fixture: ComponentFixture<PaginasCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginasCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginasCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
