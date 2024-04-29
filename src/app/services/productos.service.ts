import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, Query, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Producto } from '../interfaces/producto';
import { Observable, Subject, distinct, map, switchMap } from 'rxjs';
import { Storage, ref, listAll, getDownloadURL, list } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  public productosSubject = new Subject<void>();

  constructor(private firestore: Firestore, private storage: Storage) { 
  }

  addProducto(producto: Producto): Promise<void> {
    const productoRef = collection(this.firestore, 'productos');
    return addDoc(productoRef, producto)
      .then(() => {
        this.actualizarProductos();
      });
  }

  getProductos(): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    return collectionData(productoRef, { idField: 'id'}) as Observable<Producto[]>;
  }

  getMarcas(): Observable<string[]> {
    return this.getProductos().pipe(
      map(productos => productos.map(producto => producto.marca)),
      distinct() 
    );
  }

  searchProductosByNombre(name: string): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    const queryByName = query(productoRef, where('nombre', '>=', name));
    return collectionData(queryByName, { idField: 'id' }) as Observable<Producto[]>;
  }

  searchProductosByMarca(marca: string): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    const queryByMarca = query(productoRef, where('marca', '==', marca));
    return collectionData(queryByMarca, { idField: 'id' }) as Observable<Producto[]>;
  }

  getProductosConFiltros(searchTerm: string, selectedMarca: string): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    let dynamicQuery: Query<DocumentData> = productoRef;

    if (searchTerm.trim() !== '' && selectedMarca !== 'all') {
      const startSearchTerm = searchTerm.toLowerCase();
      const endSearchTerm = searchTerm.toLowerCase() + '\uf8ff'; 
      dynamicQuery = query(productoRef, 
        where('nombre', '>=', startSearchTerm),
        where('nombre', '<=', endSearchTerm),
        where('marca', '==', selectedMarca)
      );
    } else if (searchTerm.trim() !== '') {
      const startSearchTerm = searchTerm.toLowerCase();
      const endSearchTerm = searchTerm.toLowerCase() + '\uf8ff';
      dynamicQuery = query(productoRef, 
        where('nombre', '>=', startSearchTerm),
        where('nombre', '<=', endSearchTerm)
      );
    } else if (selectedMarca !== 'all') {
      dynamicQuery = query(productoRef, where('marca', '==', selectedMarca));
    }

    return collectionData(dynamicQuery, { idField: 'id' }) as Observable<Producto[]>;
  }

  // Función para actualizar productos
  private actualizarProductos() {
    this.getProductos().pipe(
      switchMap(productos => this.getMarcas())
    ).subscribe(() => {
      this.productosSubject.next();
    });
  }
}
