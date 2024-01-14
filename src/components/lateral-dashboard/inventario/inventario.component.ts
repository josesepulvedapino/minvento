import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarProductoComponent } from '../../modals/agregar-producto/agregar-producto.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent {

  constructor(private modalService: NgbModal) {

  }

  openModalAgregarProducto() {
    this.modalService.open(AgregarProductoComponent, {centered: true});
  }

}
