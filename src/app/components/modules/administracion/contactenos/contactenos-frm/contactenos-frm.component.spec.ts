import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactenosFrmComponent } from './contactenos-frm.component';

describe('ContactenosFrmComponent', () => {
  let component: ContactenosFrmComponent;
  let fixture: ComponentFixture<ContactenosFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactenosFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactenosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
