import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../../app/services/productos.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss']
})
export class AgregarProductoComponent {
  formulario: FormGroup;
  imagenFile: File | null = null;
  imagenUrl: string | null = null;

  constructor(public activeModal: NgbActiveModal, private productosService: ProductosService, private storage: Storage) {
    this.formulario = new FormGroup({
      imagen: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      marca: new FormControl('', Validators.required),
      cantidad: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      fecha_vencimiento: new FormControl('',Validators.required)
    });
  }

  obtenerImagenProducto(event: Event) {
    if (event && event.target) {
      this.imagenFile = (event.target as HTMLInputElement).files?.[0] || null;
      console.log('imagen cargada: ' + this.imagenFile?.name);
    }
  }

  async agregarProducto() {
    if (this.formulario.valid) {
      if (this.imagenFile) {
        try {
          const nombreImagen = `producto_${Date.now()}`;
          const imagenRef = ref(this.storage, `imagenes/productos/${nombreImagen}`);
          await uploadBytes(imagenRef, this.imagenFile);
          const imageUrl = await getDownloadURL(imagenRef);
          this.imagenUrl = imageUrl;
        } catch (error) {
          console.error('Error al subir la imagen:', error);
          return;
        }
      }
      try {
        const response = await this.productosService.addProducto({ 
          ...this.formulario.value,
          imagen: this.imagenUrl || null
        });
        this.activeModal.close();
      } catch (error) {
        console.error('Error al agregar el producto a Firestore:', error);
      }
    }
  }
  
  closeModalAgregarProducto() {
    this.activeModal.close();
  }
}
