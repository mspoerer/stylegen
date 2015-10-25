import * as path from 'path';
import {Styleguide} from './Styleguide';

export function build() {
  new Styleguide()
  .initialize(process.cwd(), path.resolve(__dirname, '..'))
  .then(function(styleguide) {
    return styleguide.read();
  })
  .then(function(styleguide) {
    console.log("READ FINISHED");
    console.log(styleguide.config);
  })
  .catch(function(e) {
    console.log(e);
    throw(e);
  });
};

export function command(args:[string]) {
  build();
};
