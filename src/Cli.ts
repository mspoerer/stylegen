"use strict";

import * as path from 'path';
import {Styleguide} from './Styleguide';

import {success, error} from './Logger';
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
    success('Styleguide.prepare:' ,'preparing the styleguide target ...');
    return styleguide.prepare();
  })
  .then(function(styleguide) {
    success('Styleguide.read:' ,'start reading ...');
    return styleguide.read();
  })
  /** create static styleguide structure */
  .then(function(styleguide) {
    success('Styleguide.read:' ,'finished reading');
    success('Styleguide.write:' ,'start writing ...');
    return styleguide.write();
  })
  .then(function(styleguide) {
    success('Styleguide.write:' ,'finished writing');
  })
  .catch(function(e) {
    error("Cli.build", "failed to build Styleguide", e);
    console.log(e.callee, e.stack);
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
