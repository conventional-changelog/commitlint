'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _message = require('@commitlint/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (parsed, when, value) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	const negated = when === 'never';
	const hasSign = input.search(value) !== -1;

	return [negated ? !hasSign : hasSign, (0, _message2.default)(['subject', negated ? 'may not' : 'must', `including ${ value }`])];
};

module.exports = exports['default'];
