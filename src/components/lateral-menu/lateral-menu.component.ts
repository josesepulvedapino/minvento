import { Component } from '@angular/core';
import { MenuServiceService } from '../../app/services/menu-service.service';

@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrl: './lateral-menu.component.scss'
})
export class LateralMenuComponent {

  selectedOption: string = 'inicio';

  constructor (private menuService: MenuServiceService) {
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.menuService.updateSelectedOption(option);
  }

}
