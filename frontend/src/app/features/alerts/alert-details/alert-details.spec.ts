import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertDetails } from './alert-details';

describe('AlertDetails', () => {
  let component: AlertDetails;
  let fixture: ComponentFixture<AlertDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
