import DS from 'ember-data';
import ENV from '../config/environment'

export default DS.RESTAdapter.extend({
  namespace: 'api/v1',
  host: ENV.APP.HOST//'http://api.localhost',
});
