import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarProductoComponent } from '../../modals/agregar-producto/agregar-producto.component';
import { ProductosService } from '../../../app/services/productos.service';
import { Producto } from '../../../app/interfaces/producto';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  productos: Producto[]
  marcas: string[] = [];
  isLoaded: boolean = false;

  // Variables para los toasts de éxito y error
  showSuccessToast: boolean = false;
  successToastMessage: string = '';

  showErrorToast: boolean = false;
  errorToastMessage: string = '';

  // Variable para el buscador
  searchTerm: string = '';

  // Variable para el select
  selectedMarca: string = '';


  constructor(private modalService: NgbModal, private productosService: ProductosService, private toastService: ToastService) {
    this.productos = [];
  }

  openModalAgregarProducto() {
    this.modalService.open(AgregarProductoComponent, { centered: true });
  }

  ngOnInit() {
    this.productosService.getProductos().subscribe(productos => {
      this.isLoaded = true;
      this.productos = productos;
    });

    this.productosService.getMarcas().subscribe(marcas => {
      // Obtener las marcas de los productos y eliminar las repetidas
      this.marcas = marcas.filter((marca, index) => marcas.indexOf(marca) === index);
    });

    this.toastService.showToast$.subscribe((message) => {
      const [type, toastMessage] = message.split(':');

      // Mostrar el toast específico
      if (type === 'success') {
        this.showSuccessToast = true;
        this.successToastMessage = toastMessage;
      } else if (type === 'error') {
        this.showErrorToast = true;
        this.errorToastMessage = toastMessage;
      }
    });
  }

  searchProductoByName() {
    if (this.searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, obtener todos los productos de Firestore
      this.productosService.getProductos().subscribe(productos => {
        this.productos = productos;
      });
    } else {
      // Si el término de búsqueda no está vacío, realizar la búsqueda y actualizar la lista
      this.productosService.searchProductosByName(this.searchTerm).subscribe(productos => {
        this.productos = productos;
      });
    }
  }

  searchProductoByMarca() {
    if (this.selectedMarca === 'all') {
      // Si se selecciona la opción "Todas las marcas", obtener todos los productos de Firestore
      this.productosService.getProductos().subscribe(productos => {
        this.productos = productos;
      });
    } else {
      // Si se ha seleccionado una marca, realizar la búsqueda y actualizar la lista
      this.productosService.searchProductosByMarca(this.selectedMarca).subscribe(productos => {
        this.productos = productos;
      });
    }
  }


}