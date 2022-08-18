import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';

import { ApiService } from '../../services/api.service';

import { of } from 'rxjs';

class MockApiService {
    getEquationsHistory(el) {
        return {
            toPromise() {
                return Promise.resolve([]);
            }
        };
    }
    solveEquation(n1,n2,sign) {
        return {
            toPromise() {
                return Promise.resolve({result: 8});
            }
        };
    }
}

describe('CalculatorComponent', () => {
    let component: CalculatorComponent;
    let fixture: ComponentFixture<CalculatorComponent>;

    let mockApiService: MockApiService = new MockApiService();

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ CalculatorComponent ],
        providers: [ { provide: ApiService, useValue: mockApiService } ]
      })
      .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(CalculatorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('has 17 buttons', () => {
        const buttons = fixture.nativeElement.getElementsByTagName('button');

        expect(buttons.length).toEqual(17);
    });

    it('has 1 display', () => {
        const display = fixture.nativeElement.querySelector('.text-field.w-input');

        expect(display).toBeTruthy();
    });

    it('compose digits on UI', async () => {
        const button7 = fixture.nativeElement.getElementsByTagName('button')[2].click();
        await new Promise((res, rej) => setTimeout( () => {res(true); } , 500 ));
        const display = fixture.nativeElement.querySelector('.text-field.w-input');

        return expect(display.value).toEqual('');
    });

    it('compose equation', () => {
        component.digitNumber('5');
        component.digitSign('+');
        component.digitNumber('8');
        
        expect(component.upperScreenValue).toEqual('5 +');
        expect(component.screenValue).toEqual('8');
    });

    it('compose equation and get result', async () => {
        let spy = spyOn(mockApiService, 'solveEquation')
                    .and.returnValue(of({solution: 8}));

        component.digitNumber('5');
        component.digitSign('+');
        component.digitNumber('8');
        component.getResult();

        expect(component.upperScreenValue).toEqual('5 + 8');
        return expect(component.screenValue).toEqual('');
    });
});
