# validate.js

A simple, Laravelian, way to validate forms.

## Installation

```
npm i @mikkjal/validate.js
```

## Introduction

```js
const form = {
    name: 'Mikkjal',
};

const rules = {
    name: 'required',
    email: 'required|email',
};

const $v = validate(form, rules);
```

```json
{
    "valid": false,
    "name": {
        "required": true
    },
    "email": {
        "required": false,
        "email": false
    }
}
```

## Nested objects

```js
const form = {
    name: 'mikkjal',
    job: {
        title: 'Full-stack Developer',
        email: 'mikkjal@example.com',
    },
};

let rules = {
    name: 'required',
    job: {
        title: 'required|ends_with:Developer',
        email: 'required|email',
    },
    email: 'required|email',
};

// or

rules = {
    name: 'required',
    'job.title': 'required|ends_with:Developer',
    'job.email': 'required|email',
    email: 'required|email',
};

const $v = validate(form, rules);
```

```json
{
    "valid": false,
    "name": {
        "required": true
    },
    "job": {
        "title": {
            "required": true,
            "ends_with": true
        },
        "email": {
            "required": true,
            "email": true
        }
    },
    "email": {
        "required": false,
        "email": false
    }
}
```

## Wildcard character

```js
const form = {
    name: 'mikkjal',
    personal_email: '',
    job: {
        title: 'Full-stack Developer',
        email: 'mikkjal@example.com',
    },
};

const $v = validate(form, {
    '*email': 'email',
    'job.*': 'required',
});
```

```json
{
    "valid": false,
    "personal_email": {
        "email": false
    },
    "job": {
        "email": {
            "required": true,
            "email": true
        },
        "title": {
            "required": true
        }
    }
}
```
