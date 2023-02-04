<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { currentRowSize, currentColSize } from '../stores/BoardSize'
    import Control from './Control/Control.svelte';
    import { formatTime } from '../helpers/utils';
    import { isRunning } from '../stores/state';
    import { speed } from '../stores/algorithm';
    import { time } from '../stores/timer';
    import SpeedSlider from './Control/SpeedSlider.svelte';

    export let row;
    export let col;
    export let rows = [];
    export let elapsed = 0
    export let alogSpeed = 0
    export let isAlgorithmRunning

    let timeOuts = []

    const dispatch = createEventDispatcher()


    speed.subscribe(value => {
        alogSpeed = value
        console.log('Board: algo speed set to', value)
    })

    $: limit = row * col
    $: boardArray = Array.from({length: (limit) + 1 }, () => true)

    function crossOutCell(i, j) {
       rows[i].cells[j].crossed = true 
    }


    function clearBoard() {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].cells.length; j++) {
                if (rows[i].cells[j].crossed) {
                    rows[i].cells[j].crossed = false
                }
            }
        }
    }
    

    function markAsActiveCell(cellId) {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].cells.length; j++) {
                if (rows[i].cells[j].cell_id === cellId) {
                    console.log('cell:', rows[i].cells[j].cell_id, ' marked as active cell')
                    rows[i].cells[j].active = true
                }
            }
        }
    }

    function removeActiveCell() {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].cells.length; j++) {
                if (rows[i].cells[j].active) {
                    console.log('cell:', rows[i].cells[j].cell_id, ' removed as active cell')
                    rows[i].cells[j].active = false
                }
            }
        }
    }

    function markCellAsToBeCrossed(cellId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                for (let i = 0; i < rows.length; i++) {
                    for (let j = 0; j < rows[i].cells.length; j++) {
                        if (rows[i].cells[j].cell_id === cellId && !rows[i].cells[j].crossed) {
                            console.log('marking cell:', rows[i].cells[j].cell_id, ' as to be crossed')
                            rows[i].cells[j].to_be_crossed = true
                        }
                    }
                }
                resolve()
            }, alogSpeed)
        })
    }

    async function crossOutMultiple(i) {
        return new Promise((resolve) => {
            let timeOut = setTimeout(async () => {
                for (let j = i + i; j <= limit; j+=i) {
                    console.log('crossing out ' + j)
                    boardArray[j] = false

                    await markCellAsToBeCrossed(j)
                }

                // cross all marked as to be crossed
                for (let i = 0; i < rows.length; i++) {
                        for (let j = 0; j < rows[i].cells.length; j++) {
                            if (rows[i].cells[j].to_be_crossed) {
                                rows[i].cells[j].to_be_crossed = false
                                rows[i].cells[j].crossed = true
                            }
                        }
                }

                resolve()
            }, alogSpeed)

            timeOuts.push(timeOuts)
        })
    }

    async function handleEratosthenesStart() {
        console.log(boardArray)
        console.log(rows)

        isRunning.set(true)
        
        for (let i = 2; i <= Math.sqrt(row*col); i++) {
            if(!boardArray[i]) {
                continue
            }

            removeActiveCell()
            markAsActiveCell(i)

            await crossOutMultiple(i)
        }

        removeActiveCell()
        isRunning.set(false)
    }

    function handleEratosthenesReplay() {
        clearBoard()
        handleEratosthenesStart()
    }

    function handleEratosthenesStop() {
        clearBoard()
        isRunning.set(false)
    }
</script>


<div class="control">
    <div class="control__btns flex">
        <Control 
            on:eratosthenesStart={handleEratosthenesStart}
            on:eratosthenesReplay={handleEratosthenesReplay} 
            bind:elapsed={elapsed}
        />
        <SpeedSlider />
    </div>
    <div class="control__timer">
        Temps écoulé: <span style="padding-left: 5px;">{formatTime(elapsed)}</span>
    </div>
</div>


<div class="board__container">
    {#each rows as row, i (row)}
        <div class="board__row" data-row-id="{row.row_id}">
            {#each row.cells as cell, j}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                 <div 
                    class="board__cell"
                    class:active={cell.active}
                    class:crossed={cell.crossed}
                    class:toBeCrossed={cell.to_be_crossed}
                    data-cell-id="{cell.cell_id}"
                >
                    {cell.cell_id}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .control {
        width: 1100px;
        display: flex;
        justify-content: center;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .control .control__timer {
        font-size: 1rem;
    }

    .board__container {
        display: table;
        padding: 6px;
        border-radius: 10px;
        box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.1);
        border-spacing: 8px;
    }

    .board__container .board__row {
        display: table-row;
    }

    .board__container .board__row .board__cell {
        display: table-cell;
        text-align: center;
        cursor: pointer;
        user-select: none;
        width: 30px;
        animation-duration: 0.5s;
        animation-name: animate-slide;
        animation-timing-function: cubic-bezier(.26, .53, .74, 1.48);
        margin: 1px;
        border-radius: 3px;
    }

    .board__row .board__cell.active {
        background: #0000ff;
        color: #FFF;
    }

    .board__container .board__row .board__cell.crossed {
        color: #d3cccc;
        text-decoration: line-through;
    }

    .board__row .board__cell.crossed:hover {
        color: #918e8e;
        transition: color 0.3s cubic-bezier(1,-0.49,0,.63);
    }

    .board__container .board__row .board__cell.active {
        background: #0000ff;
        border-radius: 5px;
        color: #FFF;
    }

    .board__row .board__cell.toBeCrossed {
        background: #bec2ff;
    }


    @keyframes animate-slide {
        0% {
            opacity: 0;
            transform: translate(0, 20px);
        }
        100% {
            opacity: 1;
            transform: translate(0, 0);
        }
    }
</style>