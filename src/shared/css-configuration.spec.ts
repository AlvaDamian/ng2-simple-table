import { Ng2STCssConfiguration } from './';

describe('Ng2CssConfiguration test', () => {

  let instance: Ng2STCssConfiguration;
  let tableCss: string;
  let caretAscCss: string;
  let caretDescCss: string;

  beforeEach(() => {

    tableCss = 'table table-striped table-bordered';
    caretAscCss = 'fa fa-caret-up';
    caretDescCss = 'fa fa-caret-down';

    instance = new Ng2STCssConfiguration();

    instance.setTable(tableCss);
    instance.setCaretAsc(caretAscCss);
    instance.setCaretDesc(caretDescCss);
  });

  it('Should be defined', () => {

    expect(instance).toBeDefined();
  });

  it('Should get the correct css', () => {

    expect(instance.getTable()).toEqual(tableCss);
    expect(instance.getCaretAsc()).toEqual(caretAscCss);
    expect(instance.getCaretDesc()).toEqual(caretDescCss);
  });

  it('Should emit the ConfigurationChanged', () => {

    instance.configurationChanged.subscribe(() => {

      expect(instance.getTable()).not.toEqual(tableCss);
    });

    instance.setTable('');
  });

  it('Should join classes', () => {

    let expected = tableCss.concat(' ').concat(caretAscCss);
    let joined = Ng2STCssConfiguration.joinClasses(tableCss, caretAscCss);

    expect(joined).toEqual(expected);
  });

  it('Should return NULL when trying to join with an undefined or null parameter', () => {

    let joined = Ng2STCssConfiguration.joinClasses(tableCss, undefined);
    expect(joined).toBeNull();

    joined = Ng2STCssConfiguration.joinClasses(undefined, tableCss);
    expect(joined).toBeNull();

    joined = Ng2STCssConfiguration.joinClasses(tableCss, null);
    expect(joined).toBeNull();

    joined = Ng2STCssConfiguration.joinClasses(null, tableCss);
    expect(joined).toBeNull();
  });
});
