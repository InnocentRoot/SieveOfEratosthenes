<script>
    import ControlButton from "./ControlButton.svelte";
    import { createEventDispatcher } from "svelte";
    import { isRunning } from "../../stores/state";
    import { Play, ArrowClockwise } from "svelte-bootstrap-icons";

    const dispatch = createEventDispatcher();

    function handleStart() {
        dispatch("eratosthenesStart");
    }

    function handleReset() {
        dispatch("eratosthenesReset");
    }
</script>

<div class="controls flex">
    <ControlButton name="Run" on:click={handleStart} disabled={$isRunning}>
        <Play slot="icon" height="20" width="20" />
    </ControlButton>

    <ControlButton name="Reset" disabled={$isRunning} on:click={handleReset}>
        <ArrowClockwise slot="icon" height="20" width="20" />
    </ControlButton>
</div>
