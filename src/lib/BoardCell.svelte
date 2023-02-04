<script>
    export let cellId
    export let crossed = false
    export let toBeCrossed = false
</script>


<div class="board__cell" data-cell-id="{cellId}" bind:this={clls[cell.cellid]}>
    {cell.cellid}
</div>