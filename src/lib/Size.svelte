<script>
    import { createEventDispatcher } from 'svelte';
    import { sizes } from '../helpers/sizes'
    import { currentRowSize, currentColSize } from '../stores/BoardSize'

    const dispatch = createEventDispatcher();

    let selectedSize

    function handleSizeChange() {
        let newSize = sizes.find(size => size.id == selectedSize)

        currentRowSize.set(newSize.row)
        currentColSize.set(newSize.col)
    }
</script>

<div class="sizes">
    {#each sizes as size}
        <div class="sizes__size">
            <label class="btn btn-radio">
                <input type="radio" name="size" value="{size.id}" bind:group={selectedSize} on:change={handleSizeChange} />
                {size.row} x {size.col}
                
                {#if selectedSize == size.id }
                    <svg height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-3.2 -3.2 38.40 38.40" xml:space="preserve" fill="#000000" transform="rotate(0)">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.064"/>
                        <g id="SVGRepo_iconCarrier"> <g> <g id="check_x5F_alt"> <path style="fill:#1a5fb4;" d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M13.52,23.383 L6.158,16.02l2.828-2.828l4.533,4.535l9.617-9.617l2.828,2.828L13.52,23.383z"/> </g> </g> </g>
                    </svg>
                {/if}
            </label>
        </div>
    {/each}
</div>


<style>
    .sizes {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
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
</style>

