const rules = {
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

export default rules;
