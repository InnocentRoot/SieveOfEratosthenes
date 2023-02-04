import { derived, readable } from "svelte/store";

export const time = readable(0, function start(set) {
    const start = new Date()

    const interval = setInterval(() => {
        const current = new Date()
        set(current.getTime() - start.getTime())
    }, 10)


    return function stop() {
        set(0)
        clearInterval(interval)
    }
})