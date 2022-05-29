var tetris = document.querySelector('#tetris');
var blockArr = [
    ['red', true, [
        [1, 1],
        [1, 1],
    ]], 
    ['blue', true, [
        [0, 2, 0],
        [2, 2, 2],
    ]],
    ['orange', true, [
        [3, 3, 0],
        [0, 3, 3],
    ]],
    ['skyblue', true, [
        [0, 4, 4],
        [4, 4, 0],
    ]],
    ['yellowgreen', true, [
        [5, 5, 5],
        [5, 0, 0],
    ]],
    ['pink', true, [
        [6, 6, 6],
        [0, 0, 6],
    ]],
    ['yellow', true, [
        [7, 7, 7, 7],
    ]]

];
var blockDict = { // [색깔, 움직일 수 있는지 여부, 블록모양]
    0: ['white', false, []],
    1: ['red', true, [
        [1, 1],
        [1, 1],
    ]], 
    
    2: ['blue', true, [
        [0, 1, 0],
        [1, 1, 1],
    ]],
    3: ['orange', true, [
        [1, 1, 0],
        [0, 1, 1],
    ]],
    4: ['skyblue', true, [
        [0, 1, 1],
        [1, 1, 0],
    ]],
    5: ['yellowgreen', true, [
        [1, 1, 1],
        [1, 0, 0],
    ]],
    6: ['pink', true, [
        [1, 1, 1],
        [0, 0, 1],
    ]],
    7: ['yellow', true, [
        [1, 1, 1, 1],
    ]],
    // 10: ['red', false, []],
    // 20: ['blue', false, []],
    // 30: ['orange', false, []],
    // 40: ['skyblue', false, []],
    // 50: ['yellowgreen', false, []],
    // 60: ['pink', false, []],
    // 70: ['yellow', false, []]
};

var tetrisData = [];
var stopDown = false; //flag역할, stopDown이 true가 되었을 경우 더 이상 내려가지 않음

function 칸만들기() {
    var fragment = document.createDocumentFragment();
    for (var i=0; i<20; i++) {
        var tr = document.createElement('tr');
        var arr = []; // tetrisData와 참조 관계
        tetrisData.push(arr); 
        fragment.appendChild(tr);
        for (var j=0; j<10; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);
            arr.push(0);
        }
    }
    console.log(tetrisData);
    tetris.appendChild(fragment);
}

function 화면그리기() {
    tetrisData.forEach(function (tr, i) {
        tr.forEach(function (td, j) {
            tetris.children[i].children[j].className = blockDict[td][0]; //색깔
        });
    })
}

function 블록생성기() {
    stopDown = false; // 다시 또 다른 블록이 내려갈 수 있도록 false처리
    var 블록 = blockArr[Math.floor(Math.random() * 7)][2]; // 블록 모양을 복사해서 테트리스데이터에 붙여넣기
    console.log(블록);
    블록.forEach(function(tr, i) {
        tr.forEach(function(td, j) {
            // TODO : 블록 생성할 때 이미 차 있으면 게임 오버
            tetrisData[i][j + 3] = td; // 첫 번째 줄 세 번째 칸부터 채우기
        });
    });
    화면그리기();
}

function 블록내리기() {
    // 반복문을 아래서부터 실행 
    // - 테트리스 조각의 아랫면 기준으로 바닥에 닿았는지 판단하므로
    for (var i = tetrisData.length - 1; i >= 0; i--) {
        tetrisData[i].forEach(function(td, j) {
           if (td > 0 && td < 10) {// 움직이는 블록들의 경우
                if (tetrisData[i + 1] && !stopDown) { // 테트리스데이터가 존재할 때 & stopDown변수가 false일 때
                    tetrisData[i + 1][j] = td; // td를 한 줄 아래로 보내기
                    tetrisData[i][j] = 0; // 현재 칸은 빈칸으로
                } else { // 땅끝에 도달한 경우 (즉 한 칸 밑의 테트리스데이터가 존재하지 x)
                    stopDown = true;
                    tetrisData[i][j] = td * 10; // 10을 곱해주면 맨 끝에 닿으니까

                }
           }
        });
    }
    if (stopDown) {
        블록생성기();
    }
    화면그리기();
}

//keypress의 경우 방향키 인식 안됨
//쭉- 눌러야 하는 경우에는 keydown, 그런게 아닌 경우 keyup이 더 깔끔함
window.addEventListener('keydown', function(e) {
    switch (e.code) {
        case 'ArrowRight': // 오른쪽 이동
            console.log('ArrowRight');
            break;
        case 'ArrowLeft': // 왼쪽 이동
            console.log('ArrowLeft');
            break;
        case 'ArrowDown':
            console.log('ArrowDown');
            break;
        default:
            break;
    }
});

window.addEventListener('keyup', function(e) {
    switch (e.code) {
        case 'Space': // 한방에 내리기
            console.log('Space');
            break;
        case 'ArrowUp': //방향 전환
            console.log('ArrowUp');
            break;
        default:
            break;
    }
});

칸만들기();
블록생성기();
setInterval(블록내리기, 100);

// const, let, var 차이
// function과 화살표 함수의 차이 - this가 다름
// ... (스프레드 문법, 배열 앞에 점 세 개) : 배열 괄호 벗기기
// [...Array(숫자).keys()] === [0, 1, 2, ... , 숫자-1]
// [...Array(숫자).keys().map((v) => v+1)] === [1, 2, 3, ..., 숫자]