import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarProductoComponent } from '../../modals/agregar-producto/agregar-producto.component';
import { ProductosService } from '../../../app/services/productos.service';
import { Producto } from '../../../app/interfaces/producto';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  productos: Producto[]
  marcas: string[] = [];
  isLoaded: boolean = false;
  // Variable para el buscador
  searchTerm: string = '';
  // Variable para el select de marcas 
  selectedMarcaTerm: string = 'all';
  // Variable para el ordenamiento de productos por precio
  orderPrecioEstado: 'asc' | 'desc' | 'sinOrdenar' = 'sinOrdenar';
  // Variable para el ordenamiento de productos por fecha
  orderFechaEstado: 'asc' | 'desc' | 'sinOrdenar' = 'sinOrdenar';
  // Variable para el ordenamiento de productos por cantidad
  orderCantidadEstado: 'asc' | 'desc' | 'sinOrdenar' = 'sinOrdenar';

  constructor(private modalService: NgbModal, private productosService: ProductosService) {
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

    this.productosService.productosSubject.subscribe(() => {
      this.actualizarProductos();
    });
    
  }

  searchProductoByNombre() {
    if (this.searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, obtener todos los productos de Firestore
      this.productosService.getProductos().subscribe(productos => {
        this.productos = productos;
      });
    } else {
      // Si el término de búsqueda no está vacío, realizar la búsqueda y actualizar la lista
      this.productosService.searchProductosByNombre(this.searchTerm).subscribe(productos => {
        this.productos = productos;
      });
    }
  }

  searchProductoByMarca() {
    // Obtener los productos de la marca seleccionada y actualizar la lista
      this.productosService.searchProductosByMarca(this.selectedMarcaTerm).subscribe(productos => {
        this.productos = productos;
      });
  }

  searchProductosConFiltro() {
    // Obtener los productos con filtros de búsqueda por nombre y/o marca
    this.productosService.getProductosConFiltros(this.searchTerm, this.selectedMarcaTerm).subscribe(productos => {
      this.productos = productos;
    });
    this.orderFechaEstado = 'sinOrdenar';
    this.orderPrecioEstado = 'sinOrdenar';
    this.orderCantidadEstado = 'sinOrdenar';
  }

  orderProductosPorPrecio() {
    if (this.orderPrecioEstado === 'sinOrdenar') {
      this.orderPrecioEstado = 'asc';
      this.productos.sort((a, b) => a.precio - b.precio);
    } else if (this.orderPrecioEstado === 'asc') {
      this.orderPrecioEstado = 'desc';
      this.productos.sort((a, b) => b.precio - a.precio);
    } else if (this.orderPrecioEstado === 'desc') {
      this.orderPrecioEstado = 'sinOrdenar';
    }
  }

  orderProductosPorCantidad() {
    if (this.orderCantidadEstado === 'sinOrdenar') {
      this.orderCantidadEstado = 'asc';
      this.productos.sort((a, b) => a.cantidad - b.cantidad);
    } else if (this.orderCantidadEstado === 'asc') {
      this.orderCantidadEstado = 'desc';
      this.productos.sort((a, b) => b.cantidad - a.cantidad);
    } else if (this.orderCantidadEstado === 'desc') {
      this.orderCantidadEstado = 'sinOrdenar';
    }
  }

  orderProductosPorFecha() {
    if (this.orderFechaEstado === 'sinOrdenar') {
      this.orderFechaEstado = 'asc';
      this.productos.sort((a, b) => this.compararFechas(a.fecha_vencimiento, b.fecha_vencimiento));
    } else if (this.orderFechaEstado === 'asc') {
      this.orderFechaEstado = 'desc';
      this.productos.sort((a, b) => this.compararFechas(b.fecha_vencimiento, a.fecha_vencimiento));
    } else if (this.orderFechaEstado === 'desc') {
      this.orderFechaEstado = 'sinOrdenar';
    }
  }
  
  compararFechas(fechaA: any, fechaB: any): number {
    const dateA = new Date(fechaA.year, fechaA.month - 1, fechaA.day);
    const dateB = new Date(fechaB.year, fechaB.month - 1, fechaB.day);
  
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  }

  actualizarProductos() {
    this.productosService.getProductos().subscribe(productos => {
      this.productos = productos;
      this.searchTerm = '';
      this.selectedMarcaTerm = 'all';
    });

  }

}