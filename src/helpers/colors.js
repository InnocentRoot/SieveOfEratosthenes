import chroma from "chroma-js"

let colors = [
    '#0d6efd',
    '#FFC228',
    '#ff3399',
    '#12853d',
    '#cf052c',
    '#053a17',
    '#660066'
]

export function getRandomColor() {
    return colors[Math.floor(Math.random() * (colors.length -1))]
}

export function getBrigthenColor(hex) {
    return chroma(hex).brighten(2).hex()
}

export function getTextColor(hex) {
    console.log('luminance = ', chroma(hex).luminance())
    return chroma(hex).luminance() > 0.25 ? '#000000': '#FFFFFF'
}