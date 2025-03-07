import {bodyCase} from './body-case.js';
import {bodyEmpty} from './body-empty.js';
import {bodyFullStop} from './body-full-stop.js';
import {bodyLeadingBlank} from './body-leading-blank.js';
import {bodyMaxLength} from './body-max-length.js';
import {bodyMaxLineLength} from './body-max-line-length.js';
import {bodyMinLength} from './body-min-length.js';
import {footerEmpty} from './footer-empty.js';
import {footerLeadingBlank} from './footer-leading-blank.js';
import {footerMaxLength} from './footer-max-length.js';
import {footerMaxLineLength} from './footer-max-line-length.js';
import {footerMinLength} from './footer-min-length.js';
import {headerCase} from './header-case.js';
import {headerFullStop} from './header-full-stop.js';
import {headerMaxLength} from './header-max-length.js';
import {headerMinLength} from './header-min-length.js';
import {headerTrim} from './header-trim.js';
import {referencesEmpty} from './references-empty.js';
import {scopeCase} from './scope-case.js';
import {scopeEmpty} from './scope-empty.js';
import {scopeEnum} from './scope-enum.js';
import {scopeMaxLength} from './scope-max-length.js';
import {scopeMinLength} from './scope-min-length.js';
import {signedOffBy} from './signed-off-by.js';
import {subjectCase} from './subject-case.js';
import {subjectEmpty} from './subject-empty.js';
import {subjectFullStop} from './subject-full-stop.js';
import {subjectMaxLength} from './subject-max-length.js';
import {subjectMinLength} from './subject-min-length.js';
import {subjectExclamationMark} from './subject-exclamation-mark.js';
import {trailerExists} from './trailer-exists.js';
import {typeCase} from './type-case.js';
import {typeEmpty} from './type-empty.js';
import {typeEnum} from './type-enum.js';
import {typeMaxLength} from './type-max-length.js';
import {typeMinLength} from './type-min-length.js';

export default {
	'body-case': bodyCase,
	'body-empty': bodyEmpty,
	'body-full-stop': bodyFullStop,
	'body-leading-blank': bodyLeadingBlank,
	'body-max-length': bodyMaxLength,
	'body-max-line-length': bodyMaxLineLength,
	'body-min-length': bodyMinLength,
	'footer-empty': footerEmpty,
	'footer-leading-blank': footerLeadingBlank,
	'footer-max-length': footerMaxLength,
	'footer-max-line-length': footerMaxLineLength,
	'footer-min-length': footerMinLength,
	'header-case': headerCase,
	'header-full-stop': headerFullStop,
	'header-max-length': headerMaxLength,
	'header-min-length': headerMinLength,
	'header-trim': headerTrim,
	'references-empty': referencesEmpty,
	'scope-case': scopeCase,
	'scope-empty': scopeEmpty,
	'scope-enum': scopeEnum,
	'scope-max-length': scopeMaxLength,
	'scope-min-length': scopeMinLength,
	'signed-off-by': signedOffBy,
	'subject-case': subjectCase,
	'subject-empty': subjectEmpty,
	'subject-full-stop': subjectFullStop,
	'subject-max-length': subjectMaxLength,
	'subject-min-length': subjectMinLength,
	'subject-exclamation-mark': subjectExclamationMark,
	'trailer-exists': trailerExists,
	'type-case': typeCase,
	'type-empty': typeEmpty,
	'type-enum': typeEnum,
	'type-max-length': typeMaxLength,
	'type-min-length': typeMinLength,
};
