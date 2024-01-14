import { Component } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.scss'
})
export class AgregarProductoComponent {
  model: NgbDateStruct = { year: 0, month: 0, day: 0 };

  constructor(public activeModal: NgbActiveModal) {
  }

  closeModalAgregarProducto() {
    this.activeModal.close();
  }

}
