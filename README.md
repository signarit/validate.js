# validate.js

A simple, Laravelian, way to validate JavaScript forms.

## Table of Contents

1. [Installation](#installation)
2. [Introduction](#introduction)
3. [Nested Objects](#nested-objects)
4. [Wildcard Character](#wildcard-character)
5. [Messages](#messages)
6. [Rules](#rules)
    - [after](#after)
    - [ascii](#ascii)
    - [before](#before)
    - [between](#between)
    - [confirmed](#confirmed)
    - [date](#date)
    - [different](#different)
    - [email](#email)
    - [ends_with](#ends_with)
    - [hex](#hex)
    - [in](#in)
    - [ip](#ip)
    - [max](#max)
    - [min](#min)
    - [not_in](#not_in)
    - [numeric](#numeric)
    - [regex](#regex)
    - [required](#required)
    - [required_with](#required_with)
    - [required_with_all](#required_with_all)
    - [required_without](#required_without)
    - [required_without_all](#required_without_all)
    - [same](#same)
    - [starts_with](#starts_with)
    - [url](#url)

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

### after

```js
const rules = {
    dob: 'after:2000-01-01',
};
```

### ascii

```js
const rules = {
    text: 'ascii',
};
```

### before

```js
const rules = {
    dob: 'before:2000-01-01',
};
```

### between

```js
const rules = {
    age: 'between:18,122',
};
```

### confirmed

```js
const rules = {
    password: 'confirmed',
};
```

### date

```js
const rules = {
    dob: 'date',
};
```

### different

```js
const rules = {
    password: 'different:username',
};
```

### email

```js
const rules = {
    email: 'email',
};
```

### ends_with

```js
const rules = {
    text: 'ends:world!',
};
```

### hex

```js
const rules = {
    color: 'hex',
};
```

### in

```js
const rules = {
    name: 'in:hello,world',
};
```

### ip

```js
const rules = {
    ip: 'ip',
};
```

### max

```js
const rules = {
    age: 'max:122',
};
```

### min

```js
const rules = {
    age: 'min:18',
};
```

### not_in

```js
const rules = {
    name: 'not_in:mikkjal,signar',
};
```

### numeric

```js
const rules = {
    age: 'numeric',
};
```

### regex

```js
const rules = {
    number: 'regex:/^[0-9]{6}$/',
};
```

### required

```js
const rules = {
    name: 'required',
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

### same

```js
const rules = {
    password: 'same:password_confirmation',
};
```

### starts_with

```js
const rules = {
    text: 'starts_with:Hello',
};
```

### url

```js
const rules = {
    url: 'url',
};
```
