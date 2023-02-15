import { writable } from "svelte/store";

export const activeNumber = writable(-1);
export const currentOperation = writable('');
export const currentOperationDescription = writable('');
export const speed = writable(1100);