# Dsember

## Demo
You can find a demo instance of this prototype at [dsember.atmire.com](http://dsember.atmire.com)

## Introduction
This prototype is written in [Ember JS](http://emberjs.com/), using [Ember CLI](http://www.ember-cli.com/). Ember CLI is a command line utility to help set-up, organize, scaffold and build Ember projects. It's comparable to [yeoman](http://yeoman.io/), or the `rails` command for Ruby on Rails apps
 
The prototype has been designed to work on top of an unmodified DSpace 5.x REST API. During development we've used https://demo.dspace.org/rest as a backend.

This prototype consists of 2 separate parts: [dsember](https://github.com/atmire/dsember) and [dsember-core](https://github.com/atmire/dsember-core).

* [dsember-core](https://github.com/atmire/dsember-core) contains nearly all of the source code. It is written as an Ember CLI addon.
* [dsember](https://github.com/atmire/dsember) is the Ember application. It is nearly empty, all it does by default is import dsember-core.

It was designed like this to make it easy to customize and keep customizations separate from the vanilla codebase. You could view the dsember app as the `src/dspace/modules` directory in a DSpace release version; it imports the source code, and contains only the differences specific to the current project.

At build time, Ember CLI addons are merged with the importing application's directory structure, making it function like an overlay in Maven. First the addon's code is copied to the dist directory, and the app's code is copied on top. That way, if you put a file with the same name, at the same location in the app, it will replace the version in the addon. If you use multiple addons, their order in package.json determines the order in which they'll be overlayed.

You are not limited to overwriting files to build on existing functionality, Ember CLI comes with support for ES6 modules.
 
 Each file is a module, a self contained unit that can't use any external resources unless they are imported first. It also has an explicit set of exports. Everything else is private to the module. In Ember CLI that means that you can import any class from an addon and extend it, or reopen it so all future instances of the original class will have the changes.


## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (prototype was built using v0.12.4) 
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/) (prototype was built using using v1.13.8)

## Installation

* clone this repository:
  * `git clone https://github.com/atmire/dsember.git` 
* clone the [dsember-core](https://github.com/atmire/dsember-core) repository:
  * `git clone https://github.com/atmire/dsember-core.git` 
* change into the dsember-core directory
  * `npm install`
  * `bower install`
  * `npm link`
* change into the dsember directory
  * `npm link dsember-core`
  * `npm install`
  * `bower install`

This process is a little more convoluted than it should be, because the dsember-core addon hasn't been deployed to npm yet. Once that happens the process becomes:

* clone this repository: 
  * `git clone https://github.com/atmire/dsember.git`
* change into the dsember directory
  * `npm install`
  * `bower install`

## Running / Development
* Start the server from the dsember directory with:
`ember server --proxy https://demo.dspace.org/ --insecure-proxy true`
* Visit the app at [http://localhost:4200](http://localhost:4200).

Ember CLI's server comes with a built in proxy feature to prevent [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) issues during development. That means that all calls to the REST API will be proxied through localhost. In a production environment you'd put the URL of the REST API in `dsember/config/environment.js` 

Feel free to replace https://demo.dspace.org/ with your own REST API. If that REST API isn't deployed on `/rest`, update the namespace in `dsember/config/environment.js` 

`--insecure-proxy true` is only required if the server uses HTTPS and its SSL certificate is invalid 

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## i18n
The prototype makes use of [ember-i18n](https://github.com/jamesarosen/ember-i18n). Similar to messages.xml or messages.properties, labels are mapped to keys in translation files (e.g. `dsember-core/locales/en/translations.js`). These keys are used in the UI and replaced at run time with the label matching the end user's locale. Keys can be used in all Ember objects and in handlebars templates.

* Ember Objects: `this.get('i18n').t('translate.js.key')`
* Handlebars: `{{t 'translate.js.key'}}`

Important to note is that i18n-ized properties in an Ember object should be computed properties dependent on `'i18n.locale'`, that way they'll update when the locale is changed. This happens automatically when using the handlebars helper.

For an example take a look at the `head` property for [the component that adds the abstract to the simple item page](https://github.com/atmire/dsember-core/blob/master/addon/components/items/simple/abstract-section.js#L5). 
  
For more info about i18n in ember see the [ember-i18n wiki](https://github.com/jamesarosen/ember-i18n/wiki)

## Theming
### Local customisations
If you simply want to customize the existing theme for the local install: 

* Add or override styles in `[dsember]/app/styles/app.scss`. 
* New images and fonts should go in to  `[dsember]/app/public/assets`
* if templates need to be overridden, use the ember generator to create them:
  * e.g. to override the simple item view template run: `ember g template items/item/simple` and then edit the generated handlebars file
 

### As an addon
If you want create theme that can be used by others,  it's best to put it in its own addon. This addon should be imported in dsember's `package.json` , below dsember-core.

* Create a new addon for your theme:
	* `ember addon [theme name]`
* Import dsember-core in the addon's `package.json`
* run `npm link dsember-core` in the addon's directory
* The main (s)css file for an addon is `[theme-src]/addon/styles/addon.(s)css`
* Images and fonts go in to `[theme-src]/addon/public/assets`
* Templates for addons are created in the same way as before.
  
While an addon is in development, and hasn't been uploaded to npm, you'll need to link it to be able to use it:

* go the addon's directory 
  * `npm link`
* go to dsember's directory 
  * `npm link [addon name]`

To enable automatic rebuilding on file saves while developing you'll also need add
 ``` javascript
isDevelopingAddon: function() {
    return true;
},
```
to the addon's index.js file's `module.exports`

If you want to use SASS inside an addon , [this issue](https://github.com/aexmachina/ember-cli-sass/issues/83) with ember-cli-sass may contain relevant information.

### Installing a third party theme
Installing a third party theme that has been deployed on NPM as an ember addon will require you to run the following in the dsember directory:
`ember install [theme-addon-name]`


## Authentication/authorization
In the current prototype authentication and authorization are built using [ember-simple-auth](http://ember-simple-auth.com/). It manages the session, and contains abstractions to easily authenticate with a server, and regulate access to certain actions or routes in the app.  We've written a custom authenticator and authorizer for dspace.

The authenticator will send the user's login information to the backend, and store the token the server sends back in simple-auth's session service.

The authorizer will add the `rest-dspace-token` header to all requests to the REST API after the session has been authenticated.

ember-simple-auth allows you make a route accessible to authenticated users only, by simply adding the AuthenticatedRouteMixin to the route object. That will ensure that unauthenticated users are redirected to the login page when they try to access the route. After successfully logging in they'll be redirected to the route they were trying to access.

For example, see the [edit item route](https://github.com/atmire/dsember-core/blob/master/addon/routes/items/item/edit.js)

While it is possible to support more complicated authentication flows using only simple-auth, I'd consider including [torii](http://vestorly.github.io/torii/) to support SSO using Shibboleth for example. Torii also has support for things like sharing information between a popup and the ember app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* [ember 101](https://github.com/abuiles/ember-101)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

