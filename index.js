'use strict';

const rules = {
    after({ value, args }) {
        if (!new Date(value).getTime() || !new Date(args).getTime()) {
            return false;
        }

        return new Date(value).getTime() > new Date(args).getTime();
    },

    ascii({ value }) {
        return !/[^\x00-\x7F]+\ *(?:[^\x00-\x7F]| )*/g.test(value);
    },

    before({ value, args }) {
        if (!new Date(value).getTime() || !new Date(args).getTime()) {
            return false;
        }

        return new Date(value).getTime() < new Date(args).getTime();
    },

    between({ value, args }) {
        const [min, max] = args.split(',');

        if (!isNaN(value)) {
            value = Number(value);

            return value >= Number(min) && value <= Number(max);
        }

        return value.length >= Number(min) && value.length <= Number(max);
    },

    confirmed({ value, form, key }) {
        return value == form[`${key}_confirmation`];
    },

    date({ value }) {
        return !!new Date(value).getTime();
    },

    different(options) {
        return !this.same(options);
    },

    email({ value }) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
            value
        );
    },

    ends_with({ value, args }) {
        return RegExp(`${args}$`).test(value);
    },

    hex({ value }) {
        return /^#([\da-fA-F]{3}){1,2}$/g.test(value);
    },

    in({ value, args }) {
        args = args.split(',');

        return args.includes(value);
    },

    ip({ value }) {
        return /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/gi.test(value);
    },

    mac_address({ value }) {
        return /(([0-9A-Fa-f]{2}[-:]){5}[0-9A-Fa-f]{2})|(([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/gi.test(value);
    },

    max({ value, args }) {
        if (!isNaN(value)) {
            return Number(value) <= Number(args);
        }

        return value.length <= Number(args);
    },

    min({ value, args }) {
        if (!isNaN(value)) {
            return Number(value) >= Number(args);
        }

        return value.length >= Number(args);
    },

    not_in(options) {
        return !this.in(options);
    },

    not_regex(options) {
        return !this.regex(options);
    },

    numeric({ value }) {
        return /^[0-9]+$/.test(value);
    },

    regex({ value, args }) {
        args = args.replace(/\//g, '');

        return RegExp(args).test(value);
    },

    required({ value }) {
        return !!value;
    },

    required_with({ value, args, form }) {
        if (!!value) {
            return true;
        }

        args = args.split(',');

        for (const arg of args) {
            if (form[arg]) {
                return false;
            }
        }

        return true;
    },

    required_with_all({ value, args, form }) {
        if (!!value) {
            return true;
        }

        args = args.split(',');

        for (const arg of args) {
            if (!form[arg]) {
                return true;
            }
        }

        return false;
    },

    required_without(options) {
        return !this.required_with(options);
    },

    required_without_all(options) {
        return !this.required_with_all(options);
    },

    same({ value, args, form }) {
        return value == form[args];
    },

    starts_with({ value, args }) {
        return RegExp(`^${args}`).test(value);
    },

    url({ value }) {
        return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(value);
    },

    uuid({ value }) {
        return /[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}/g.test(value);
    },
};

/**
 * Flatten an Object.
 * @param {*} object
 * @param {*} pre
 * @returns
 */
function flatten(object, pre = '') {
    let flatObject = {};

    for (let [key, value] of Object.entries(object)) {
        if (typeof value == 'object' && !value.length) {
            flatObject = { ...flatObject, ...flatten(value, `${pre + key}.`) };
        } else {
            flatObject[pre + key] = value;
        }
    }

    return flatObject;
}

/**
 * Roughen a flat object.
 * @param {*} flatObject
 * @returns
 */
function roughen(flatObject) {
    let object = {};

    for (let [key, value] of Object.entries(flatObject)) {
        const keys = key.split('.');

        keys.reduce((obj, i, currentIndex) => {
            if (currentIndex == keys.length - 1) {
                obj[i] = value;

                return;
            }

            if (!obj[i]) {
                obj[i] = {};
            } else {
                obj[i] = { ...obj[i] };
            }

            return obj[i];
        }, object);
    }

    return object;
}

/**
 * Validate a form.
 * @param {*} object
 * @param {*} args
 * @param {*} messages
 * @returns
 */
function validate(form, args, messages = {}) {
    // the validate object
    let object = {
        valid: true,
    };

    // flatten the objects
    form = flatten(form);
    args = flatten(args);
    messages = flatten(messages);

    // add non-existing objects to the form
    for (const [key] of Object.entries(args)) {
        if (!Object.keys(form).includes(key)) {
            form[key] = '';
        }
    }

    // add wildcard character where matching
    for (const [key, value] of Object.entries(args)) {
        if (!value) {
            continue;
        }

        if (key.includes('*')) {
            const wildcard = { key, value };

            for (const [key, value] of Object.entries(form)) {
                if (key == wildcard.key) {
                    continue;
                }

                if (/^\*/.test(wildcard.key)) {
                    wildcard.key = '.*' + wildcard.key.substring(1);
                }

                if (RegExp(`^${wildcard.key.replace(/\./g, '\\.').replace(/\*/g, '+')}`).test(key)) {
                    if (args[key]) {
                        args[key] = `${wildcard.value}|${args[key]}`;
                    } else {
                        args[key] = wildcard.value;
                    }
                }
            }

            delete args[key];
        }
    }

    // all objects
    for (let [key, ruleList] of Object.entries(args)) {
        // "valid" is a reserved keyword
        if (!key || key == 'valid') {
            continue;
        }

        if (typeof ruleList == 'string') {
            ruleList = ruleList.split('|');
        }

        // every rule belonging to the key
        for (let rule of ruleList) {
            let args = [];

            // the rule has arguments
            if (rule.includes(':')) {
                [rule, args] = rule.split(':');
            }

            // the rule does not exist
            if (typeof rules[rule] != 'function') {
                continue;
            }

            // initialize object for rule
            if (!object[key]) {
                object[key] = {};
            }

            // add increment if multiple of same rule
            let increment = '';
            while (typeof object[key][`${rule}${increment}`] == 'boolean') {
                +increment++;
            }

            // get the value of the object
            let value = form[key];

            // check validate the object
            const isValid = rules[rule]({
                value,
                form,
                args,
                key,
            });

            // add "is valid" to the key
            object[key][`${rule}${increment}`] = isValid;

            if (!isValid) {
                // if any of the objects are invalid, so is the object
                if (value || rule.includes('required')) {
                    object.valid = false;
                }

                // add the first invalid message
                if (messages[`${key}.${rule}${increment}`]) {
                    if (!object[key].messages?.length) {
                        object[key].messages = [];
                    }

                    object[key].messages = [...object[key].messages, messages[`${key}.${rule}${increment}`]];
                }
            }
        }
    }

    return roughen(object);
}

module.exports = validate;
