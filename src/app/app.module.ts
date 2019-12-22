import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing.module';

import { HttpService } from './services/http.service';
import { CryptocurrencyFactory } from './domain/factories/cryptocurrency-factory';
import { CryptocurrencyRepositoryService } from './domain/repositories/cryptocurrency-repository.service';
import { CryptocurrencyControllerService } from './services/cryptocurrency-controller.service';

import { AppComponent } from './app.component';
import { CryptocurrencyListComponent } from './component/cryptocurrency-list/cryptocurrency-list.component';

@NgModule({
  imports:      [ AppRoutingModule, 
                  BrowserModule, 
                  HttpClientModule, 
                  FormsModule ],
                  
  declarations: [ AppComponent,
                  CryptocurrencyListComponent ],

  bootstrap:    [ AppComponent ],

  providers:    [ HttpService,
                  CryptocurrencyFactory,
                  CryptocurrencyRepositoryService,
                  CryptocurrencyControllerService ]
})
export class AppModule { }
