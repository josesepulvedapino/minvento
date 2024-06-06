import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LateralMenuComponent } from '../components/lateral-menu/lateral-menu.component';
import { LateralDashboardComponent } from '../components/lateral-dashboard/lateral-dashboard.component';
import { HeaderComponent } from '../components/header/header.component';
import { InicioComponent } from '../components/lateral-dashboard/inicio/inicio.component';
import { VentasComponent } from '../components/lateral-dashboard/ventas/ventas.component';
import { ComprasComponent } from '../components/lateral-dashboard/compras/compras.component';
import { InventarioComponent } from '../components/lateral-dashboard/inventario/inventario.component';
import { AgregarProductoComponent } from '../components/modals/agregar-producto/agregar-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MarcasService } from './services/marcas.service';
import { ProductosService } from './services/productos.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DashboardComponent,
    LateralMenuComponent,
    LateralDashboardComponent,
    HeaderComponent,
    InicioComponent,
    VentasComponent,
    ComprasComponent,
    InventarioComponent,
    AgregarProductoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    provideFirebaseApp(() => initializeApp({"projectId":"minvento-efd41","appId":"1:1073448903923:web:a6d70e8936525679ea8386","storageBucket":"minvento-efd41.appspot.com","apiKey":"AIzaSyAVZRPyd2y-8oNUrU_Z3-G3qteVkmAOCM8","authDomain":"minvento-efd41.firebaseapp.com","messagingSenderId":"1073448903923"})),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
    
  ],
  providers: [
    MarcasService,
    ProductosService
    
  ],
  bootstrap: [AppComponent]

  
})
export class AppModule { }
