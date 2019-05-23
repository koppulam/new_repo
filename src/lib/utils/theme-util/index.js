import domUtil from 'lib/dom/dom-util';

let appliedTheme;

export function applyPreviousTheme(domTarget = 'body', theme) {
	const bodyRef = domUtil.findFirst(domTarget, null);
	domUtil.removeClass(bodyRef, theme);
	domUtil.addClass(bodyRef, appliedTheme);
}

export function toggleTheme(theme) {
	const bodyRef = domUtil.findFirst('body', null);
	if (theme === 'men') {
		appliedTheme = 'women';
		domUtil.removeClass(bodyRef, 'women');
	}
	if (theme === 'women') {
		appliedTheme = 'men';
		domUtil.removeClass(bodyRef, 'men');
	}
	domUtil.addClass(bodyRef, theme);
}
