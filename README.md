# Meanerjs
**Warning: This project is under heavy development and is currently missing several key features.**

Meanerjs is a leaner, meaner yeoman generator for MEAN stack applications.  It uses a simple, organized, lightweight file structure for scaffolding your web apps.  It also allows you to customize the developer tools you use, so you get what you want without the stuff you don't need.  You can choose to begin with an empty project, or a full-fledged user authentication app.  It is also heavily documented, so beginners and experienced developers alike can get started creating MEAN apps as quickly as possible.

## Prerequisites
Before using Meanerjs, you must first install the following packages:

1. [Node.js](https://nodejs.org/en/)
2. [MongoDB](https://www.mongodb.com)
3. [Yeoman](http://yeoman.io) `npm install -g yeoman`
4. [Bower](https://bower.io) `npm install -g bower`

## Getting Started
**Coming soon to npm!**  For now, you can clone or download the code directly from this repository and link the generator to your global node modules folder:

```
git clone https://github.com/garrisoh/generator-meanerjs.git
cd generator-meanerjs
npm link
```

## Scaffolding a Project
To begin scaffolding your project, create a new directory for your project and run the project generator from that directory:

```
mkdir MJTest && cd MJTest
yo meanerjs
```

If you would like to skip installation of npm and bower packages, use the `--skip-install` option when running the generator.  You will then be asked to enter a project name and choose between a barebones, default, or custom application.

### Barebones Application
The barebones application is a minimalist, no bells or whistles application.  It includes MongoDB, Express (with bodyparser for JSON parsing), Angular, Twitter Bootstrap, JQuery, and Angular UI-Router.  The directory structure for the barebones application is as follows:

```
MJTest/
|-- package.json
|-- bower.json
|-- config.json
└── app
    ├── client
    │   ├── app.js
    │   └── index
    │       ├── HomeCtrl.js
    │       ├── home.html
    │       ├── index.css
    │       ├── index.html
    │       └── index.js
    └── server
        └── server.js
```

The top-level directory contians JSON files for npm and bower as well as an application configuration file containing the port number for the project.  The app directory contains all of the project source files for both the client and server.  The server contains a single javascript file which is already set up to use Express to serve your project's static files.  The client contains a top-level javascript file named `app.js` which creates the main Angular module.  The barebones application contains a single module named `index`, which contains the application's main `index.html` file.  It also contains an `index.js` file which sets up all frontend routes.  By default, the application contains only a single route, with the `home.html` view and `HomeCtrl.js` controller.  Styling for the index module is found in the `index.css` file.

To view the barebones application, run the `server.js` file with Node.js:

```
node app/server/server.js
```

Then navigate to [http://localhost:9000](http://localhost:9000) to view the app.

### Default Application
**Coming Soon!**  The default generator is a way to get started quickly and provides some of the more commonly used developer tools right out of the box.  It also creates a simple user login app as a starting point for building your application.  The Default generator is great for beginners that want to learn about web development but don't know where to start or what tools to use.

### Custom Application
**Coming Soon!**  The custom generator allows the more seasoned developer to pick and choose exactly what dev tools they want to use and to start with either an empty project or the user login project.

## Subgenerators
Meanerjs comes with subgenerators for creating new files with Angular and Express.

### Module
Each module in your Meanerjs project is a separate page running an Angular application.  For single-page applications, only a single module is necessary.  However, many applications contain more than a single page, and Meanerjs uses modules to support this.  All modules are created as subdirectories within the `app/client` directory.  The Express server uses this structure to automatically serve the index.html file within each module when directed to the corresponding route.  To create a new module, use the following command from within any of your project directories:

```
yo meanerjs:module
```

You will then be prompted for the module name.  If you wish to skip the prompts, add the module name as an argument to the subgenerator:

```
yo meanerjs:module <modulename>
```

Meanerjs will create a new directory with the name of the module within the `app/client` folder.  The module will contain an index.html file with the main html code, a javascript file with the name of the module that contains the frontend routes for that module, a css file for styling the module, and an angular view and controller.  To use the new module, you can navigate to `http://localhost:9000/<modulename>` or create a link from an existing module using an `<a>` tag.  By default, the new module will display some text and a sidebar with a link to return to the index module.

### UI Route
UI routes allow you to generate both an Angular view and controller and to create an associated state with UI-Router.  To create a new route, navigate to the directory where you want to create the route and run the following:

```
yo meanerjs:uiroute
```

The generator will prompt you for several names and then generate an HTML file for your view and a javascript file for your controller in the directory where you ran the generator.  It will also search for a `<modulename>.js` file and add a new route to that file and import your controller source in the module's index.html file.  To use your new route, add `<a ui-sref="routename">My Route</a>` to your module's `index.html` file.

### View
Angular views are HTML partials that are loaded by the Angular application using AJAX requests.  This is usually done when changing state with UI-Router, so in most cases you will want to use the `meanerjs:uiroute` generator instead.  However, if you would like to generate a view without a controller and a new route, you can navigate to the directory where you want to create the view and use the following command:

```
yo meanerjs:view
```

For convenience, you can also provide a name for your view as follows:

```
yo meanerjs:view <viewname>
```

### Controller
In most cases you will want to use the `meanerjs:uiroute` generator to create a new view and route along with your controller.  However, to create just a controller, navigate to the directory where you want the controller and run the following:

```
yo meanerjs:controller
```

For convenience, you can provide the name of the controller and module as arguments to the generator:

```
yo meanerjs:controller <controllername> <modulename>
```

If you provide a module name as an argument, it must be equal to the name of one of the subdirectories of `app/client`.  The new controller's source will be linked automatically to the module's `index.html` file.

### Service
To create a new Angular service (factory), navigate to the desired directory and run the following command:

```
yo meanerjs:service
```

You can also specify the name of the service as an argument as follows:

```
yo meanerjs:service <servicename> <modulename>
```

If you provide a module name as an argument, it must be equal to the name of one of the subdirectories of `app/client`.  The service source will be added automatically to the module's `index.html` file.

### Directive
To create a new Angular directive, navigate to the desired directory and run the following:

```
yo meanerjs:directive
```

For convenience, you can provide the directive and module names as arguments:

```
yo meanerjs:directive <directivename> <modulename>
```

If you provide a module name as an argument, it must be equal to the name of one of the subdirectories of `app/client`.  The directive source will be added automatically to the module's `index.html` file.

### Filter
To create a new Angular filter, navigate to the desired directory and run the following:

```
yo meanerjs:filter
```

For convenience, you can provide the filter and module names as arguments:

```
yo meanerjs:filter <filtername> <modulename>
```

If you provide a module name as an argument, it must be equal to the name of one of the subdirectories of `app/client`.  The filter source will be added automatically to the module's `index.html` file.

### Express Route
To create a new server-side route, navigate to the desired directory and use the route subgenerator:

```
yo meanerjs:route
```

For convenience, add the route name as an argument:

```
yo meanerjs:route <routename>
```

To use your route, set `require('/path/to/route')` as the second argument to the Express `use`, `get`, or `post` function in the `server.js` file.
