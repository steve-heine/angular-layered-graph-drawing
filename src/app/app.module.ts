import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DependencyGraphComponent } from './dependency-graph/dependency-graph.component';
import { DependencyNodeManagerComponent } from './dependency-node-manager/dependency-node-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    DependencyGraphComponent,
    DependencyNodeManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
