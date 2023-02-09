<script>
  import { currentOperation, currentOperationDescription } from './stores/algorithm'
  import { currentRowSize, currentColSize } from './stores/BoardSize'
  import { createEventDispatcher } from 'svelte/internal'
  import { isRunning } from './stores/state'
  import { XCircleFill } from 'svelte-bootstrap-icons'
  import Board from './lib/Board.svelte'
  import Size from './lib/Size.svelte'


  const dispatch = createEventDispatcher()

  let rowSize;
  let colSize;
  let rows = []
  let currentCellNumber = 1
  let algorithmIsRunning = false
  let currentOp = ''
  let currentOpDescription = ''


  isRunning.subscribe((state) => algorithmIsRunning = state)
  currentOperation.subscribe((state) => currentOp = state )
  currentOperationDescription.subscribe((state) => currentOpDescription = state )

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


<div class="page-wrapper">
  <header class="header text-center">
    <h1>Sieve of Eratosthenes</h1>
    <p>
      Sift the Two's and Sift the Three's:
      The Sieve of Eratosthenes.
      When the multiples sublime,
      The numbers that remain are Prime.
    </p>
  </header>
</div>

<main> 
  <div class="card">
    <h2 class="text-center">Taille du tableau</h2>
    <Size />
  </div>

  <Board 
    rows={rows} 
    row={rowSize}
    col={colSize} 
    on:algorithmEnded={handleAlgorithmEnded}
  />
</main>

{#if algorithmIsRunning }
  <div class="currentOperation">
    <div class="currentOperation__label">
      <XCircleFill color={'#dc3545'}/>
      <div class="text">
        {currentOp}
      </div>
    </div>
    <div class="currentOperation__description">{currentOpDescription}</div>
  </div>
{/if}

<style>
  .header {
    margin-top: 30px;
    padding: 10px;
    border-radius: 16px;
    background: #FFFFFF;
  }

  .header p {
    font-size: 18px;
    background-image: linear-gradient(to left, #0d1cb5, #bd0092, #fd0061, #ff7535, #ffc228);
    background-clip: text;
    -webkit-background-clip: text;
    color: rgba(0, 0, 0, 0.2);
  }

  .currentOperation {
    position: fixed;
    bottom: 30px;
    right: 20px;
    padding: 10px;
    background: #fff;
    box-shadow: var(--box-shadow);
    border-radius: 10px;
    user-select: none;
    animation-duration: 0.8s;
    animation-name: animate-slide-left;
    animation-timing-function: cubic-bezier(.26, .53, .74, 1.48);
  }

  .currentOperation .currentOperation__label {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .currentOperation .currentOperation__label .text {
    margin-left: 5px;
  }

  .currentOperation .currentOperation__description {
    font-size: 14px;
    margin-left: 30px;
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
