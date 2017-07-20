import DS from 'ember-data';
import ENV from '../config/environment'

export default DS.RESTAdapter.extend({
  namespace: ENV.APP.NAMESPACE,
  host: ENV.APP.HOST
});
