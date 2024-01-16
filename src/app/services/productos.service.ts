import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Producto } from '../interfaces/producto';
import { Observable } from 'rxjs';
import { Storage, ref, listAll, getDownloadURL, list } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private firestore: Firestore, private storage: Storage) { 
  }

  
  addProducto(producto: Producto) {
    const productoRef = collection(this.firestore, 'productos');
    return addDoc(productoRef, producto);
  }

  getProductos(): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    return collectionData(productoRef, { idField: 'id'}) as Observable<Producto[]>;
  }

}
