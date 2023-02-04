<script>
  import { createEventDispatcher } from 'svelte/internal';
  import svelteLogo from './assets/svelte.svg'
  import Board from './lib/Board.svelte';
  import Control from './lib/Control/Control.svelte';
  import Counter from './lib/Counter.svelte'
  import Size from './lib/Size.svelte';
  import { currentRowSize, currentColSize } from './stores/BoardSize'
  import { isRunning } from './stores/state';

  const dispatch = createEventDispatcher()

  let rowSize;
  let colSize;
  let rows = []
  let currentCellNumber = 1

  currentRowSize.subscribe(r => { rowSize = r })
  currentColSize.subscribe(c => { colSize = c })

  $: {
    rows = []
    currentCellNumber = 1
    for (let i = 1; i <= rowSize; i++) {
        let cells = []

        for (let j = 1; j <= colSize; j++) {
            cells.push({
                cell_id: currentCellNumber,
                crossed: false,
                to_be_crossed: false,
                active: false
            })

            currentCellNumber++
        }

        rows.push({
            row_id: i,
            cells
        })
    }
  }

  function handleAlgorithmEnded() {
    isRunning.set(false)
  }
  
</script>

<main> 
  <div>
    <h1>Sieve of Eratosthenes</h1>
      <p>
        Sift the Two's and Sift the Three's:
        The Sieve of Eratosthenes.
        When the multiples sublime,
        The numbers that remain are Prime.
      </p>
  </div>

  <div class="card">
    <Counter />
  </div>

  <div class="card">
    <Size />
  </div>

  <Board 
    rows={rows} 
    row={rowSize}
    col={colSize} 
    on:algorithmEnded={handleAlgorithmEnded}
  />

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>
