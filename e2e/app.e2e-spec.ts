import { LmsPage } from './app.po';

describe('lms App', function() {
  let page: LmsPage;

  beforeEach(() => {
    page = new LmsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
