import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidosConsultarComponent } from './contenidos-consultar.component';

describe('ContenidosConsultarComponent', () => {
  let component: ContenidosConsultarComponent;
  let fixture: ComponentFixture<ContenidosConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidosConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidosConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
