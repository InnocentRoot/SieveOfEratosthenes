<script>
  import {
    currentOperation,
    currentOperationDescription,
  } from "./stores/algorithm";
  import { currentRowSize, currentColSize } from "./stores/BoardSize";
  import { createEventDispatcher } from "svelte/internal";
  import { isRunning } from "./stores/state";
  import { XCircleFill } from "svelte-bootstrap-icons";
  import Board from "./lib/Board.svelte";
  import Size from "./lib/Size.svelte";

  const dispatch = createEventDispatcher();

  let rowSize;
  let colSize;
  let rows = [];
  let currentCellNumber = 1;
  let algorithmIsRunning = false;
  let currentOp = "";
  let currentOpDescription = "";

  isRunning.subscribe((state) => (algorithmIsRunning = state));
  currentOperation.subscribe((state) => (currentOp = state));
  currentOperationDescription.subscribe(
    (state) => (currentOpDescription = state)
  );

  currentRowSize.subscribe((r) => {
    rowSize = r;
  });
  currentColSize.subscribe((c) => {
    colSize = c;
  });

  $: {
    rows = [];
    currentCellNumber = 1;
    for (let i = 1; i <= rowSize; i++) {
      let cells = [];

      for (let j = 1; j <= colSize; j++) {
        cells.push({
          cell_id: currentCellNumber,
          crossed: false,
          to_be_crossed: false,
          active: false,
          color: "",
        });

        currentCellNumber++;
      }

      rows.push({
        row_id: i,
        cells,
      });
    }
  }

  function handleAlgorithmEnded() {
    isRunning.set(false);
  }
</script>

<div class="page-wrapper">
  <header class="header text-center">
    <h1>Sieve of Eratosthenes</h1>
    <p>
      Sift the Two's and Sift the Three's: The Sieve of Eratosthenes. When the
      multiples sublime, The numbers that remain are Prime.
    </p>
  </header>
</div>

<main>
  <div class="card">
    <h2 class="text-center">Taille du tableau</h2>
    <Size />
  </div>

  <Board
    {rows}
    row={rowSize}
    col={colSize}
    on:algorithmEnded={handleAlgorithmEnded}
  />
</main>

{#if algorithmIsRunning}
  <div class="currentOperation">
    <div class="currentOperation__label">
      <XCircleFill color={"#dc3545"} />
      <div class="text">
        {currentOp}
      </div>
    </div>
    <div class="currentOperation__description">{currentOpDescription}</div>
  </div>
{/if}

<div class="github">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    ><path
      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.466 19.59c-.405.078-.534-.171-.534-.384v-2.195c0-.747-.262-1.233-.55-1.481 1.782-.198 3.654-.875 3.654-3.947 0-.874-.312-1.588-.823-2.147.082-.202.356-1.016-.079-2.117 0 0-.671-.215-2.198.82-.64-.18-1.324-.267-2.004-.271-.68.003-1.364.091-2.003.269-1.528-1.035-2.2-.82-2.2-.82-.434 1.102-.16 1.915-.077 2.118-.512.56-.824 1.273-.824 2.147 0 3.064 1.867 3.751 3.645 3.954-.229.2-.436.552-.508 1.07-.457.204-1.614.557-2.328-.666 0 0-.423-.768-1.227-.825 0 0-.78-.01-.055.487 0 0 .525.246.889 1.17 0 0 .463 1.428 2.688.944v1.489c0 .211-.129.459-.528.385-3.18-1.057-5.472-4.056-5.472-7.59 0-4.419 3.582-8 8-8s8 3.581 8 8c0 3.533-2.289 6.531-5.466 7.59z"
    /></svg
  >
  <a
    href="https://github.com/InnocentRoot"
    target="_blank"
    rel="noreferrer"
    class="github-link"
  >
    github.com/InnocentRoot/
  </a>
</div>

<style>
  .header {
    margin-top: 30px;
    padding: 10px;
    border-radius: 16px;
    background: #ffffff;
  }

  .header p {
    font-size: 18px;
    background-image: linear-gradient(
      to left,
      #0d1cb5,
      #bd0092,
      #fd0061,
      #ff7535,
      #ffc228
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: rgba(0, 0, 0, 0.2);
  }

  .github {
    position: fixed;
    background: var(--white);
    width: 50px;
    bottom: 10px;
    left: 10px;
    padding: 5px;
    box-shadow: var(--box-shadow);
    border-radius: 10px;
    cursor: pointer;
    transition: width 0.5s;
  }

  .github svg {
    vertical-align: middle;
  }

  .github .github-link {
    color: var(--color);
    opacity: 0;
    position: absolute;
    transform: translate(-10px, 50%);
    transition: all 0.3s;
    user-select: none;
    -webkit-user-select: none;
  }

  .github:hover {
    width: 250px;
    transition: width 0.3s;
    box-shadow: 10px 5px 11px 5px rgba(28, 27, 27, 0.1);
  }

  .github:hover svg {
    left: 0;
  }

  .github:hover .github-link {
    opacity: 1;
    transform: translate(2px, 50%);
    transition: transform 0.5s, opacity 0.5s;
  }

  .github .github-link:hover {
    color: var(--blue);
  }

  .currentOperation {
    position: fixed;
    top: 30px;
    right: 20px;
    padding: 10px;
    background: #fff;
    box-shadow: var(--box-shadow);
    border-radius: 10px;
    user-select: none;
    animation-duration: 0.8s;
    animation-name: animate-slide-left;
    animation-timing-function: cubic-bezier(0.26, 0.53, 0.74, 1.48);
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
