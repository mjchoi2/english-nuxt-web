<template>
    <div class="wrapper">
        <div class="game">
            <div class="game__board">
                <div v-for="(item, i) in cardDeck" :key="i" class="card" :data-id="i" :data-card="item.card">
                    <div class="card__back" @click="clickCard($event)"></div>
                    <div class="card__front">
                        <img :src="item.card" alt="front of card" class="p-4 w-36 h-36" />
                    </div>
                </div>
            </div>
        </div>
        <NuxtLink to="/today/drawing"
            ><button class="flex items-center absolute right-0 top-0">NEXT <ArrowRightEndOnRectangleIcon class="w-8 h-8" /></button
        ></NuxtLink>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/solid';

const boardSize = ref(8);
const cardList = ref([
    '/images/today/bear.png',
    '/images/today/chick.png',
    '/images/today/dolphin.png',
    '/images/today/penguin.png',
    '/images/today/rabbit.png',
    '/images/today/rat-head.png',
    '/images/today/shell.png',
    '/images/today/whale.png',
]);
const cardDeck = ref([]);
const isFlip = ref(false); // 카드 뒤집기 가능 여부

onMounted(() => {
    // 카드 덱 생성
    makeCardDeck();

    // 최초 1회 전체 카드 보여줌
    showCardDeck();
});

const makeCardDeck = () => {
    const randomNumberArr = [];

    // cardList중 boardSize 만큼 뽑도록 구현
    for (let i = 0; i < boardSize.value / 2; i++) {
        // 랜덤 값 뽑기
        const randomNumber = getRandom(cardList.value.length, 0);

        // 중복 검사
        if (!randomNumberArr.includes(randomNumber)) {
            randomNumberArr.push(randomNumber);
        } else {
            i--;
        }
    }

    // 카드는 두 장씩 필요하므로 한 번 더 추가
    randomNumberArr.push(...randomNumberArr);

    // 카드 섞기
    shuffle(randomNumberArr);

    // 섞은 값으로 카드 세팅
    for (let i = 0; i < boardSize.value; i++) {
        cardDeck.value.push({
            card: cardList.value[randomNumberArr[i]],
            isOpen: false,
            isMatch: false,
        });
    }

    return cardDeck.value;
};

const getRandom = (max, min) => {
    return parseInt(Math.random() * (max - min)) + min;
};

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
};

// 전체 카드 보여주는 함수
const showCardDeck = () => {
    let cnt = 0;
    const cardBack = document.getElementsByClassName('card__back');
    const cardFront = document.getElementsByClassName('card__front');

    const showCardPromise = new Promise((resolve) => {
        const showCardTimer = setInterval(() => {
            cardBack[cnt].style.transform = 'rotateY(180deg)';
            cardFront[cnt++].style.transform = 'rotateY(0deg)';

            if (cnt === cardDeck.value.length) {
                clearInterval(showCardTimer);

                resolve();
            }
        }, 200);
    });

    showCardPromise.then(() => {
        // showCardPromise 성공인 경우 실행할 코드
        setTimeout(hideCardDeck, 2000);
    });
};

// 전체 카드 숨기는 함수
const hideCardDeck = () => {
    const cardBack = document.getElementsByClassName('card__back');
    const cardFront = document.getElementsByClassName('card__front');

    for (let i = 0; i < cardDeck.value.length; i++) {
        cardBack[i].style.transform = 'rotateY(0deg)';
        cardFront[i].style.transform = 'rotateY(-180deg)';
    }

    // 전체 카드 숨기고 0.1초 뒤 isFlip = true, 게임 타이머 시작
    // 바로 클릭이 가능하도록 할 때(isFlip = true 값을 바로 줬을 때) 에러가 나는 경우가 있어 0.1초 후 부터 카드 뒤집기가 가능하도록 설정
    setTimeout(() => {
        isFlip.value = true;

        // 게임 타이머 시작
        // startTimer();
    }, 100);
};

const clickCard = (e) => {
    console.log(e);
    if (isFlip.value === false) {
        return;
    }
    // 클릭된 요소가 card__back 클래스를 가진 요소일 때
    if (e.target.classList.contains('card__back')) {
        // 해당 요소의 부모 요소 중 가장 가까운 card 클래스를 가진 요소를 찾음
        const cardElement = e.target.closest('.card');
        // card 클래스를 가진 요소가 있다면
        if (cardElement) {
            const clickCardId = cardElement.dataset.id;

            if (cardDeck.value[clickCardId].isOpen === false) {
                openCard(clickCardId);
            }
        }
    }
};

// 카드 오픈
const openCard = (id) => {
    const cardBack = document.getElementsByClassName('card__back');
    const cardFront = document.getElementsByClassName('card__front');

    // 화면에서 앞면으로 보이도록 스타일 조정
    cardBack[id].style.transform = 'rotateY(180deg)';
    cardFront[id].style.transform = 'rotateY(0deg)';

    // 선택한 카드의 open 여부를 true로 변경
    cardDeck.value[id].isOpen = true;
    console.log(cardDeck.value);
    // 선택한 카드가 첫 번째로 선택한 카드인지, 두 번째로 선택한 카드인지 판별하기 위해 오픈한 카드의 index를 저장하는 배열 요청
    const openCardIndexArr = getOpenCardArr();

    // 두 번째 선택인 경우 카드 일치 여부 확인
    // 일치 여부 확인 전까지 카드 뒤집기 불가(isFlip = false)
    if (openCardIndexArr.length === 2) {
        isFlip.value = false;

        checkCardMatch(openCardIndexArr);
    }
};

// 오픈한 카드의 index를 저장하는 배열 반환
const getOpenCardArr = () => {
    const openCardIndexArr = [];

    // 반복문을 돌면서 isOpen: true이고 isMatch: false인 카드의 인덱스를 배열에 저장
    cardDeck.value.forEach((element, i) => {
        if (element.isOpen === false || element.isMatch === true) {
            return;
        }

        openCardIndexArr.push(i);
    });

    return openCardIndexArr;
};

// 카드 일치 여부 확인
const checkCardMatch = (indexArr) => {
    const firstCard = cardDeck.value[indexArr[0]];
    const secondCard = cardDeck.value[indexArr[1]];

    if (firstCard.card === secondCard.card) {
        // 카드 일치 처리
        firstCard.isMatch = true;
        secondCard.isMatch = true;

        matchCard(indexArr);
    } else {
        // 카드 불일치 처리
        firstCard.isOpen = false;
        secondCard.isOpen = false;

        closeCard(indexArr);
    }
};

// 카드 일치 처리
const matchCard = () => {
    // 카드를 전부 찾았으면 스테이지 클리어
    if (checkClear() === true) {
        // clearStage();
        console.log('clear!!');
        return;
    }

    // 바로 클릭 시 에러가 나는 경우가 있어 0.1초 후 부터 카드 뒤집기가 가능하도록 설정
    setTimeout(() => {
        isFlip.value = true;
    }, 100);
};

// 카드를 전부 찾았는지 확인하는 함수
const checkClear = () => {
    // 카드를 전부 찾았는지 확인
    let isClear = true;

    cardDeck.value.forEach((element) => {
        // 반복문을 돌면서 isMatch: false인 요소가 있다면 isClear에 false 값을 저장 후 반복문 탈출
        if (element.isMatch === false) {
            isClear = false;
        }
    });

    return isClear;
};

// 카드 불일치 처리
const closeCard = (indexArr) => {
    const cardBack = document.getElementsByClassName('card__back');
    const cardFront = document.getElementsByClassName('card__front');

    // 0.8초 동안 카드 보여준 후 닫고, 카드 뒤집기가 가능하도록 설정
    setTimeout(() => {
        for (let i = 0; i < indexArr.length; i++) {
            cardBack[indexArr[i]].style.transform = 'rotateY(0deg)';
            cardFront[indexArr[i]].style.transform = 'rotateY(-180deg)';
        }

        isFlip.value = true;
    }, 800);
};
</script>

<style scoped>
.game {
    @apply flex justify-center items-center w-[80%] rounded-[5px] p-6;
}

.game::after {
    content: '';
    @apply block;
}

.game__board {
    @apply relative grid grid-cols-4 gap-4 left-0 w-full h-fit place-items-center;
}

.card {
    @apply w-full h-[220px] relative;
}

.card__back,
.card__front {
    background-clip: content-box;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center center;
    backface-visibility: hidden;
    transition: transform 500ms;
    @apply flex justify-center items-center absolute w-full h-full border-2 rounded-[5px];
}

.card__front {
    transform: rotateY(-180deg);
    background-size: 80% auto;
}

.card__back {
    transform: rotateY(0deg);
    background-image: url('/images/today/award.png');
    background-size: 50% auto;
}
</style>
