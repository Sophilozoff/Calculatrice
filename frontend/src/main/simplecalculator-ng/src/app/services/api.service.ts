import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private clientToken;

    constructor(
        private http: HttpClient
    ) {
        this.generateClientToken();
     }

    generateClientToken() {
        this.clientToken = Math.random().toString(36);
    }

    private doRequest(method: string, urlSegment = '') {
        const endpointUrl = this.getEndpointUrl();
        const url = `${endpointUrl}${method}/${urlSegment}`;
        let headers = new HttpHeaders().set('client-token', this.clientToken);
        return this.http.get(url, {
            headers: headers
        });
    }

    public solveEquation(number1: number, number2: number, signSymbol: string) {
        const method = 'solve';
        const urlSegment = `${number1}/${signSymbol}/${number2}`;
        return this.doRequest(method, urlSegment);
    }

    public getEquationsHistory(page = 0) {
        const method = 'getHistory';
        const urlSegment = `${page}`;
        return this.doRequest(method, urlSegment);
    }

    private getEndpointUrl() {
        return environment.endpointUrl;
    }

}
