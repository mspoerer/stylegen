"use strict";

import * as path from 'path';

import {Partial, View} from './Templating';

/** configuration structure for the component settings, aka. component.json */
export interface IComponentConfig {
  id?: string;
  partials?: Partial[];
  view?: View;
  path?: string;
  namespace?: string;
  label?: string;
}

/**
 * Components are the representation of the real asset components,
 * that are represented by a component.json file inside of an component folder.
 * A Component has a one-to-one relationship to a Node.
 */
export class Component {
  id: string;
  partials: Partial[];
  view: View;
  config: IComponentConfig;

  /**
   * @param config - the parsed component.json file, enriched with current path and namespace.
   * @param parent - the parent is used to distuingish components and "sub"-components
   */
  constructor(config:IComponentConfig, parent?: Component) {
    this.config = config;
    /** TODO: handle parent resolution and sub component naming, atm. it is useless */
    this.id = this.config.id || path.basename(config.path);
    this.id = `${this.config.namespace}.${this.id}`;
    console.log('Component:', this.id);
  }

  /**
   * a component may have several partials, that are component related view snippets,
   * that are reusable by other partials or view components.
   */
  private buildPartials():Promise<Component> {
    if(!!this.config.partials) {

      /**
       * load all Partials
       */
      var partialPromises:Promise<Partial>[] = this.config.partials.map((partialName:Partial) => {
        var p = path.resolve(this.config.path, partialName);
        /** add partial loading promise to promise collection */
        return new Partial(p).load();
      });

      return Promise.all(partialPromises)
      .then((partials:Partial[]) => {
        this.partials = partials;
        return this;
      });

    /** when no partials are configured, look for _partial.hbs files in the current path */
    } else if(!this.config.partials) {
      // TODO: try to find  *_partial files in component path (this.config.path)
      this.partials = [];
      return new Promise((resolve) => resolve(this));

    /** no partials configured, no problem.  */
    } else {
      this.partials = [];
      console.warn("Component.buildPartials", "Did not found any partials for Component", this.id);
      return new Promise((resolve) => resolve(this));;
    }
  }

  /**
   * at the moment a Component can have exactly one view,
   * that is available later as executable js function.
   *
   * A view is not reusable directly in other views,
   * to have a reusable snippet, register a Partial instead.
   */
  private buildView():Promise<Component> {
    if(!!this.config.view) {
      var p = path.resolve(this.config.path, this.config.view);

      return new View(p).load()
      .then((view) => {
        this.view = view;
        return this;
      });

    /** no view configured, ok, lets look inside the current path for _view.hbs files */
    } else if(!this.config.view) {
      // TODO: try to find  *_view files in component path (this.config.path)
      return new Promise((resolve) => resolve(this));;

    /** no view found, no problem :) */
    } else {
      console.warn("Component.buildView", "Did not found a view for Component", this.id);
      return new Promise((resolve) => resolve(this));;
    }
  }


  /**
   * building a component means to retrieve the flesh and bones of the component,
   * that are described in its config
   *
   * --> Its Partials, its View, and later all other related stuff.
   */
  public build():Promise<Component> {
    /** resolve the component partials at first */
    return this.buildPartials()
    /** after that lets read and build its view */
    .then(() => this.buildView());
  }
}
