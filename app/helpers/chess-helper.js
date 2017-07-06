import Ember from 'ember';

export function chessHelper() {
  return [
    'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black',
    'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white',
    'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black',
    'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white',
    'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black',
    'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white',
    'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black',
    'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'];
}

export default Ember.Helper.helper(chessHelper);
