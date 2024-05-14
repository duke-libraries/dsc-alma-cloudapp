import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationLogsComponent } from './integration-logs.component';

describe('IntegrationLogsComponent', () => {
  let component: IntegrationLogsComponent;
  let fixture: ComponentFixture<IntegrationLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
