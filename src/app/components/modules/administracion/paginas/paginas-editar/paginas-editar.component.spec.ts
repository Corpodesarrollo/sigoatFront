import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginasEditarComponent } from './paginas-editar.component';

describe('PaginasEditarComponent', () => {
  let component: PaginasEditarComponent;
  let fixture: ComponentFixture<PaginasEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginasEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
