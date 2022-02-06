const validate = require('.');

var assert = require('assert');

describe('rules', function () {
    it('should fail when required fields are not present', function () {
        const form = {
            name: '',
        };

        const $v = validate(form, {
            name: 'required',
        });

        assert.equal($v.valid, false);
    });

    it('should not fail when required fields are present, even though other fields are not present', function () {
        const form = {
            name: 'mikkjal',
            email: '',
        };

        const $v = validate(form, {
            name: 'required',
            email: 'email',
        });

        assert.equal($v.valid, true);
    });

    it('should not fail when using min for number, string or array', function () {
        const form = {
            test: {
                number: 3,
                string: 'Hello, world!',
                array: ['Hello', ',', 'world', '!'],
            },
        };

        const $v = validate(form, {
            'test.*': 'required|min:3',
        });

        assert.equal($v.valid, true);
    });

    it('should not fail when using max for number, string or array', function () {
        const form = {
            test: {
                number: 4,
                string: 'Hell',
                array: ['Hello', ',', 'world', '!'],
            },
        };

        const $v = validate(form, {
            'test.*': 'required|max:4',
        });

        assert.equal($v.valid, true);
    });

    it('should not fail when using between for number, string or array', function () {
        const form = {
            test: {
                number: 3,
                string: 'Hello, world!',
                array: ['Hello', ', ', 'world', '!'],
            },
        };

        const $v = validate(form, {
            'test.*': 'required|between:3,13',
        });

        assert.equal($v.valid, true);
    });
});
