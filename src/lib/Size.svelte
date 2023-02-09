<script>
    import { currentRowSize, currentColSize, currentSelectedSize } from '../stores/BoardSize'
    import { CheckCircleFill } from 'svelte-bootstrap-icons'
    import { createEventDispatcher } from 'svelte'
    import { isRunning } from '../stores/state'
    import { sizes } from '../helpers/sizes'

    const dispatch = createEventDispatcher();

    let selectedSize = 1
    let algorithmIsRunning

    isRunning.subscribe((state) => algorithmIsRunning = state)
    currentSelectedSize.subscribe((id) => selectedSize = id)

    function handleSizeChange() {
        let newSize = sizes.find(size => size.id == selectedSize)
        
        currentRowSize.set(newSize.row)
        currentColSize.set(newSize.col)
        currentSelectedSize.set(newSize.id)
    }
</script>

<div class="sizes" class:disabled="{algorithmIsRunning}">
    {#each sizes as size}
        <div class="sizes__size" class:active={selectedSize == size.id}>
            <label class="btn btn-radio">
                <input type="radio" name="size" value="{size.id}" bind:group={selectedSize} on:change={handleSizeChange} />
                <span class="size__text">{size.row} x {size.col}</span>
                
                {#if selectedSize == size.id }
                    <span class="size__svg">
                        <CheckCircleFill height={20} width={20} color={"#0d6efd"} />
                    </span>
                {/if}
            </label>
        </div>
    {/each}
</div>


<style>
    .sizes {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 10px 0 30px;
    }

    .sizes.disabled, .sizes.disabled * {
        cursor: not-allowed;
        pointer-events:none;
    }

    .sizes .sizes__size label {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sizes .sizes__size input {
        position: absolute;
        clip: rect(0,0,0,0);
        pointer-events: none;
    }

    .sizes__size .size__text {
        margin-right: 5px;
    }

    .sizes__size .size__svg {
        display: inherit;
        animation-duration: 0.1s;
        animation-name: animate-slide-left;
        animation-timing-function: cubic-bezier(.26, .53, .74, 1.48);
        transition: width 2s, height 4s;
    }

    @keyframes animate-slide-left {
        0% {
            opacity: 0;
            transform: translate(3px, 0);
        }
        100% {
            opacity: 1;
            transform: translate(0, 0);
        }
    }
</style>

