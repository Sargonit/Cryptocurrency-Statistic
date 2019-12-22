import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { GraphComponent } from './component/graph/graph.component';
import { CryptocurrencyTableComponent } from './component/cryptocurrency-data-table/cryptocurrency-data-table.component';

@NgModule({
  declarations: [ 
    GraphComponent, CryptocurrencyTableComponent
  ],
  imports: [
    RouterModule.forRoot([
      { path: 'graphics', component: GraphComponent },
      { path: 'table', component: CryptocurrencyTableComponent },
      { path: '**', redirectTo: 'graphics' }
    ]),
    CommonModule
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}