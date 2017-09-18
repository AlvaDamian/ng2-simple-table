import { BaseColumn } from './private/BaseColumn';

export interface Column extends BaseColumn {

  target: string;
  customValue?: (value: any, fullObject?: any) => any;
}
