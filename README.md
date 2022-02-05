# validate.js

A simple, Laravelian, way to validate JavaScript forms.

---

## Table of Contents

1. [Installation](#installation)
2. [Introduction](#introduction)
3. [Nested Objects](#nested-objects)
4. [Wildcard Character](#wildcard-character)
5. [Messages](#messages)
6. [Rules](#rules)

---

## Installation

```
npm i @mikkjal/validate.js
```

## Introduction

```js
const form = {
    email: 'test@example.com',
    password: 'Haken 123',
    password_confirmation: '',
};

const rules = {
    email: 'required|email',
    password: 'required|min:8|confirmed',
};

const $v = validate(form, rules);
```

```json
{
    "valid": false,
    "email": {
        "required": true,
        "email": true
    },
    "password": {
        "required": true,
        "min": true,
        "confirmed": false
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

## Wildcard Character

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

## Messages

```js
const form = {
    email: 'test@example.com',
    password: 'Test123',
    password_confirmation: '',
};

const rules = {
    email: 'required|email',
    password: 'required|min:8|confirmed',
};

const messages = {
    'email.required': 'Email address is required',
    'password.min': 'The password needs to be at least 8 characters',
    'password.confirmed': 'The passwords do not match',
};

const $v = validate(form, rules, messages);
```

```json
{
    "valid": false,
    "email": {
        "required": true,
        "email": true
    },
    "password": {
        "required": true,
        "min": false,
        "messages": ["The password needs to be at least 8 characters", "The passwords do not match"],
        "confirmed": false
    }
}
```

## Rules

### required

```js
const rules = {
    name: 'required',
};
```

### email

```js
const rules = {
    email: 'email',
};
```

### regex

```js
const rules = {
    number: 'regex:/^[0-9]{6}$/',
};
```

### same

```js
const rules = {
    password: 'same:password_confirmation',
};
```

### different

```js
const rules = {
    password: 'different:password_confirmation',
};
```

### confirmed

```js
const rules = {
    password: 'confirmed',
};
```

### in

```js
const rules = {
    name: 'in:mikkjal,signar',
};
```

### not_in

```js
const rules = {
    name: 'not_in:mikkjal,signar',
};
```

### starts_with

```js
const rules = {
    text: 'starts_with:Hello',
};
```

### ends_with

```js
const rules = {
    text: 'ends:world!',
};
```

### required_with

```js
const rules = {
    password: 'required_with:name,email',
};
```

### required_with_all

```js
const rules = {
    password: 'required_with_all:name,email',
};
```

### required_without

```js
const rules = {
    password: 'required_without:name,email',
};
```

### required_without_all

```js
const rules = {
    password: 'required_without_all:name,email',
};
```

### numeric

```js
const rules = {
    age: 'numeric',
};
```

### min

```js
const rules = {
    age: 'min:18',
};
```

### max

```js
const rules = {
    age: 'max:122',
};
```

### between

```js
const rules = {
    age: 'between:18,122',
};
```

### date

```js
const rules = {
    dob: 'date',
};
```

### after

```js
const rules = {
    dob: 'after:2000-01-01',
};
```

### before

```js
const rules = {
    dob: 'before:2000-01-01',
};
```
