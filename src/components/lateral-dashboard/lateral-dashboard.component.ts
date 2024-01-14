import { Component } from '@angular/core';
import { MenuServiceService } from '../../app/services/menu-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lateral-dashboard',
  templateUrl: './lateral-dashboard.component.html',
  styleUrl: './lateral-dashboard.component.scss'
})
export class LateralDashboardComponent {
  selectedComponent: string = 'inicio';
  private subscription: Subscription;

  constructor (private menuService: MenuServiceService) {
    this.subscription = this.menuService.selectedOption$.subscribe(
      selectedOption => {
        this.selectedComponent = selectedOption;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
}
