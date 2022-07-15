import { TestBed } from '@angular/core/testing';

import { ScheduleManageService } from './schedule-manage.service';

describe('ScheduleManageService', () => {
  let service: ScheduleManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
