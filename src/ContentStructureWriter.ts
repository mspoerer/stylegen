"use strict";

import {Styleguide} from './Styleguide';
import {Page, IPageConfig} from './Page';
import {IPageLayoutContext} from './PageLayout';
import {IRenderer} from './Renderer';
import {MarkdownRenderer} from './MarkdownRenderer';

export class ContentStructureWriter {
  mdRenderer: IRenderer;
  pages: Page[];

  constructor(private styleguide:Styleguide) {
    this.mdRenderer = new MarkdownRenderer({"htmlEngine": this.styleguide.renderer.engine});
  }

  /**
   * walk config, and build page objects
   */
  walk(content: IPageConfig[]):Promise<ContentStructureWriter> {
    return Promise.all(content.map((pageConfig:IPageConfig) => {
      pageConfig.mdRenderer = this.mdRenderer;
      pageConfig.target = this.styleguide.config.target;

      return new Page(pageConfig).build();
    }))
    .then((pages) => {
      this.pages = pages;
      return this;
    });
  }

  write(context: IPageLayoutContext):Promise<ContentStructureWriter> {
    context.pages = this.pages;

    var pageLayout = this.styleguide.components.find('sg.page-layout').view.template

    return Promise.all(this.pages.map(page => page.write(pageLayout, context)))
    .then(pages => this);
  }
}
