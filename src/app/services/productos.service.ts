import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, Query, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Producto } from '../interfaces/producto';
import { Observable, distinct, map } from 'rxjs';
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

  getMarcas(): Observable<string[]> {
    return this.getProductos().pipe(
      map(productos => productos.map(producto => producto.marca)),
      distinct() 
    );
  }

  getProductosConFiltros(searchTerm: string, selectedMarca: string): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    
    let dynamicQuery: Query<DocumentData> = productoRef;
  
    // Construir la consulta basada en los parámetros proporcionados
    if (searchTerm.trim() !== '' && selectedMarca !== 'all') {
      const startSearchTerm = searchTerm.toLowerCase();
      const endSearchTerm = searchTerm.toLowerCase() + '\uf8ff'; // '\uf8ff' es un carácter especial que representa el fin de una cadena en Unicode
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
  

  searchProductosByName(name: string): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    const queryByName = query(productoRef, where('nombre', '>=', name));
    return collectionData(queryByName, { idField: 'id' }) as Observable<Producto[]>;
  }

  searchProductosByMarca(marca: string): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'productos');
    const queryByMarca = query(productoRef, where('marca', '==', marca));
    return collectionData(queryByMarca, { idField: 'id' }) as Observable<Producto[]>;
  }
}
