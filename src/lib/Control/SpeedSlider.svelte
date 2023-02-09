<script>
    import { speed } from "../../stores/algorithm"

    let currentRangeValue = 1500
    let speedPercent = 

    speed.set(2005-1500)

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
        min="1"
        step="10"
        max="2000"
        class="slider-input" 
        id="speedSlider"
        on:change={(e) => speedChange(e)}
        bind:value={currentRangeValue}
    />
        {currentRangeValue}({$speed/1000} seconds) ({Math.ceil(currentRangeValue/2005 * 100)}%)
</div>