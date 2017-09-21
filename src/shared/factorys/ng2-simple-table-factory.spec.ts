import { Ng2STFactory } from './';
import { Ng2ST } from '../interfaces';
import { Column, Sort } from '../interfaces';


describe('Ng2STFactory tests', () => {

  const ARGENTINE = 'Argentine';
  const BRAZIL = 'Brazil';
  const CHINA = 'China';
  const ENGLAND = 'England';
  const SPAIN = 'Spain';
  const UNITED_STATES = 'United States';

  const ACTIONS_ON_LEFT_SIDE = true;

  const ACTIONS_INITIAL_TITLE = 'Actions';

  let data: Array<any>;
  let columns: Array<Column>;
  let ng2STBasicInstance: Ng2ST<Sort>;
  let ng2STWithActionsInstance: Ng2ST<Sort>;
  let tableClasses: string;

  beforeEach(() => {

    data = new Array<any>(
      { id: 1, name: ARGENTINE },
      { id: 2, name: BRAZIL },
      { id: 3, name: CHINA },
      { id: 4, name: ENGLAND },
      { id: 5, name: SPAIN },
      { id: 6, name: UNITED_STATES }
    );

    columns = new Array<Column>(
      { title: 'ID', target: 'id' },
      { title: 'Name', target: 'name' }
    );

    /*
    actionsColumn = {
      title: ACTIONS_INITIAL_TITLE,
      displayOnLeft: ACTIONS_ON_LEFT_SIDE,
      forEachRow: ACTIONS_INITIAL_FOR_EACH_ROW
    };
    */

    tableClasses = 'table table-striped table-condensed table-bordered';

    ng2STBasicInstance = Ng2STFactory.createAutonomous(data, columns);
  });

  it('Should be defined', () => {

    expect(ng2STBasicInstance).toBeDefined();
    expect(ng2STBasicInstance.getData()).toBeDefined();
    expect(ng2STBasicInstance.getColumns()).toBeDefined();
  });

  it('Should create a basic Ng2ST object', () => {

    ng2STBasicInstance
    .getData()
    .then(d => {
      expect(d).toEqual(data);
    });

    expect(ng2STBasicInstance.getColumns()).toBe(columns);
  });
});
