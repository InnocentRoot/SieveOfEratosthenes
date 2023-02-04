<script>
    import ControlButton from "./ControlButton.svelte"
    import { PlayFill, ArrowClockwise, StopFill } from "svelte-bootstrap-icons"
    import { createEventDispatcher } from 'svelte'
    import { isRunning } from "../../stores/state"
    import { time } from "../../stores/timer";

    const dispatch = createEventDispatcher()

    export let elapsed
    let timerSubscriber
    
    function handleStart() {
        isRunning.set(true)
        dispatch('eratosthenesStart')

        timerSubscriber = time.subscribe(value => {
            elapsed = value
        })
    }

    function handleStop() {
        // destroy the subscriber to stop the timer
        dispatch('eratosthenesStart')

        if (timerSubscriber) {
            timerSubscriber()
            timerSubscriber = null
        }

        isRunning.set(false)
    }

    function handleReplay() {
        dispatch('eratosthenesReplay')
    }
</script>


<div class="controls flex">
    <ControlButton name="Lancer" on:click={handleStart} disabled={$isRunning}>
        <PlayFill slot="icon"/>
    </ControlButton>

    <ControlButton name="Rejouer" disabled={$isRunning} on:click={handleReplay}>
        <ArrowClockwise slot="icon"/>
    </ControlButton>

    <ControlButton
        name="Stopper"
        disabled={!$isRunning}
        type={$isRunning ? 'btn-red' : ''}
        on:click={handleStop}>
        <StopFill slot="icon"/>
    </ControlButton>
</div>