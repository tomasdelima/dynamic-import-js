A library to generate an importation file to require all local **JS** and **JSX** files.

# Installation

## Install the package

`npm install dynamic-import-js --save`

or

`yarn add dynamic-import-js --save`

## Configure the package

Add a file named `.dynamic-import-js.json` at the root folder with the following structure:

```
{
  "root": "./path/to/your/root/js/files",
  "exceptions": [
    "file-1.txt",
    "folder/file-2.js",
    ...
  ]
}
```

The key `root` is the path, relative to the project folder, where all `JS` and `JSX` files will be scanned.
The key `exceptions` is a list of files paths, relative to the `root` folder, that will not be included in the generated file.

## Configure the `make-import` command

Merge the following with your `packaje.json` file:

```
{
  "scripts": {
    "make-import": "node ./node_modules/dynamic-import-js"
  }
}
```

# Usage

Run the following at the root folder:

`npm run make-import`

This will create a file named `local-modules.js` at the `root` path with all the `require` statements, globally assigned.
