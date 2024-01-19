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
  }

  actualizarProductos() {
    this.productosService.getProductos().subscribe(productos => {
      this.productos = productos;
      this.searchTerm = '';
      this.selectedMarcaTerm = 'all';
    });

  }

}