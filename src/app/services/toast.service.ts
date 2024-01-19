import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private showToastSource = new Subject<string>();
  showToast$ = this.showToastSource.asObservable();

  showSuccess(message: string) {
    console.log('showSuccess called with message:', message);
    this.showToastSource.next(`success:${message}`);
  }
  
  showError(message: string) {
    console.log('showError called with message:', message);
    this.showToastSource.next(`error:${message}`);
  }
  
}
