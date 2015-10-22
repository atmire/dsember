import Ember from 'ember';
import config from './config/environment';
import coreMap from './utils/route-setup';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  coreMap(this);

  this.route('collection', {}, function() {});
});

export default Router;
