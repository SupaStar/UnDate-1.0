import { TestBed } from '@angular/core/testing';

import { ApisExternasService } from './apis-externas.service';

describe('ApisExternasService', () => {
  let service: ApisExternasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApisExternasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
