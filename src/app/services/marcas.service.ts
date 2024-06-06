import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Marca } from '../interfaces/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  public marcasSubject = new Subject<void>();

  constructor(private firestore: Firestore) { 
  }

  addMarca(nombre: string): Promise<void> {
    const marcaRef = collection(this.firestore, 'marcas');
    return addDoc(marcaRef, { nombre })
      .then(() => {
        this.actualizarMarcas();
      });
  }

  // Función para actualizar marcas
  private actualizarMarcas() {
    this.marcasSubject.next();
  }

  getMarcas(): Observable<Marca[]> {
    const marcaRef = collection(this.firestore, 'marcas');
    return collectionData(marcaRef, { idField: 'id'}) as Observable<Marca[]>;
  }
}
