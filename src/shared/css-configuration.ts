import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class Ng2STCssConfiguration {

  public configurationChanged: EventEmitter<void>;

  private tableClass: string | Array<string> | Set<string>;
  private caretAscClass: string | Array<string> | Set<string>;
  private caretDesClass: string | string[] | Set<string>;
  private paginationClass: string | string[] | Set<string>;
  private paginationItemClass: string | string[] | Set<string>;
  private paginationLinkClass: string | string[] | Set<string>;
  private paginationActiveItemClass: string | string[] | Set<string>;

  public static joinClasses(
    left: string | string[] | Set<string>,
    right: string | string[] | Set<string>
  ): string | string[] | Set<string> {

    if (!left || !right) {
      return null;
    }

    if (typeof left === 'string') {

      if (typeof right === 'string') {
        return left.concat(' ').concat(right);
      }

      if (Array.isArray(right)) {

        let temp: string[] = Array.from(right);
        return left.concat(' ').concat(temp.join(' '));
      }
    }


    if (Array.isArray(left)) {

      let ret: string[] = Array.from(left);

      if (Array.isArray(right)) {
        ret.concat(right);
      }

      if (typeof right === 'string') {
        ret.push(right);
      }

      return ret;
    }

    return null;
  }

  constructor() {
    this.configurationChanged = new EventEmitter<void>();
  }

  public setTable(css: string | Array<string> | Set<string>): void {
    this.tableClass = css;
    this.configurationChanged.emit();
  }

  public setCaretAsc(css: string | Array<string> | Set<string>): void {
    this.caretAscClass = css;
    this.configurationChanged.emit();
  }

  public setCaretDesc(css: string | Array<string> | Set<string>): void {
    this.caretDesClass = css;
    this.configurationChanged.emit();
  }

  public setPagination(css: string | string[] | Set<string>): void {
    this.paginationClass = css;
    this.configurationChanged.emit();
  }

  public setPaginationItem(css: string | string[] | Set<string>): void {
    this.paginationItemClass = css;
    this.configurationChanged.emit();
  }

  public setPaginationLink(css: string | string[] | Set<string>): void {
    this.paginationLinkClass = css;
    this.configurationChanged.emit();
  }

  public setPaginationActiveItem(css: string | string[] | Set<string>): void {
    this.paginationActiveItemClass = css;
    this.configurationChanged.emit();
  }

  public getTable(): string | Array<string> | Set<string> {
    return this.tableClass;
  }

  public getCaretAsc(): string | Array<string> | Set<string> {
    return this.caretAscClass;
  }

  public getCaretDesc(): string | Array<string> | Set<string> {
    return this.caretDesClass;
  }

  public getPagination(): string | string[] | Set<string> {
    return this.paginationClass;
  }

  public getPaginationItem(): string | string[] | Set<string> {
    return this.paginationItemClass;
  }

  public getPaginationLink(): string | string[] | Set<string> {
    return this.paginationLinkClass;
  }

  public getPaginationActiveItem(): string | string[] | Set<string> {
    return this.paginationActiveItemClass;
  }
}
