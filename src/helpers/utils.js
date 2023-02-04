function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`
}

function lastDigit(number) {
    return number.toString()[number.toString().length - 1];
}

export function formatTime(milliseconds) {
    const minutes = zeroPadded(Math.floor(milliseconds / 1000 / 60))
    const seconds = zeroPadded(Math.floor(milliseconds / 1000) % 60)
    const tenOfSeconds = lastDigit(Math.floor(milliseconds / 100))

    return `${minutes}:${seconds}:${tenOfSeconds}`
}