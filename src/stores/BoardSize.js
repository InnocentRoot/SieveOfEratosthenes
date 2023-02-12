import { writable } from 'svelte/store';

export const currentRowSize = writable(30);
export const currentColSize = writable(30);
export const currentSelectedSize = writable(3)
export const isBoardClean = writable(true)