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

        if (isNaN(value)) {
            return false;
        }

        value = Number(value);

        if (value < min || value > max) {
            return false;
        }

        return true;
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

export default rules;
