import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../../app/services/productos.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss']
})
export class AgregarProductoComponent {
  formulario: FormGroup;

  constructor(public activeModal: NgbActiveModal, private productosService: ProductosService, private storage: Storage) {
    this.formulario = new FormGroup({
      imagen: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      marca: new FormControl('', Validators.required),
      cantidad: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      fecha_vencimiento: new FormControl('', Validators.required)
    });
  }

  agregarImagenProducto(event: any) {
    const imagen = event.target.files[0];
    const imagenRef = ref(this.storage, `imagenes/productos/${imagen.name}`);
    uploadBytes(imagenRef, imagen).then(response => console.log(response)).catch(error => console.log(error));
  }

  async agregarProducto() {
    if (this.formulario.valid) {
      const response = await this.productosService.addProducto({ ...this.formulario.value});
      this.activeModal.close();
    } else {
      console.log('Formulario inválido. No se enviará.');
    }
  }
  
  closeModalAgregarProducto() {
    this.activeModal.close();
  }
}
