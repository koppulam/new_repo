import getValue from 'object-getvalue';

import { DEFAULT_LABELS } from 'global-config/labels';

let windowLabels = {};

export function cacheWindowLabel() {
	windowLabels = window.DY_SR.labels;
}

export default function getLabel(key) {
	if (Object.keys(windowLabels).length === 0) {
		cacheWindowLabel();
	}
	const label = getValue(windowLabels, key, getValue(DEFAULT_LABELS, key));
	return label;
}
