var tetris = document.querySelector('#tetris'); // 테트리스 나오는 화면
var tetrisData = []; // 테트리스 데이터
var currentBlock;
var nextBlock;
var currentTopLeft = [0, 3];
var blocks = [
  {
    name: 's', // 네모
    center: false,
    numCode: 1,
    color: 'red',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]
    ],
  },
  {
    name: 't', // T자
    center: true,
    numCode: 2,
    color: 'orange',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ]
  },
  {
    name: 'z', // 지그재그
    center: true,
    numCode: 3,
    color: 'yellow',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ]
  },
  {
    name: 'zr', // 반대 지그재그
    center: true,
    numCode: 4,
    color: 'green',
    startRow: 1,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
    ]
  },
  {
    name: 'l', // L자
    center: true,
    numCode: 5,
    color: 'blue',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
    ]
  },
  {
    name: 'lr', // 반대 L자
    center: true,
    numCode: 6,
    color: 'navy',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ]
  },
  {
    name: 'b', // 1자
    center: true,
    numCode: 7,
    color: 'violet',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
    ]
  },
];

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'navy', 'violet'];

const isActiveBlock = value => (value > 0 && value < 10);
const isInvalidBlock = value => (value === undefined || value >= 10); 
// 옆에 칸이 없거나 밑에서 10을 곱해준 거면(고정시킨 블럭) isInvalidBlock

/* 기본적으로 3x3 구역 검사 -> 한 칸 다음으로 갔을 때 isInvalidBlock이 있으면 변경 불가
   한 줄짜리 4개 블럭만 4x4 검사 */

function init() {
  const fragment = document.createDocumentFragment();
  [...Array(20).keys()].forEach((col, i) => {
    const tr = document.createElement('tr');
    fragment.appendChild(tr); // tr(가로줄 20층)
    [...Array(10).keys()].forEach((row, j) => {
      const td = document.createElement('td');
      tr.appendChild(td); // td(세로 10칸)
    });
    const column = Array(10).fill(0);
    tetrisData.push(column);
  });
  tetris.appendChild(fragment); // 빈 테이블(배열)에 테트리스 테이블 붙여넣기
}

function draw() { // 테트리스 데이터 기반으로 화면에 데이터 그려줌(표시해줌)
  console.log('drawed', JSON.parse(JSON.stringify(tetrisData)), JSON.parse(JSON.stringify(currentBlock)));
  tetrisData.forEach((col, i) => {
    col.forEach((row, j) => {
      if (row > 0) {
        tetris.children[i].children[j].className = tetrisData[i][j] >= 10 ? colors[tetrisData[i][j] / 10 - 1]: colors[tetrisData[i][j] - 1];
      } else {
        tetris.children[i].children[j].className = '';
      }
    });
  });
}


function drawNext() { // 다음에 나올 블록 그리는 함수
  const nextTable = document.getElementById('next-table');
  nextTable.querySelectorAll('tr').forEach((col, i) => {
    Array.from(col.children).forEach((row, j) => {
      if (nextBlock.shape[0][i] && nextBlock.shape[0][i][j] > 0) {
        nextTable.querySelectorAll('tr')[i].children[j].className = colors[nextBlock.numCode - 1];
      } else {
        nextTable.querySelectorAll('tr')[i].children[j].className = 'white';
      }
    });
  })
}

function generate() { // 테트리스 블록 생성
  if (!currentBlock) {
    currentBlock = blocks[Math.floor(Math.random() * blocks.length)]; // 랜덤하게 블록 뽑기
  } else {
    currentBlock = nextBlock; 
  }
  currentBlock.currentShapeIndex = 0;
  nextBlock = blocks[Math.floor(Math.random() * blocks.length)]; // 다음 블록 미리 생성
  console.log(currentBlock);
  drawNext();
  currentTopLeft = [-1, 3]; // 블록 나올 때 기준점 (맨 윗 줄 위에 가상의 칸 1개가 더 있다고 생각해서 (-1, 3))
  
  // 게임 오버 -> 새 블럭이 나와야 할 자리에 이미 다른 블럭이 있으면(겹치면) 게임 끝
  let isGameOver = false;
  currentBlock.shape[0].slice(1).forEach((col, i) => { // 게임 오버 판단
    col.forEach((row, j) => {
      if (row && tetrisData[i][j + 3]) {
        isGameOver = true;
      }
    });
  });
  currentBlock.shape[0].slice(1).forEach((col, i) => { // 블록 데이터 생성
    console.log(currentBlock.shape[0], currentBlock.shape[0].slice(1), col);
    col.forEach((row, j) => {
      if (row) {
        tetrisData[i][j + 3] = currentBlock.numCode;
      }
    });
  });
  console.log('generate', JSON.parse(JSON.stringify(currentBlock)));
  if (isGameOver) {
    clearInterval(int); // 게임 오버 시 2초마다 tick해주는 함수 clear
    draw();
    alert('game over');
  } else {
    draw();
  }
}

function checkRows() { // 한 줄 다 찼는지 검사
  const fullRows = []; 
  tetrisData.forEach((col, i) => { // 반복문 돌며 한 칸씩 count
    let count = 0;
    col.forEach((row, j) => {
      if (row > 0) {
        count++;
      }
    });
    if (count === 10) { // 한 줄(즉, 10칸)이 다 찼을 경우
      fullRows.push(i);
    }
  });
  const fullRowsCount = fullRows.length;
  tetrisData = tetrisData.filter((row, i) => !fullRows.includes(i)); // 채워진 줄을 filter로 지워버리고
  for (let i = 0; i < fullRowsCount; i++) { // 빈칸 줄을 맨 윗 줄에 추가
    tetrisData.unshift([0,0,0,0,0,0,0,0,0,0]);
  }
  console.log(fullRows, JSON.parse(JSON.stringify(tetrisData)));
  // 점수 계산
  let score = parseInt(document.getElementById('score').textContent, 10);
  score += fullRowsCount ** 2;
  document.getElementById('score').textContent = String(score);
}

function tick() { // 한 칸 아래로
  const nextTopLeft = [currentTopLeft[0] + 1, currentTopLeft[1]]; // currentTopLeft보다 한 칸 아래
  const activeBlocks = [];
  let canGoDown = true; // flag변수, (기본적으로는 true, 한 칸 내려갈 수 없으면 false로 바꿔줌)
  let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
  for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 아래 블럭이 있으면
    if (i < 0 || i >= 20) continue;
    for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
      console.log(i, j);
      if (isActiveBlock(tetrisData[i][j])) { // 현재 움직이는 블럭이면
        activeBlocks.push([i, j]);
        if (isInvalidBlock(tetrisData[i + 1] && tetrisData[i + 1][j])) { // 한 칸 내렸을 때 && isInvalidBlock과 겹치면
            // isInvalidBlock은 움직일 수 없는 칸(벽/바닥/고정된 블럭)
          console.log('아래 블럭이 있다!', i, j, tetrisData[i][j], tetrisData[i + 1] && tetrisData[i + 1][j], JSON.parse(JSON.stringify(tetrisData)));
          canGoDown = false;
        }
      }
    }
  }
  if (!canGoDown) { // canGoDown이 false일 때(즉, 내려가지 못할 때)
    activeBlocks.forEach((blocks) => {
      tetrisData[blocks[0]][blocks[1]] *= 10; // 블럭이 더 이상 내려가지 못할 때 10을 곱해줌 (ex. 7 -> 70)
    });
    checkRows(); // 지워질 줄 있나 확인
    generate(); // 새 블록 생성
    return false;
  } else if (canGoDown) {
    for (let i = tetrisData.length - 1; i >= 0; i--) {
      const col = tetrisData[i];
      col.forEach((row, j) => {
        if (row < 10 && tetrisData[i + 1] && tetrisData[i + 1][j] < 10) {
          tetrisData[i + 1][j] = row;
          tetrisData[i][j] = 0;
        }
      });
    }
    currentTopLeft = nextTopLeft;
    draw();
    return true;
  }
}

// 시작점
let int = setInterval(tick, 2000); // 2초마다 한 칸 아래로
init();
generate();

document.getElementById('stop').addEventListener('click', function() {
  clearInterval(int);
});
document.getElementById('start').addEventListener('click', function() {
  if (int) {
    clearInterval(int);
  }
  int = setInterval(tick, 2000);
});
document.getElementById('mute').addEventListener('click', function() {
  if (document.getElementById('bgm').paused) {
    document.getElementById('bgm').play();
  } else {
    document.getElementById('bgm').pause();
  }
});

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft': { // 키보드 왼쪽 클릭 = 좌측 한 칸 이동
      const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] - 1];
      let isMovable = true; // flag변수, (기본적으로 true, 이동할 수 없을 때 false처리)
      let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
      for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 왼쪽 공간 체크
        if (!isMovable) break;
        for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
          if (!tetrisData[i] || !tetrisData[i][j]) continue;
          if (isActiveBlock(tetrisData[i][j]) && isInvalidBlock(tetrisData[i] && tetrisData[i][j - 1])) {
            console.log(i, j, tetrisData[i][j], tetrisData[i][j-1]);
            isMovable = false;
          }
        }
      }
      console.log('left', 'isMovable', isMovable);
      if (isMovable) {
        currentTopLeft = nextTopLeft;
        tetrisData.forEach((col, i) => {
          for (var j = 0; j < col.length; j++) {
            const row = col[j];
            if (tetrisData[i][j - 1] === 0 && row < 10) {
              console.log(row, tetrisData[i][j - 1], i, j);
              tetrisData[i][j - 1] = row;
              tetrisData[i][j] = 0;
            }
          }
        });
        draw();
      }
      break;
    }
    case 'ArrowRight': { // 키보드 오른쪽 클릭 = 우측 한 칸 이동
      const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] + 1];
      let isMovable = true;
      let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
      for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 오른쪽 공간 체크
        if (!isMovable) break;
        for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
          if (!tetrisData[i] || !tetrisData[i][j]) continue;
          if (isActiveBlock(tetrisData[i][j]) && isInvalidBlock(tetrisData[i] && tetrisData[i][j + 1])) {
            console.log(i, j);
            isMovable = false;
          }
        }
      }
      console.log('right', 'isMovable', isMovable);
      if (isMovable) {
        currentTopLeft = nextTopLeft;
        tetrisData.forEach((col, i) => {
          for (var j = col.length - 1; j >= 0; j--) {
            const row = col[j];
            if (tetrisData[i][j + 1] === 0 && row < 10) {
              tetrisData[i][j + 1] = row;
              tetrisData[i][j] = 0;
            }
          }
        });
        draw();
      }
      break;
    }
    case 'ArrowDown': { // 키보드 아래쪽 클릭 = 하방측 한 칸 이동
      tick();
    }
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowUp': { // 방향 전환
      let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
      let isChangeable = true;
      const nextShapeIndex = currentBlock.currentShapeIndex + 1 === currentBlock.shape.length
        ? 0
        : currentBlock.currentShapeIndex + 1;
      const nextBlockShape = currentBlock.shape[nextShapeIndex];
      for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 돌린 이후 공간 체크
        if (!isChangeable) break;
        for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
          if (!tetrisData[i]) continue;
          if (nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]] > 0 && isInvalidBlock(tetrisData[i] && tetrisData[i][j])) {
            console.log(i, j);
            isChangeable = false;
          }
        }
      }
      console.log('isChangeable', isChangeable);
      if (isChangeable) {
        console.log('isChangeable', JSON.parse(JSON.stringify(currentBlock)), nextBlockShape);
        while (currentTopLeft[0] < 0) {
          tick();
        }
        for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 돌린 이후 공간 체크
          for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
            if (!tetrisData[i]) continue;
            let nextBlockShapeCell = nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]];
            if (nextBlockShapeCell > 0 && tetrisData[i][j] === 0) {
              // 다음 모양은 있는데 현재 칸이 없으면
              tetrisData[i][j] = currentBlock.numCode;
            } else if (nextBlockShapeCell === 0 && tetrisData[i][j] && tetrisData[i][j] < 10) {
              // 다음 모양은 없는데  현재 칸이 있으면
              tetrisData[i][j] = 0;
            }
          }
        }
        currentBlock.currentShapeIndex = nextShapeIndex;
      }
      draw();
      break;
    }
    case 'Space': // 한방에 쭉 떨구기
      while (tick()) {} // 아래로 내려갈 수 있을 때까지 무한반복으로 내려가기, 내려갈 수 없으면 break
      break;
  }
});

// 이벤트 루프 - 비동기 방식
/* const, let, var 차이 
const : 상수이름, 블록스코프(=괄호 안에서만 유효함 - 즉, 함수뿐만 아니라 if문이나 for문 등등)
let : 변수이름, 블록스코프
var : 변수이름, 함수스코프
*/
// function과 화살표 함수의 차이 - this가 다름
// ... (스프레드 문법, 배열 앞에 점 세 개) : 배열 괄호 벗기기
// [...Array(숫자).keys()] === [0, 1, 2, ... , 숫자-1]
// [...Array(숫자).keys().map((v) => v+1)] === [1, 2, 3, ..., 숫자]