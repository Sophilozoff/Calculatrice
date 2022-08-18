import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule], 
        providers: [ApiService]
    }));

    it('should be created', () => {
     const service: ApiService = TestBed.get(ApiService);
     expect(service).toBeTruthy();
    });

    it('should have solveEquation function', () => {
     const service: ApiService = TestBed.get(ApiService);
     expect(service.solveEquation).toBeTruthy();
    });

    it('should have getEquationsHistory function', () => {
     const service: ApiService = TestBed.get(ApiService);
     expect(service.getEquationsHistory).toBeTruthy();
    });


});
