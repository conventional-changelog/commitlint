import {bodyCase} from './body-case';
import {bodyEmpty} from './body-empty';
import {bodyFullStop} from './body-full-stop';
import {bodyLeadingBlank} from './body-leading-blank';
import {bodyMaxLength} from './body-max-length';
import {bodyMaxLineLength} from './body-max-line-length';
import {bodyMinLength} from './body-min-length';
import {footerEmpty} from './footer-empty';
import {footerLeadingBlank} from './footer-leading-blank';
import {footerMaxLength} from './footer-max-length';
import {footerMaxLineLength} from './footer-max-line-length';
import {footerMinLength} from './footer-min-length';
import {headerCase} from './header-case';
import {headerFullStop} from './header-full-stop';
import {headerMaxLength} from './header-max-length';
import {headerMinLength} from './header-min-length';
import {referencesEmpty} from './references-empty';
import {scopeCase} from './scope-case';
import {scopeEmpty} from './scope-empty';
import {scopeEnum} from './scope-enum';
import {scopeMaxLength} from './scope-max-length';
import {scopeMinLength} from './scope-min-length';
import {signedOffBy} from './signed-off-by';
import {subjectBreaking} from './subject-breaking';
import {subjectCase} from './subject-case';
import {subjectEmpty} from './subject-empty';
import {subjectFullStop} from './subject-full-stop';
import {subjectMaxLength} from './subject-max-length';
import {subjectMinLength} from './subject-min-length';
import {subjectExclamationMark} from './subject-exclamation-mark';
import {trailerExists} from './trailer-exists';
import {typeCase} from './type-case';
import {typeEmpty} from './type-empty';
import {typeEnum} from './type-enum';
import {typeMaxLength} from './type-max-length';
import {typeMinLength} from './type-min-length';

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
	'references-empty': referencesEmpty,
	'scope-case': scopeCase,
	'scope-empty': scopeEmpty,
	'scope-enum': scopeEnum,
	'scope-max-length': scopeMaxLength,
	'scope-min-length': scopeMinLength,
	'signed-off-by': signedOffBy,
	'subject-breaking': subjectBreaking,
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
