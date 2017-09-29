import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Ng2STTableComponent,
  Ng2STPaginationComponent,
  ContentWrapperComponent
} from './components';
import { Ng2STCssConfiguration } from './shared';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Ng2STTableComponent,
    Ng2STPaginationComponent,
    ContentWrapperComponent
  ],
  exports: [
    Ng2STTableComponent,
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
