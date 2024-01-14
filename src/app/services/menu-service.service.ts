import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {

  private selectedOptionSource = new Subject<string>();

  selectedOption$ = this.selectedOptionSource.asObservable();

  updateSelectedOption(option: string) {
    this.selectedOptionSource.next(option);
  }

  constructor() { }
}
