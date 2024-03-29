import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NeuronComponent } from './neuron/neuron.component';
import { ConnectionComponent } from './connection/connection.component';
import { NetworkComponent } from './network/network.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NeuronComponent,
    ConnectionComponent,
    NetworkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
