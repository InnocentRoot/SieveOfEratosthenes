<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import SpeedSlider from './Control/SpeedSlider.svelte';
    import { currentRowSize, currentColSize } from '../stores/BoardSize'
    import Control from './Control/Control.svelte';
    import { formatTime } from '../helpers/utils';
    import { isRunning } from '../stores/state';
    import { currentOperation, currentOperationDescription } from '../stores/algorithm';
    import { speed } from '../stores/algorithm';
    import { time } from '../stores/timer';
    import BoardCell from './BoardCell.svelte';


    export let row;
    export let col;
    export let rows = [];
    export let elapsed = 0
    export let alogSpeed = 0

    let algorithmIsRunning
    let timerSubscriber
    let timeOuts = []

    const dispatch = createEventDispatcher()

    isRunning.subscribe((state) => algorithmIsRunning = state)
    speed.subscribe(value => {
        alogSpeed = value
        console.log('Board: algo speed set to', value)
    })

    $: limit = row * col
    $: boardArray = Array.from({length: (limit) + 1 }, () => true)

    onDestroy(() => {
        timeOuts.forEach(t => {
            console.log('clearing timeout ', t)
            clearInterval(t)
        });
    })
 
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
            let t = setTimeout(() => {
                for (let i = 0; i < rows.length; i++) {
                    for (let j = 0; j < rows[i].cells.length; j++) {
                        if (rows[i].cells[j].cell_id === cellId && !rows[i].cells[j].crossed) {
                            console.log('marking cell:', rows[i].cells[j].cell_id, ' as to be crossed')
                            currentOperationDescription.set(`En train de marquer le chiffre ${rows[i].cells[j].cell_id}`)
                            rows[i].cells[j].to_be_crossed = true
                        }
                    }
                }
                resolve()
            }, alogSpeed)

            timeOuts.push(t)
        })
    }

    async function crossOutMultiple(i) {
        return new Promise((resolve) => {
            let t = setTimeout(async () => {
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

            timeOuts.push(t)
        })
    }

    async function handleEratosthenesStart() {
        isRunning.set(true)
        startTimer()
        
        for (let i = 2; i <= Math.sqrt(row*col); i++) {
            if(!algorithmIsRunning) {
                break
            }
            currentOperation.set(`En train de tamiser les multiples de ${i}`)
            
            if(!boardArray[i]) {
                continue
            }

            removeActiveCell()
            markAsActiveCell(i)

            await crossOutMultiple(i)
        }

        removeActiveCell()
        isRunning.set(false)
        stopTimer()
    }

    function handleEratosthenesReplay() {
        clearBoard()
        handleEratosthenesStart()
    }

    function handleEratosthenesStop() {
        clearBoard()
        isRunning.set(false)

        stopTimer()
    }

    function startTimer() {
        // start the timer
        timerSubscriber = time.subscribe(value => {
            elapsed = value
        })
    }

    function stopTimer() {
        // stop the timer
        if (timerSubscriber) {
            timerSubscriber()
            timerSubscriber = null
        }
    }

</script>

<div class="flex flex-center">
    <div class="control flex">
        <div class="control__btns flex">
            <Control 
                on:eratosthenesStart={handleEratosthenesStart}
                on:eratosthenesStop={handleEratosthenesStop}
            />
            <SpeedSlider />
        </div>
        <div class="control__timer">
            Temps écoulé: <span style="padding-left: 5px;">{formatTime(elapsed)}</span>
        </div>
    </div>
</div>

<div class="board-container flex flex-center">
    <div class="board__rows">
        {#each rows as row, i (row)}
            <div class="board__row" data-row-id="{row.row_id}">
                {#each row.cells as cell, j}
                    <BoardCell 
                        cellId={cell.cell_id} 
                        active={cell.active} 
                        crossed={cell.crossed} 
                        toBeCrossed= {cell.to_be_crossed}/>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .control {
        justify-content: center;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .control .control__timer {
        font-size: 1rem;
        margin-left: 200px;
    }

    .board__rows {
        background: #FFFFFF;
        display: table;
        padding: 2px;
        border-radius: 10px;
        box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.1);
        border-spacing: 8px;
    }

    .board__rows .board__row {
        display: table-row;
    }
</style>