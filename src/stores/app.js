import { writable } from "svelte/store"

export const theme = writable('light')
export const algorithmSpeed = writable(1000)