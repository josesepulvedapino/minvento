import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../../app/services/productos.service';
import { MarcasService } from '../../../app/services/marcas.service'; // Servicio para manejar marcas
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss']
})
export class AgregarProductoComponent implements OnInit {
  marcas: string[] = []; // Variable para almacenar las marcas de los productos
  agregandoProducto = false;  // Variable para indicar si se está agregando un producto
  formulario: FormGroup; // Variable para almacenar el formulario
  imagenFile: File | null = null; // Variable para almacenar el archivo de la imagen
  imagenUrl: string | null = null; // Variable para almacenar la URL de la imagen
  nuevaMarca: string | null = null; // Variable para indicar si se está agregando una nueva marca

  // Constructor de la clase
  constructor(
    public activeModal: NgbActiveModal,  // Servicio de Bootstrap para manipular modales
    private productosService: ProductosService,  // Servicio que maneja la lógica relacionada con los productos
    private marcasService: MarcasService, // Servicio que maneja la lógica relacionada con las marcas
    private storage: Storage,  // Servicio de Firebase para el almacenamiento
    private toastrService: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicialización del formulario con controles y validadores
    this.formulario = new FormGroup({
      imagen: new FormControl('', Validators.required),  // Campo para la imagen con validación de requerido
      nombre: new FormControl('', Validators.required),  // Campo para el nombre con validación de requerido
      marca: new FormControl('', Validators.required),  // Campo para la marca con validación de requerido
      nuevaMarca: new FormControl(''),  // Campo para la marca nueva
      cantidad: new FormControl('', [Validators.required, Validators.max(100000)]), // Campo para la cantidad con validación de requerido y máximo de 100000
      precio: new FormControl('', Validators.required),  // Campo para el precio con validación de requerido
      fecha_vencimiento: new FormControl('', Validators.required)  // Campo para la fecha de vencimiento con validación de requerido
    });
  }

  ngOnInit(): void {
    // Obtener las marcas de los productos y eliminar las repetidas
    this.marcasService.getMarcas().subscribe(marcas => {
      this.marcas = [...new Set(marcas.map(marca => marca.nombre))];
    });
  }

  obtenerImagenProducto(event: Event) {
    // Verificar si se ha seleccionado un archivo
    if (event && event.target) {
      // Si se verificó que se seleccionó un archivo, obtenerlo y asignarlo a la variable imagenFile
      this.imagenFile = (event.target as HTMLInputElement).files?.[0] || null;
    }
  }

  async agregarProducto() {
    // Indicar que se está agregando un producto
    this.agregandoProducto = true;
    // Verificar si el formulario es válido antes de continuar
    if (this.formulario.valid) {
      // Verificar si hay una imagen para subir
      if (this.imagenFile) {
        try {   
          // Generar un nombre único para la imagen usando la marca de tiempo
          const nombreImagen = `producto_${Date.now()}`;
          // Crear una referencia a la ubicación de almacenamiento de la imagen
          const imagenRef = ref(this.storage, `imagenes/productos/${nombreImagen}`);
          // Subir la imagen al almacenamiento
          await uploadBytes(imagenRef, this.imagenFile);
          // Obtener la URL de descarga de la imagen recién subida
          const imageUrl = await getDownloadURL(imagenRef);
          // Asignar la URL de la imagen al campo correspondiente en el formulario
          this.imagenUrl = imageUrl;
        } catch (error) {
          // Manejar errores en caso de problemas al subir la imagen
          console.error('Error al subir la imagen:', error);
          this.toastrService.error('Error al subir la imagen. Por favor, intenta más tarde.', '', {
            progressBar: true,
          });
          return;
        }
      }
      try {
        // Verificar si se ingresó una marca nueva
        if (this.formulario.value.nuevaMarca) {
          // Agregar la nueva marca a la colección de marcas en Firebase
          await this.marcasService.addMarca(this.formulario.value.nuevaMarca.toLowerCase());
          // Asignar la nueva marca al campo marca
          this.formulario.value.marca = this.formulario.value.nuevaMarca.toLowerCase();
        }

        // Convertir los campos 'cantidad' y 'precio' a números antes de agregar el producto a Firestore
        const cantidad = parseFloat(this.formulario.value.cantidad.replace(/[^\d]/g, '')) || 0;
        const precio = parseFloat(this.formulario.value.precio.replace(/[^\d]/g, '')) || 0;

        // Convertir el campo 'nombre' a minúsculas antes de agregar el producto a Firestore
        const nombreLowerCase = this.formulario.value.nombre.toLowerCase();
        // Convertir el campo 'marca' a minúsculas antes de agregar el producto a Firestore
        const marcaLowerCase = this.formulario.value.marca.toLowerCase();
  
        // Intentar agregar el producto a Firestore llamando al servicio correspondiente
        const response = await this.productosService.addProducto({
          ...this.formulario.value,
          nombre: nombreLowerCase,  // Usar el nombre en minúsculas
          marca: marcaLowerCase,  // Usar la marca en minúsculas
          cantidad: cantidad,
          precio: precio,
          imagen: this.imagenUrl || 'Imagen no disponible'  // Usar la URL de la imagen si está disponible, de lo contrario usar un texto alternativo
        }); 
        // Cerrar el modal si la operación fue exitosa
        this.toastrService.success('Producto agregado correctamente al inventario', '', {
          progressBar: true,
        });
      } catch (error) {
        // Manejar errores en caso de problemas al agregar el producto a Firestore
        console.error('Error al agregar el producto a Firestore:', error);
        this.toastrService.error('Error al agregar el producto al inventario. Por favor, intenta más tarde' , '', {
          progressBar: true,
        });
      }
      this.activeModal.close();
    }
  }
  
  formatearCantidad(event: any) {
    const precioRef = this.formulario.get('cantidad');
    if (precioRef?.value) {
      // Eliminar todos los caracteres no numéricos
      const precioLimpio = precioRef.value.replace(/[^\d]/g, '');
      // Formatear con puntos para separar miles
      const precioFormateado = new Intl.NumberFormat('es-ES').format(parseFloat(precioLimpio) || 0);
      // Actualizar el valor en el formulario con el precio formateado
      precioRef.setValue(precioFormateado);
      // Emitir el evento input para que Angular actualice el modelo
      event.target.value = precioFormateado;
    }
  }

  formatearPrecio(event: any) {
    const precioRef = this.formulario.get('precio');
    if (precioRef?.value) {
      // Eliminar todos los caracteres no numéricos
      const precioLimpio = precioRef.value.replace(/[^\d]/g, '');
      // Formatear con puntos para separar miles
      const precioFormateado = new Intl.NumberFormat('es-ES').format(parseFloat(precioLimpio) || 0);
      // Actualizar el valor en el formulario con el precio formateado
      precioRef.setValue(precioFormateado);
      // Emitir el evento input para que Angular actualice el modelo
      event.target.value = precioFormateado;
    }
  }
  
  closeModalAgregarProducto() {
  //Cerrar modal agregar producto
    this.activeModal.close();
  }
}
