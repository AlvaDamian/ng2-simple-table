import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableComponent } from './components';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent
  ]
})
export class Ng2SimpleTableModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Ng2SimpleTableModule,
      providers: []
    };
  }
}
