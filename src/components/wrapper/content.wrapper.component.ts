import { Component, ViewChild, Input, ViewContainerRef, ComponentFactoryResolver, Compiler, ChangeDetectorRef, ComponentRef } from '@angular/core';
import { Ng2STComponent } from '../../shared/interfaces';

//https://stackoverflow.com/questions/36325212/angular-2-dynamic-tabs-with-user-click-chosen-components/36325468#36325468
//http://plnkr.co/edit/UGzoPTCHlXKWrn4p8gd1?p=preview
@Component({
  selector: 'dcl-wrapper',
  templateUrl: './wrapper.html'
})
export class ContentWrapperComponent {

  @ViewChild('target', {read: ViewContainerRef}) target;
  //@Input() type;
  @Input() value: Ng2STComponent
  cmpRef:ComponentRef<any>;
  private isViewInitialized:boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private compiler: Compiler,
      private cdRef:ChangeDetectorRef) {}

  updateComponent() {
    if(!this.isViewInitialized) {
      return;
    }
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }

    let factory = this.componentFactoryResolver.resolveComponentFactory(this.value.component());
    this.cmpRef = this.target.createComponent(factory);

    let inputs = this.value.inputs();

    inputs
    .forEach(v => {
      this.cmpRef.instance[v.name] = v.value;
    });
    // to access the created instance use
    // this.compRef.instance.someProperty = 'someValue';
    // this.compRef.instance.someOutput.subscribe(val => doSomething());
    this.cdRef.detectChanges();
  }

  ngOnChanges() {
    this.updateComponent();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }

  ngOnDestroy() {
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}