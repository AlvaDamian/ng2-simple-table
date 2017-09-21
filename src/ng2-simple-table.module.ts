import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableComponent, ContentWrapperComponent } from './components';
import { Ng2STCssConfiguration } from './shared';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent,
    ContentWrapperComponent
  ],
  exports: [
    TableComponent,
    ContentWrapperComponent
  ]
})
export class Ng2SimpleTableModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Ng2SimpleTableModule,
      providers: [
      { provide: Ng2STCssConfiguration, useClass: Ng2STCssConfiguration }
      ]
    };
  }
}
