"use strict";
import {Doc} from './Doc';
import {View} from './Templating';
/**
 * Interface that new Renderers should implement.
 * As an example implementation look for the HandlebarsRenderer.
 */
export interface IRenderer {
  // engine: IRenderer;
  // setEngine<T>(engine: T): IRenderer;
  render<T>(object: T): T;
}

/** config for the renderer object */
export interface IRendererOptions {
  namespace?: string;
  htmlEngine?: IRenderer;
}

export interface IRenderObject {
  raw?: string;
  compiled?: string;
  type: string;
}



export class Renderer {

  render<T>(object: T):T {
    
    return object;
  }
}
