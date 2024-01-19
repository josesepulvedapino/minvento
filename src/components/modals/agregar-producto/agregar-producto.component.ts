import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../../app/services/productos.service';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss']
})
export class AgregarProductoComponent {
  agregandoProducto = false;  // Variable para indicar si se está agregando un producto
  formulario: FormGroup;
  imagenFile: File | null = null;
  imagenUrl: string | null = null;

  // Constructor de la clase
  constructor(
    public activeModal: NgbActiveModal,  // Servicio de Bootstrap para manipular modales
    private productosService: ProductosService,  // Servicio que maneja la lógica relacionada con los productos
    private storage: Storage,  // Servicio de Firebase para el almacenamiento
    private toastService: ToastService  // Servicio para mostrar toasts
  ) {
    // Inicialización del formulario con controles y validadores
    this.formulario = new FormGroup({
      imagen: new FormControl('', Validators.required),  // Campo para la imagen con validación de requerido
      nombre: new FormControl('', Validators.required),  // Campo para el nombre con validación de requerido
      marca: new FormControl('', Validators.required),  // Campo para la marca con validación de requerido
      cantidad: new FormControl('', [Validators.required, Validators.max(100000)]),
      precio: new FormControl('', Validators.required),  // Campo para el precio con validación de requerido
      fecha_vencimiento: new FormControl('', Validators.required)  // Campo para la fecha de vencimiento con validación de requerido
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
          this.toastService.showError('Error al subir la imagen. Por favor, intenta más tarde.');
          return;
        }
      }
      try {
        // Intentar agregar el producto a Firestore llamando al servicio correspondiente
        const response = await this.productosService.addProducto({
          ...this.formulario.value,
          imagen: this.imagenUrl || 'Imagen no disponible'  // Usar la URL de la imagen si está disponible, de lo contrario usar un texto alternativo
        });
        // Cerrar el modal si la operación fue exitosa
        this.activeModal.close();
        this.toastService.showSuccess('Producto agregado correctamente al inventario.');
      } catch (error) {
        // Manejar errores en caso de problemas al agregar el producto a Firestore
        console.error('Error al agregar el producto a Firestore:', error);
        this.toastService.showError('Error al agregar el producto al inventario. Por favor, intenta más tarde.');
      }
    }
  }
  
  formatearPrecio() {
    const precioRef = this.formulario.get('precio');
    if (precioRef?.value) {
      // Eliminar todos los caracteres no numéricos y formatear con puntos para separar miles
      const precioFormateado = precioRef.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      // Actualizar el valor en el formulario con el precio formateado
      precioRef.setValue(precioFormateado);
    }
  }

  formatearCantidad() {
    const cantidadRef = this.formulario.get('cantidad');
    if (cantidadRef?.value) {
      // Eliminar todos los caracteres no numéricos y formatear con puntos para separar miles
      const cantidadRefFormateada = cantidadRef.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      // Actualizar el valor en el formulario con el precio formateado
      cantidadRef.setValue(cantidadRefFormateada);
    }
  }
  
  closeModalAgregarProducto() {
  //Cerrar modal agregar producto
    this.activeModal.close();
  }
}
