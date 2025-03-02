import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingSessionPage } from './training-session.page';

describe('TrainingSessionPage', () => {
  let component: TrainingSessionPage;
  let fixture: ComponentFixture<TrainingSessionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
