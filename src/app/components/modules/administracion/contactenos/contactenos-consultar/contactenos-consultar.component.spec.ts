import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactenosConsultarComponent } from './contactenos-consultar.component';

describe('ContactenosConsultarComponent', () => {
  let component: ContactenosConsultarComponent;
  let fixture: ComponentFixture<ContactenosConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactenosConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactenosConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
