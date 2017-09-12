# ng2-simple-table

## Installation

To install this library, run:

```bash
$ npm install ng2-simple-table --save
```

## Use

From your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { Ng2SimpleTableModule } from 'ng2-simple-table';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    Ng2SimpleTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

country-manage.component.ts

```typescript
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "country-manage",
  templateUrl: "./manage.html"
})
export class CountryManageComponent {

  data:Array<any>= [
    {
      id: 1,
      name: "Argentine"
    },
    {
      id: 2,
      name: "Brazil"
    },
    {
      id: 3,
      name: "China"
    },
    {
      id: 4,
      name: "England"
    },
    {
      id: 5,
      name: "Spain"
    },
    {
      id: 6,
      name: "United States"
    }
  ];

  //title= Column title.
  //target= Property name to display.
  cols:Array<any>= [
    { title: "ID", target: "id" },
    { title: "Name", target: "name" }
  ];

  //Optional
  //Bootstrap 4
  classes:string|string[]|Set<string>= "table table-striped table-bordered table-hover table-responsive"

  //Optional
  actions= {
    title: "Actions",
    displayOnLeft: true,
    forEachRow:[{callBack: (data:any, columnNumber:number, rowNumber:number) => {

      let link:string= this.linkEdit(data.id);
      return this
            .domSanitizer
            .bypassSecurityTrustHtml(
              '<a href="' + link + '"><i class="fa fa-pencil" title="edit"></i></a>'
            );
    }}]
  };

  constructor(private domSanitizer:DomSanitizer) { }

  private linkEdit(personId:number): string {
    return "/person/form/" + personId;
  }

```

manage.html

```xml
<!-- classes and actions are optional parameter -->
<ng2-simple-table [data]="data" [columns]="cols" [classes]="classes" [actions]="actions"></ng2-simple-table>
```

## TODO
  - Tests.
  - Sort.
  - Filter.
  - Pagination.
  - Show/Hide columns.

## License

MIT © [Alva Damián](mailto:alva.damian@yahoo.com.ar)
