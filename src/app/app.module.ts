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
    InventarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
