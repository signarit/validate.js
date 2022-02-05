let rules = {
    required({ value }) {
        return !!value;
    },

    email({ value }) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
        );
    },

    regex({ value, args }) {
        args = args.replace(/\//g, '');

        return RegExp(args).test(value);
    },

    same({ value, args, form }) {
        return value == form[args];
    },

    different(options) {
        return !this.same(options);
    },

    confirmed({ value, form, key }) {
        return value == form[`${key}_confirmation`];
    },

    in({ value, args }) {
        args = args.split(',');

        return args.includes(value);
    },

    not_in(options) {
        return !this.in(options);
    },

    starts_with({ value, args }) {
        return RegExp(`^${args}`).test(value);
    },

    ends_with({ value, args }) {
        return RegExp(`${args}$`).test(value);
    },

    json({ value }) {
        try {
            JSON.parse(value);
            return true;
        } catch (_) {
            return false;
        }
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

    // Number Rules

    numeric({ value }) {
        return !isNaN(value);
    },

    min({ value, args }) {
        return value.length >= Number(args);
    },

    max({ value, args }) {
        return value.length <= Number(args);
    },

    between({ value, args }) {
        const [min, max] = args.split(',');

        if (isNaN(value)) {
            return false;
        }

        value = Number(value);

        if (value < min || value > max) {
            return false;
        }

        return true;
    },

    // Date Rules

    date({ value }) {
        return !!new Date(value).getTime();
    },

    after({ value, args }) {
        if (!new Date(value).getTime() || !new Date(args).getTime()) {
            return false;
        }

        return new Date(value).getTime() > new Date(args).getTime();
    },

    before({ value, args }) {
        if (!new Date(value).getTime() || !new Date(args).getTime()) {
            return false;
        }

        return new Date(value).getTime() < new Date(args).getTime();
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
 * Validate a form.
 * @param {*} object
 * @param {*} args
 * @param {*} messages
 * @returns
 */
function validator(form, args, messages = {}) {
    // the validator object
    let validator = {
        valid: true,
    };

    // flatten the objects
    form = flatten(form);
    args = flatten(args);

    // add wildcard character where matching
    for (const [key, value] of Object.entries(args)) {
        if (key.includes('*')) {
            const wildcard = { key, value };

            for (const [key, value] of Object.entries(form)) {
                if (key == wildcard.key) {
                    continue;
                }

                if (/^\*/.test(wildcard.key)) {
                    wildcard.key = '.*' + wildcard.key.substring(1);
                }

                wildcard.key.replace(/\./, '.');

                if (RegExp(`^${wildcard.key}`).test(key)) {
                    args[key] = `${wildcard.value}|${value}`;
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

            // initialize validator for rule
            if (!validator[key]) {
                validator[key] = {};
            }

            // add increment if multiple of same rule
            let increment = '';
            while (typeof validator[key][`${rule}${increment}`] == 'boolean') {
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
            validator[key][`${rule}${increment}`] = isValid;

            if (!isValid) {
                // if any of the objects are invalid, so is the validator
                validator.valid = false;

                if (!messages) {
                    continue;
                }

                // add the first invalid message
                if (!validator[key].message && messages[`${key}.${rule}${increment}`]) {
                    validator[key].message = messages[`${key}.${rule}${increment}`];
                }
            }
        }
    }

    return validator;
}

export default validator;
