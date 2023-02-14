<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import SpeedSlider from "./Control/SpeedSlider.svelte";
    import Control from "./Control/Control.svelte";
    import BoardCell from "./BoardCell.svelte";
    import { formatTime } from "../helpers/utils";
    import { isRunning } from "../stores/state";
    import { speed } from "../stores/algorithm";
    import { time } from "../stores/timer";
    import {
        currentOperation,
        currentOperationDescription,
    } from "../stores/algorithm";

    import {
        getRandomColor,
        getBrigthenColor,
        getTextColor,
    } from "../helpers/colors";

    export let row;
    export let col;
    export let rows = [];
    export let elapsed = 0;
    export let alogSpeed = 0;
    let activeCellColor;
    let markedCellColor;
    let algorithmIsRunning;
    let timerSubscriber;
    let timeOuts = [];
    let boardContainerWidth;
    let boardWidth;
    let fontSizeSliderValue = 18;

    const dispatch = createEventDispatcher();

    isRunning.subscribe((state) => (algorithmIsRunning = state));
    speed.subscribe((value) => {
        alogSpeed = value;
        console.log("Board: algo speed set to", value);
    });

    $: limit = row * col;
    $: boardArray = Array.from({ length: limit + 1 }, () => true);
    $: overflowed = boardWidth >= boardContainerWidth;

    onDestroy(() => {
        console.log("destroying the board");
        timeOuts.forEach((t) => {
            console.log("clearing timeout ", t);
            clearInterval(t);
        });
    });

    function crossOutCell(i, j) {
        rows[i].cells[j].crossed = true;
    }

    function clearBoard() {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].cells.length; j++) {
                if (rows[i].cells[j].crossed) {
                    rows[i].cells[j].crossed = false;
                }
            }
        }
    }

    function markAsActiveCell(cellId) {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].cells.length; j++) {
                if (rows[i].cells[j].cell_id === cellId) {
                    console.log(
                        "cell:",
                        rows[i].cells[j].cell_id,
                        " marked as active cell"
                    );
                    rows[i].cells[j].active = true;
                }
            }
        }
    }

    function removeActiveCell() {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].cells.length; j++) {
                if (rows[i].cells[j].active) {
                    console.log(
                        "cell:",
                        rows[i].cells[j].cell_id,
                        " removed as active cell"
                    );
                    rows[i].cells[j].active = false;
                }
            }
        }
    }

    function markCellAsToBeCrossed(cellId) {
        return new Promise((resolve) => {
            let t = setTimeout(() => {
                for (let i = 0; i < rows.length; i++) {
                    for (let j = 0; j < rows[i].cells.length; j++) {
                        if (
                            rows[i].cells[j].cell_id === cellId &&
                            !rows[i].cells[j].crossed
                        ) {
                            console.log(
                                "marking cell:",
                                rows[i].cells[j].cell_id,
                                " as to be crossed"
                            );
                            currentOperationDescription.set(
                                `En train de marquer le chiffre ${rows[i].cells[j].cell_id}`
                            );
                            rows[i].cells[j].to_be_crossed = true;
                        }
                    }
                }
                resolve();
            }, alogSpeed);

            timeOuts.push(t);
        });
    }

    async function crossOutMultiple(i) {
        return new Promise((resolve) => {
            let t = setTimeout(async () => {
                for (let j = i + i; j <= limit; j += i) {
                    console.log("crossing out " + j);
                    boardArray[j] = false;

                    await markCellAsToBeCrossed(j);
                }

                // cross all marked as to be crossed
                for (let i = 0; i < rows.length; i++) {
                    for (let j = 0; j < rows[i].cells.length; j++) {
                        if (rows[i].cells[j].to_be_crossed) {
                            rows[i].cells[j].to_be_crossed = false;
                            rows[i].cells[j].crossed = true;
                            rows[i].cells[j].color = activeCellColor;
                        }
                    }
                }

                resolve();
            }, alogSpeed);

            timeOuts.push(t);
        });
    }

    async function handleEratosthenesStart() {
        isRunning.set(true);
        startTimer();

        console.log(rows);

        // cross out 1 as it is not prime
        rows[0].cells[0].crossed = true;
        rows[0].cells[0].color = activeCellColor;

        for (let i = 2; i <= Math.sqrt(row * col); i++) {
            if (!algorithmIsRunning) {
                break;
            }
            currentOperation.set(`En train de tamiser les multiples de ${i}`);

            activeCellColor = getRandomColor();
            markedCellColor = getBrigthenColor(activeCellColor);

            console.log(
                `%c accent color set to ${activeCellColor}`,
                `background: ${activeCellColor}; color: ${getTextColor(
                    activeCellColor
                )}`
            );
            console.log(
                `%c secondary color set to ${markedCellColor}`,
                `background: ${markedCellColor}; color: ${getTextColor(
                    markedCellColor
                )}`
            );

            if (!boardArray[i]) {
                continue;
            }

            removeActiveCell();
            markAsActiveCell(i);

            await crossOutMultiple(i);
        }

        removeActiveCell();
        isRunning.set(false);
        stopTimer();
        currentOperationDescription.set("");
    }

    function handleEratosthenesReset() {
        clearBoard();
        isRunning.set(false);
        stopTimer();
    }

    function startTimer() {
        // start the timer
        timerSubscriber = time.subscribe((value) => {
            elapsed = value;
        });
    }

    function stopTimer() {
        // stop the timer
        if (timerSubscriber) {
            timerSubscriber();
            timerSubscriber = null;
        }
    }
</script>

<div class="flex flex-center">
    <div class="control flex">
        <div class="control__btns flex">
            <Control
                on:eratosthenesStart={handleEratosthenesStart}
                on:eratosthenesReset={handleEratosthenesReset}
            />
        </div>
        <div class="sliders flex">
            <SpeedSlider />
            <div class="fontSizeSlider flex flex-center">
                <label for="speedSlider">Font size</label>
                <input
                    type="range"
                    min="1"
                    step="1"
                    max="18"
                    class="slider-input"
                    bind:value={fontSizeSliderValue}
                />
                <span>{fontSizeSliderValue}px</span>
            </div>
        </div>
        <div class="control__timer">
            Temps écoulé: <span style="padding-left: 5px;"
                >{formatTime(elapsed)}</span
            >
        </div>
    </div>
</div>

<div
    class="board-container flex flex-center"
    bind:clientWidth={boardContainerWidth}
    class:overflowed={boardWidth > boardContainerWidth}
>
    <div
        class="board__rows"
        bind:clientWidth={boardWidth}
        style="font-size: {fontSizeSliderValue}px"
    >
        {#each rows as row, i (row)}
            <div class="board__row" data-row-id={row.row_id}>
                {#each row.cells as cell, j}
                    <BoardCell
                        cellId={cell.cell_id}
                        active={cell.active}
                        crossed={cell.crossed}
                        toBeCrossed={cell.to_be_crossed}
                        {activeCellColor}
                        {markedCellColor}
                        textColor={cell.color}
                    />
                {/each}
            </div>
        {/each}
    </div>

    {#if overflowed}
        <div class="overflow__container">
            <p class="overflow__container-indication">
                The board width overlflow it's container. You will need to
                adjust the board text size so you can viewed all numbers.
            </p>
        </div>
    {/if}
</div>

<style>
    .control {
        justify-content: center;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .sliders {
        margin-left: 100px;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
    }

    .fontSizeSlider {
        margin-top: 18px;
    }

    .fontSizeSlider span {
        margin-left: 12px;
    }

    .control .control__timer {
        font-size: 1rem;
        margin-left: 200px;
        min-width: 200px;
    }

    .board-container {
        margin-top: 10px;
    }

    .board-container.overflowed {
        overflow: hidden;
    }

    .board-container.overflowed .overflow__container {
        position: absolute;
        background: rgba(255, 255, 255, 0.92);
        justify-content: center;
        inset: 0;
        text-align: center;
        transition: all 0.2s;
    }

    .overflow__container .overflow__container-indication {
        position: relative;
        top: 10%;
        font-size: 20px;
    }

    .board__rows {
        background: #ffffff;
        display: table;
        padding: 2px;
        border-radius: 10px;
        box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.1);
        border-spacing: 8px;
    }

    .board__rows .board__row {
        display: table-row;
    }
</style>
