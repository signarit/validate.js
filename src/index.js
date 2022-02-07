import rules from './rules';

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
            if (key.includes('*')) {
                continue;
            }

            form[key] = '';
        }
    }

    // add wildcard rules
    for (const [key, value] of Object.entries(args)) {
        if (!value) {
            continue;
        }

        if (!key.includes('*')) {
            continue;
        }

        const wildcard = { key, value };

        for (const [key] of Object.entries(form)) {
            if (key == wildcard.key) {
                continue;
            }

            let prepend = '';

            if (/^\*/.test(wildcard.key)) {
                prepend = '.';
            }

            const regex = RegExp(`^${prepend}${wildcard.key.replace(/\.\*/, '\\.+')}`);

            if (regex.test(key)) {
                if (args[key]) {
                    args[key] = `${args[key]}|${wildcard.value}`;
                } else {
                    args[key] = wildcard.value;
                }
            }
        }

        delete args[key];
    }

    // add wildcard messages
    for (const [key, value] of Object.entries(messages)) {
        if (!value) {
            continue;
        }

        if (!key.includes('*')) {
            continue;
        }

        const wildcard = { key, value };

        for (const [key] of Object.entries(form)) {
            if (key == wildcard.key) {
                continue;
            }

            let prepend = '';

            if (/^\*/.test(wildcard.key)) {
                prepend = '.';
            }

            const rule = wildcard.key.substring(wildcard.key.lastIndexOf('.') + 1);

            const regex = RegExp(`^${prepend}${wildcard.key.substring(0, wildcard.key.lastIndexOf('.')).replace(/\.\*/, '\\.+')}`);

            if (regex.test(key)) {
                messages[`${key}.${rule}`] = wildcard.value;
            }
        }

        delete messages[key];
    }

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

export default validate;
