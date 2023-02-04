import { writable } from "svelte/store";

export const activeNumber = writable(-1);
export const currentOp = writable('');
export const speed = writable(1100);