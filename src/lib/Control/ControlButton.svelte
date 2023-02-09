<script>
    export let name
    export let disabled = false
    export let type = ''
</script>

<button 
    on:click
    on:focus
    on:mouseover
    on:mouseenter
    on:mouseleave
    class="btn {type}"
    {disabled}>
        <slot name="icon"></slot>
        <span>{name}</span>
</button>