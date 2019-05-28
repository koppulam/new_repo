# README

## What is this repository for?

Code repo for **General VUE FE Development**

## Prerequisites

*   Node v8.3.0 +
*   NPM v5.6.0 +

### Technologies

The client side application is comprised of the following technologies:

#### For generating Static Markup on Server Side

*   [Handlebars](http://assemble.io/)
    Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.

*   [Assemble](http://assemble.io/)
    More than 130 Handlebars helpers in ~20 categories. Helpers can be used with Assemble, Generate, Verb, Ghost, webpack-handlebars, gulp-handlebars, grunt-handlebars, consolidate, or any node.js/Handlebars project.

#### HTML, CSS and JavaScript

*   BEM - Block Element Modifier is a methodology that helps you to create reusable components and code sharing in front-end development (http://getbem.com/)
*   SASS - Sass is the most mature, stable, and powerful professional grade CSS extension language in the world (https://sass-lang.com/)
*   JavaScript - We used Adroit framework and Vue JS

#### Build Tools, Transpiler & Package Manager

*   [Babel](https://babeljs.io/)
*   [Webpack](https://webpack.js.org/)
*   [NPM](https://www.npmjs.com/)

### Developer Tools

#### [VS Code](https://code.visualstudio.com/)

Visual Studio Code is a free code editor redefined and optimized for building and debugging modern web and cloud applications.

##### VS Code - User Preference

```json
{
	"editor.formatOnSave": true,
	"[handlebars]": {
		"editor.formatOnSave": false
	},
	"editor.renderWhitespace": "all"
}
```

##### VS Code Plugins

*   [Editor Config](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
*   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
*   [JavaScript ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
*   [SASS linter](https://marketplace.visualstudio.com/items?itemName=glen-84.sass-lint)

### Getting Started - Code & Environment - Setup

*   Go to the root folder (where package.json is available) and run the following command:s

```bash
$ npm install
```

*   Go to the root folder and then to generators folder (where package.json is available) and run the following command:s

```bash
$ npm install
```

*   Go back to the root folder and then run below command to start the server:

```bash
$ npm start
```

#### Create FE Components

Please use the below command to create any new HBS component:

```bash
$ node generators --name <component-name> --dir <director name>
```

## How to Build & Run

Build application for Dev Env and runs webpack-dev-server

> npm run start

Webpack Build

> npm run build

Webpack Build & check for ADA

> npm run build:Ada

Build & Analyse the Webpack Build

> npm run build:analyse

Webpack Build for prod

> npm run build:prod


### Branching strategy

* Make sure that you are taking latest pull of the root branch that you are working on, so that you can avoid merge conflicts. For ex: "master".
* Do an "npm install" to have your "node_modules" up to date.
* Cut branches with specific ticket details. For ex, if it is a feature "feature/xxx-xxx" and if it is a bug "bugfix/xxx-xxx". If we are doing any ad-hoc task "task/xxxx".

### How to raise PR

<!-- NOTE: Please just put "N/A" for any section below that isn't applicable to the work you've done, do not omit entirely. -->

## JIRA Ticket(s)

Please do not submit a Pull Request without a relevant ticket!

http://jira/AEM-XXXX

## Description

Explain the technical implementation of the work done.

## To Test

- [ ] Add steps to test this feature

## Relevant Screenshots/GIFs

Use something like [GIPHY Capture](https://giphy.com/apps/giphycapture) to capture images/gifs to demonstrate behaviors.

## Config settings

Provide any relevant configs for testing here.

## Remaining Tasks

Remaining tasks?

## Additional Notes

Anything more to add?


### Feature-detection

* If we are implementing any global features please make sure that we are initializing them in "./src/lib/utils/feature-detection.js" file.


### Lazy-Load & Picture tag

* We are using "vanilla-lazyload" plugin using picture tag for loading images lazily. For more information on how to use, please refer to https://github.com/verlok/lazyload/tree/master/demos
* Refer to picture.hbs file for picture tag usage.
* Using "b-lazy" to lazy load videos and iframe videos


## Vue Usage

* [Vue / Vuex System Architecture](#vue-vuex-system-architecture)
	* [Folder Structure](#folder-structure)
	* [Store](#store)
	* [Actions](#actions)
	* [Config](#config)
	* [Constants](#constants)
	* [Middleware](#middleware)
	* [Reducers](#reducers)
	* [Util](#util)
	* [Mock](#mock)
* [Coding Conventions](#coding-conventions)


## Vue / Vuex System Architecture

### Folder Structure

```
src/vue-app/
|--- actions/
|--- components/
|--- |--- common
|--- |--- modules/
|--- |--- |--- etc
|--- constants
|--- instances
|--- store
|--- mock/

```

### Actions

Actions are used to trigger changes to the vuex state. We also make all calls to the API here.  A normal action is dispatched as below :

```javascript

function example({ commit, state }, data) {
	commit('EXAMPLE_ACTION', data);
}
```

However, we also make all our API calls in our actions files. We import from the API util, and pass in parameters based on the API call we are making.

Example:

```javascript
export const example = ({commit, state}, formData) => {
	api({
		method: 'post',
		url: '/api/auth',
		convertFromJson: true,
		body: formData,
		success: (resp) => {
			if (resp.success) {
				commit('SIC.SIGNED_IN',
					{
						authenticated: resp.success,
						guest: false
					}
				);
			} else {
				commit('SIC.SIGN_IN_FAILED',
					{
						authenticated: false,
						guest: true,
						error: resp
					}
				);
			}
		}
	}));
};
```

As you can see we have to pass a method, URL, and success function to the API function we import. This will make the API request for us (through middleware) and then fire the success function.

### Components

Components folder is broken down into two main subfolders.
* Common - These are common reusable elements accross (link, picture, button, etc.)
* modules - main modules on a page (header, footer, stores, pdp, etc.)

### Constants

Unique constant name to be used by vue actions and store

### index.js

Entry point of the application. Including setting up the vuex store, and any other bootstrapping that is necessary.

### store

The state of application. Instead of maintaining every action and data on the main store we can break down into modules.

```javascript
	const moduleA = {
		state: { ... },
		mutations: { ... },
		actions: { ... },
		getters: { ... }
	}

	const moduleB = {
		state: { ... },
		mutations: { ... },
		actions: { ... }
	}

	const store = new Vuex.Store({
		modules: {
			a: moduleA,
			b: moduleB
		}
	})
```

More on modular store configuration and usage of getters, setters, actions can be found here https://vuex.vuejs.org/guide/modules.html 

## Coding Conventions

Adviced to follow styles guide principles given by default vue documentation

https://vuejs.org/v2/style-guide/