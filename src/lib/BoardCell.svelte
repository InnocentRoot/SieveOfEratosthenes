<script>
    import { slide } from 'svelte/transition';
    export let cellId
    export let active = false
    export let crossed = false
    export let toBeCrossed = false
</script>

<div 
    class="board__cell"
    class:active={active}
    class:crossed={crossed}
    class:toBeCrossed={toBeCrossed}
    data-cell-id="{cellId}"
>
    {cellId}
</div>


<style>
    .board__cell {
        display: table-cell;
        text-align: center;
        cursor: pointer;
        user-select: none;
        animation-duration: 0.5s;
        animation-name: animate-slide;
        animation-timing-function: cubic-bezier(.26, .53, .74, 1.48);
        margin: 1px;
        border-radius: 3px;
    }

    .board__cell.active {
        background: #0000ff;
        color: #FFF;
    }

    .board__cell.crossed {
        color: #d3cccc;
        text-decoration: line-through;
    }

    .board__cell.crossed:hover {
        color: #918e8e;
        transition: color 0.3s cubic-bezier(1,-0.49,0,.63);
    }

    .board__cell.active {
        background: #0000ff;
        border-radius: 5px;
        color: #FFF;
    }

    .board__cell.toBeCrossed {
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