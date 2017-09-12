import { BaseColumn } from './private/BaseColumn';

export interface Column extends BaseColumn {

  target: string;
  sortStrategy?: (arg0: any, arg1: any) => boolean;
}
