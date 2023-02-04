<script>
    import { speed } from "../../stores/algorithm"

    let currentRangeValue = 2000
    speed.set(2005-2000)

    function speedChange(event) {
        let newSpeed = 2005 - event.target.value
        
        speed.set(newSpeed)
        console.log('Slider: speed changed to', newSpeed)
    }

</script>

<div class="slider flex flex-center">
    <label for="speedSlider">Vitesse</label>
    <input 
        type="range"
        min="1000"
        step="10"
        max="2000"
        class="slider-input" 
        id="speedSlider"
        on:change={(e) => speedChange(e)}
        bind:value={currentRangeValue}
    />
        {currentRangeValue}({$speed/1000} seconds)
</div>