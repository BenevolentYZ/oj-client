import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
// import { PROBLEMS } from '../mock-problems';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //problems: Problem[] = PROBLEMS;
  private _problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private httpClient: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    this.httpClient.get('problems')
      .toPromise()
      .then((res: any) => {
        this._problemSource.next(res);
      })
      .catch(this.handleError);

      return this._problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.httpClient.get(`problems/${id}`)
    .toPromise()
    .then((res: any) => res)
    .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}
    return this.httpClient.post('problems', problem, options)
                .toPromise()
                .then((res: any) => {
                  this.getProblems();
                  return res;
                })
                .catch(this.handleError);
  }

  buildAndRun(data): Promise<any> {
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.httpClient.post('build_and_run', data, options)
                .toPromise()
                .then((res: any) => {
                  console.log(res);
                  return res;
                })
                .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
  // getProblems(): Problem[] {
  //   return this.problems;
  // }

  // getProblem(id: number): Problem {
  //   return this.problems.find( (problem) => problem.id === id);
  // }

  // addProblem(problem: Problem) {
  //   problem.id = this.problems.length + 1;
  //   this.problems.push(problem);
  // }
}