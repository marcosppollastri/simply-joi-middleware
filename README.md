# Simply Joi Middleware

<div align="center">

<!-- [![Build Status](https://github.com/marcosppollastri/simply-express-generator/actions/workflows/main.yml/badge.svg)](https://github.com/marcosppollastri/simply-express-generator/actions) -->
[![NPM version](https://img.shields.io/npm/v/simply-joi-middleware.svg?style=flat)](https://www.npmjs.com/package/simply-joi-middleware)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

</div>

<p align="center">
    <img src="https://github.com/marcosppollastri/simply-joi-middleware/blob/master/logo.svg?raw=true" alt="Logo" width="500" />
</p>

Simply Joi Middleware is an easy-to-use Express middleware library that leverages the powerful schema description language and data validator of Joi. It simplifies the process of validating incoming requests in an Express application.

The middleware accepts any Joi schema and validates the request's body, query, or headers against it. If the validation fails, it responds with an HTTP error 400 (Bad Request). However, if the request passes the validation, it proceeds to the next middleware in the stack.

## Installation

To install the Simply Joi Middleware package via npm, you can use the following command:

```bash
npm install simply-joi-middleware
```
## Usage
Import the validation middleware, targets enum, and Joi from the respective modules. Then, define your Joi schema:
```ts
import { Router } from 'express';
import * as Joi from 'joi';
import { Targets, validate } from 'simply-joi-middleware';

const schema = Joi.object({
    name: Joi.string().required()
});
```
Then, apply the `validate` middleware to your routes:
```ts
const AppRouter: Router = Router();

AppRouter.get('/', validate(schema, Targets.QUERY), yourController);
```
In this example, incoming GET requests to the root (/) will have their query parameters validated against the schema. If the name parameter is missing or not a string, the middleware will respond with a 400 Bad Request error.

This process can be repeated for all the routes you wish to validate, adjusting the schema and target as needed.

### `nextOnError` option
The nextOnError option is a new feature in the simply-joi-middleware package. This is an optional setting that allows developers to customize how the middleware behaves when validation fails.

By default, if a validation error occurs, `simply-joi-middleware` will terminate the request-response cycle by sending an HTTP error 400 Bad Request and will not call the `next()` function.

However, with the `nextOnError` option, you can override this behavior. When `nextOnError` is set to true, the middleware will call the `next(err)` function and pass control to the next middleware in the stack if the validation fails.

Here's a code example that shows how to use this option:

```ts
const AppRouter: Router = Router();
const schema = Joi.object({
    name: Joi.string().required()
});

const validationMiddleware = validate(schema, Targets.QUERY, undefined, {nextOnError: true});

AppRouter.get('/', validationMiddleware, AppController);
```

In this example, if the `name` query parameter is not provided or invalid, the `validationMiddleware` will call `next(err)`. This allows you to handle the error in subsequent middleware or error handlers as per your application's error handling strategy.

This provides more control over how validation errors are handled in your application and can be particularly useful when you want to include additional logging, error transformations or other custom error handling logic after a validation failure.



## Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/marcosppollastri/simply-joi-middleware/issues).

## License

This project is [ISC](https://opensource.org/licenses/ISC) licensed.