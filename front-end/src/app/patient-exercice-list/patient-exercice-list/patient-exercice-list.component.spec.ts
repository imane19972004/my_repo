import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientExerciceListComponent } from './patient-exercice-list.component';

describe('PatientExerciceListComponent', () => {
  let component: PatientExerciceListComponent;
  let fixture: ComponentFixture<PatientExerciceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientExerciceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientExerciceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
