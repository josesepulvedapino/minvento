import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarProductoComponent } from '../../modals/agregar-producto/agregar-producto.component';
import { ProductosService } from '../../../app/services/productos.service';
import { Producto } from '../../../app/interfaces/producto';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent implements OnInit {
  productos: Producto[]
  isLoaded: boolean = false;

  constructor(private modalService: NgbModal, private productosService: ProductosService) {
    this.productos = [];
  }

  openModalAgregarProducto() {
    this.modalService.open(AgregarProductoComponent, {centered: true});
  }

  ngOnInit() {
    this.productosService.getProductos().subscribe(productos => {
      this.isLoaded = true;
      this.productos = productos;
    })
  }

}
