import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api.service';

import { Equation } from '../../models/equation';

import { faCaretSquareLeft, faCaretSquareRight, faEraser, faSpinner } from '@fortawesome/free-solid-svg-icons';

export const HISTORY_PAGE_SIZE = 1;

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.scss'],
    host: {
        '(document:keypress)': 'handleKeyboardEvents($event)'
    }
})
export class CalculatorComponent implements OnInit {

    public screenValue: string = '';
    public upperScreenValue: string = '';

    private state: State = State.FirstNumber;

    private number1 = null;
    private number2 = null;
    private sign = null;

    public faCaretSquareLeft = faCaretSquareLeft;
    public faCaretSquareRight = faCaretSquareRight;
    public faEraser = faEraser;
    public faSpinner = faSpinner;

    public history = [];
    public currentHistoryShown = -1;
    public isLastHistoryElementShown = false;

    constructor(
        private api: ApiService
    ) {}

    ngOnInit(): void {
        this.loadHistoryNextElement();
    }

    public digitNumber(number: string){
        if ( this.state == State.Result ) {
            this.reset();
        } 
        this.screenValue += number;
    }

    public digitMinus() {
        if ( this.screenValue == '' ) {
            this.screenValue = '-';
        } else {
            this.digitSign('-');
        }
    }

    public digitSign(sign: string) {
        if ( this.screenValue == '' ) {
            return;
        }
        this.number1 = parseInt(this.screenValue);
        this.upperScreenValue = this.number1 + ' ' + sign;
        this.screenValue = '';
        this.sign = sign;
        this.state = State.SecondNumber;
    }

    public getResult() {
        if ( this.screenValue == '' ) {
            return;
        }
        this.number2 = parseInt(this.screenValue);
        this.upperScreenValue += ' ' + this.number2;
        this.screenValue = '';
        this.elaborateResult();
    }

    public reset() {
        this.state = State.FirstNumber;
        this.screenValue = '';
        this.upperScreenValue = '';
        this.number1 = null;
        this.number2 = null;
        this.sign = null;
        this.resetHistoryNavigation();
    }


    public isSignButtonsEnabled() {
        return this.state == State.FirstNumber || this.state == State.Result;// && this.state != State.Loading;
    }

    public isMinusButtonEnabled() {
        return this.isSignButtonsEnabled() || this.state == State.SecondNumber;
    }

    public isResultButtonEnabled() {
        return this.state == State.SecondNumber;// && this.state != State.Loading;
    }

    public isLoadingVisible() {
        return this.state == State.Loading;
    }

    private async elaborateResult() {
        // mock
        this.state = State.Loading;
        const signSymbol = SignSymbols[this.sign];
        // await new Promise( resolve => setTimeout(resolve, 500) );
        try {
            const equationObj: any = await this.api.solveEquation(this.number1, this.number2, signSymbol).toPromise();
            const equation: Equation = equationObj;
            this.state = State.Result;
            this.history = [];
            this.showResult(equation);
        } catch(error) {
            alert('API Server error');
            this.reset();
        }
    }

    private showResult(equation: Equation) {
        this.screenValue = equation.result + '';
    }


    public handleKeyboardEvents(keyPress: KeyboardEvent) {
        let key = keyPress.key;
        switch (key) {
            case '0': this.digitNumber(key); break;
            case '1': this.digitNumber(key); break;
            case '2': this.digitNumber(key); break;
            case '3': this.digitNumber(key); break;
            case '4': this.digitNumber(key); break;
            case '5': this.digitNumber(key); break;
            case '6': this.digitNumber(key); break;
            case '7': this.digitNumber(key); break;
            case '8': this.digitNumber(key); break;
            case '9': this.digitNumber(key); break;
            case '+': this.digitSign(key); break;
            case '-': this.digitSign(key); break;
            case '*': this.digitSign(key); break;
            case '/': this.digitSign(key); break;
            case '=': this.getResult(); break;
            case 'Enter': this.getResult(); break;
        }
    }

    // Equation history and pagination handling
    
    public async showHistoryPrevious() {
        if ( !this.isPreviousHistoryEnabled() ) {
            return;
        }
        let isMoreElementToShow = true;
        if ( this.currentHistoryShown + 1 > this.history.length - 1 ) {
            this.state = State.Loading;
            isMoreElementToShow = await this.loadHistoryNextElement();
            this.state = State.Result;
        } 
        if ( isMoreElementToShow ) {
            this.currentHistoryShown++;
            this.showHistoryEquation();
        } else {
            this.isLastHistoryElementShown = true;
        }
    }

    public isPreviousHistoryEnabled() {
        return this.history && Array.isArray(this.history) 
            && !this.isLastHistoryElementShown;
    }

    public showHistoryNext() {
        if ( !this.isNextHistoryEnabled() || this.currentHistoryShown == 0 ) {
            this.reset();
            return;
        }
        this.state = State.Result;
        this.currentHistoryShown--;
        this.isLastHistoryElementShown = false;
        this.showHistoryEquation();
    }

    public isNextHistoryEnabled() {
        return this.history && this.history.length > 0 && 
            this.currentHistoryShown >= 0;
    }

    private showHistoryEquation() {
        const equation = this.history[this.currentHistoryShown];
        const symbol = Object.keys(SignSymbols).find(key => SignSymbols[key] === equation.signSymbol);
        this.upperScreenValue = equation.number1 + ' ' + symbol + ' ' + equation.number2;
        this.screenValue = equation.result;
    }

    private loadHistoryNextElement() : Promise<boolean> {
        const elementToLoad = this.currentHistoryShown + 1;
        return this.api.getEquationsHistory(elementToLoad).toPromise()
            .then((historySlice: Equation[] )=> {
                if ( !historySlice || historySlice.length == 0 ) {
                    return false;
                }
                this.history[elementToLoad] = historySlice[0];
                return true;
            });
    }

    private resetHistoryNavigation() {
        this.currentHistoryShown = -1;
        this.isLastHistoryElementShown = false;
    }

}

export enum State {
    FirstNumber,
    SecondNumber,
    Result,
    Loading
};

export const SignSymbols = {
    '+': '+',
    '-': '-',
    'x': 'x',
    '/': ':'
};