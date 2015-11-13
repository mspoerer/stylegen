"use strict";

import * as path from 'path';
import {Styleguide} from './Styleguide';

/**
 * create the static styleguide
 *
 * TODO: add commandline feedback for success and error case
 */
export function build() {
  new Styleguide()
  /**
   * initialize the styleguide with the current working
   * directory of the app and the root of the upfront tool itself.
   */
  .initialize(process.cwd(), path.resolve(__dirname, '..'))
  /** resolve styleguide structure */
  .then(function(styleguide) {
    console.log('Styleguide.read:' ,'start reading ...');
    return styleguide.read();
  })
  /** create static styleguide structure */
  .then(function(styleguide) {
    console.log('Styleguide.read:' ,'finished reading');
    console.log('Styleguide.write:' ,'start writing ...');
    return styleguide.write();
  })
  .then(function(styleguide) {
    console.log('Styleguide.write:' ,'finished writing');
  })
  .catch(function(e) {
    console.error(e.stack);
    throw(e);
  });
};

/**
 * resolve commandline arguments and run the appropriate command
 *
 * TODO: manage commandline arguments :)
 * TODO: add argument to clean the dist folder in beforehand
 */
export function command(args:[string]) {
  build();
};
