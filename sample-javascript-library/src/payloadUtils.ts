// src/payloadUtils.ts
import { v4  as  uuidv4 } from  'uuid';
import { OriginData } from './Origin';

export function createSendablePayload(payloads: any[] = [], uuid: string | null = null): any {
	uuid = uuid ?? uuidv4({}).toString();
	return { uuid, payloads, meta: { my_package_version: "1.0.0" } };
}

export function createPayload(type: string, label: string | undefined, content: any, contentName: string = 'content'): any {
	let result = {
		type: type,
		content: {
	        [contentName]: content,
	        label: label,
        },
        origin: OriginData,
	};
	
	if (result.content.label === undefined) {
		delete result.content['label'];
	}
	
	return result;
}

// change the color of a previously sent payload in Ray
export function createColorPayload(colorName: string, uuid: string | null = null) {
	const payload = createPayload('color', undefined, colorName, 'color');
	return createSendablePayload([payload], uuid);
}

// create an "HTML" payload to display custom HTML in Ray
export function createHtmlPayload(htmlContent: string, uuid: string | null = null) {
	const payload = createPayload('custom', 'HTML', htmlContent);
	return createSendablePayload([payload], uuid);
}


// create a "log" payload to display basic text in Ray
export function createLogPayload(text: string, uuid: string | null = null) {
	const payload = createPayload('log', 'log', text);
	return createSendablePayload([payload], uuid);
}
