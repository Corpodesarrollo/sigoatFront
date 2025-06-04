import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginasConsultarComponent } from './paginas-consultar.component';

describe('PaginasConsultarComponent', () => {
  let component: PaginasConsultarComponent;
  let fixture: ComponentFixture<PaginasConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginasConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginasConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
