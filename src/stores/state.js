import { writable } from "svelte/store"


export const isRunning = writable(false)
export const runningTime = writable(0)