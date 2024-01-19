import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private showToastSource = new Subject<string>();
  showToast$ = this.showToastSource.asObservable();

  showSuccess(message: string) {
    this.showToastSource.next(`success:${message}`);
  }

  showError(message: string) {
    this.showToastSource.next(`error:${message}`);
  }
}
