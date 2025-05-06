# Tallinn Design System

This is the documentation website for the Tallinn Design System, built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## About

The Tallinn Design System provides a comprehensive set of design guidelines, UI components, and patterns for creating consistent digital experiences across Tallinn city services and applications.

## Project Structure

- **docs/getting-started**: Onboarding documentation for new users
- **docs/foundations**: Core design principles and guidelines
- **docs/components**: Reusable UI component documentation
- **docs/patterns**: Common UI patterns and usage guidelines

## Features

- Comprehensive component library with live examples
- Design guidelines and best practices
- Implementation resources for developers
- Versioned documentation

## Tech Stack

- **Docusaurus**: Documentation framework
- **React**: UI library for interactive examples
- **SASS**: CSS preprocessor for styling
- **Live Code Block**: Interactive code examples

## Installation

```
$ yarn
```

## Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### SASS Compilation

To watch and compile SASS files:

```
$ yarn styles
```

## Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.


## Versioning

Docusaurus supports versioned documentation. To manage versions:

```
# Create a new version snapshot
$ yarn docusaurus docs:version 2.0.1

# List all available commands
$ yarn docusaurus --help
```

The versioning system allows you to:
- Maintain multiple versions of your documentation
- Let users switch between versions via the version dropdown
- Create new versions when releasing major updates

Current versions are configured in `docusaurus.config.js`.

> **Important:** HTML Templates must be versioned manually. The automatic versioning commands do not handle HTML Templates - you'll need to maintain these separately for each version.
> 
> **Important:** CSS files should also be versioned manually. When creating a new version, ensure that corresponding CSS styles are properly maintained across versions.