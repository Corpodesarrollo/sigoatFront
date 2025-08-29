import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeSectionComponent } from './notice-section.component';

describe('NoticeSectionComponent', () => {
  let component: NoticeSectionComponent;
  let fixture: ComponentFixture<NoticeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
