var body = document.body;
// 문제 단어
var 단어 = document.createElement('div');
단어.textContent = '제로초';
document.body.append(단어);
// form
var 폼 = document.createElement('form');
document.body.append(폼);
// input
var 입력창 = document.createElement('input');
폼.append(입력창);
// button
var 버튼 = document.createElement('button');
버튼.textContent = '입력!';
폼.append(버튼); // body가 아니라 폼에 append 해주기
// 결과 text
var 결과창 = document.createElement('div');
document.body.append(결과창);

폼.addEventListener('submit', function 콜백함수(이벤트) {
    // 밑 while문에서 word는 단어.textContent로 대체
    // answer는 입력창 내의 문구 즉, 입력창.value으로 대체
    // 입력창 내 문구는 .value 사용
    이벤트.preventDefault(); //새로고침 막아주기(이전 내용 기억할 수 있게)
    if (단어.textContent[단어.textContent.length - 1] === 입력창.value[0]) {
        결과창.textContent = '딩동댕';
        단어.textContent = 입력창.value; // 입력했던 문구가 다음 문제로 바뀜
        입력창.value=''; // 입력창의 문구는 reset시켜줌
        입력창.focus(); // 사용자 편의를 위해 입력창 안에 커서가 자동으로 가게 해줌
    } else {
        결과창.textContent = '땡';
        입력창.value=''; // 입력창의 문구는 reset시켜줌
        입력창.focus(); // 사용자 편의를 위해 입력창 안에 커서가 자동으로 가게 해줌
    }
})
// var word = '제로초';

// while(true) {
//     var answer = prompt(word);
//     if (word[word.length - 1] === answer[0]) {
//         alert('딩동댕');
//         word = answer;
//     } else {
//         alert('땡');
//     }
// }