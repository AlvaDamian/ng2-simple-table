import { BaseColumn } from './private/BaseColumn';

export interface Column extends BaseColumn {

  target: string;
  customValue?: (value: any, fullObject?: any) => any;
  sortStrategy?: (arg0: any, arg1: any) => boolean;
}
