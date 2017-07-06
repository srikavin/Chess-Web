import Ember from 'ember';

export function for_loop([amount]) {
  console.log(amount);
  return Array.apply(null, new Array(amount)).map(function () {
    return 1;
  })
}

export default Ember.Helper.helper(for_loop);
