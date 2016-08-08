*Note* This is just a base tool for front projects.

# Front base

It's just a recipe for compiling twig templates and preprocessor styles and then serving the compiled site while developing. It features Twig (twig.js, with designed-in support for JSON data retrieval), SASS, CSS minification, JS compilation and BrowserSync.

## How to install

Download or clone this repository and run:

	`npm install`

to install all dependencies.

## How to use

A single line will get project up and running.

`gulp serve`

This will compile all of the assets and launch BrowserSync. Your browser should open and display the src/templates/urls/index.html page (now compiled to dist/index.html).

For as long as you leave this process running, all of your project assets will be watched and as soon as they are changed you'll see the changes in your browser.

## Project Structure

There are two main folders in the project:

* src - This holds all of your source files. Some sample ones are in place.
* dist - Once you execute mulch this will be created and it holds all of the compiled assets and html pages. This is also where BrowserSync looks to serve content. If you need images, you'll need to put them in here.

### Twig Structure

The most interesting folder in src is "templates". This is where all the twig templates go. Inside this directory is a "urls" folder. Every template in this folder will be treated as an accessible URL by BrowserSync once things are compiled. So if you want an /about.html page, create "templates/urls/about.html". It also uses subfolders correctly so "templates/urls/about/team.html" will show up at /about/team.html.

### Data Folder

This folder can contain any number of valid json files. These will be made available to all twig templates indexed against their filename. So a file named "foo.json" would be available in the templates with {{ foo }}. This is a helpful way to inject/use some data from a project you are mocking up.

### SCSS Folder

The target file will be the top-level all.less. This can @include any other files you wish to use.

### Js Folder

All scripts in the scripts folder are compiled and minified, in alphabetical order. The scripts in the /libs subdirectory are added first.

## All commands

Each sub-task is available via gulp if you wish to run them independently. They are:

* **browser-sync** - Launches BrowserSync
* **twig** - Compiles all json data files, and then compiles all twig templates
* **sass** - Compiles LESS files
* **scripts** - Compiles all scripts
* **build** - Compiles all assets in the correct order (less, scripts, twig). Useful if you're using this recipe without BrowserSync
* **serve** - Compiles all assets, launches BrowserSync and then watches files for changes