<template>
    <div class="wrapper">
        <div class="content">
            <div class="flex flex-col gap-y-4 justify-center items-center">
                <div>
                    <img class="w-[50%] h-auto m-auto" src="/images/today/train.jpg" alt="" />
                </div>
                <div>
                    <p v-if="nativePronunciation" class="font-bold text-4xl text-center">
                        {{ nativePronunciation }}
                    </p>
                    <p v-if="comparisonResult" class="font-bold tex-sm">발음 유사도: {{ comparisonResult }}%</p>
                </div>
                <div class="flex gap-x-2">
                    <button type="button" class="p-4 bg-white rounded-md shadow-lg outline-none border-0 focus:outline-none shadow-gray" @click="play">
                        <img class="w-12 m-auto" src="/images/common/volume_icon.png" alt="" />
                    </button>
                    <button type="button" class="p-4 bg-white rounded-md shadow-lg outline-none border-0 focus:outline-none shadow-gray" @click="startListening">
                        <img class="w-12 m-auto" src="/images/common/record_icon.png" alt="" />
                    </button>
                    <button type="button" class="p-4 bg-white rounded-md shadow-lg outline-none border-0 focus:outline-none shadow-gray">
                        <img class="w-12 m-auto" src="/images/common/play_icon.png" alt="" />
                    </button>
                    <button type="button" class="p-4 bg-white rounded-md shadow-lg outline-none border-0 focus:outline-none shadow-gray">
                        <img class="w-12 m-auto" src="/images/common/pause_icon.png" alt="" />
                    </button>
                </div>
            </div>
        </div>
        <NuxtLink to="/today/card"
            ><button class="flex items-center absolute right-0 top-0">NEXT <ArrowRightEndOnRectangleIcon class="w-8 h-8" /></button
        ></NuxtLink>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Howl } from 'howler';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/solid';

const nativePronunciation = ref('Train'); // 원어민 발음
const userPronunciation = ref(''); // 사용자 발음
const comparisonResult = ref(null); // 발음 유사도
let recognition = null; // recognition 객체
let sound = null;
const soundUrl = '/audios/train.mp3';

const play = () => {
    console.log(soundUrl);
    stop();
    sound = new Howl({ src: soundUrl });
    sound.play();
};

const stop = () => {
    if (sound != null) {
        sound.stop();
        sound.unload();
        sound = null;
    }
};

const startListening = () => {
    userPronunciation.value = '';

    try {
        if ('webkitSpeechRecognition' in window) {
            console.log(1111111);
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            console.log(2222222);
            recognition = new SpeechRecognition();
        } else {
            console.error('음성 인식을 지원하지 않는 브라우저입니다.');
            return;
        }

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;
        console.log(recognition);

        // 음성 입력이 없을 때 처리
        recognition.onaudioend = () => {
            console.log('음성 입력이 종료되었습니다.');
            comparePronunciations(); // 사용자가 아무 말도 하지 않았을 때 comparePronunciations를 호출합니다.
        };

        recognition.onresult = (event) => {
            console.log(event.results[0][0].transcript);
            const result = event.results[0][0].transcript;
            userPronunciation.value = result;
            comparePronunciations();
        };

        recognition.start();
    } catch (error) {
        console.error('음성 인식 에러:', error);
    }
};

const comparePronunciations = () => {
    // Levenshtein 알고리즘을 사용하여 발음 유사도 계산
    const native = nativePronunciation.value.toLowerCase();
    const user = userPronunciation.value.toLowerCase();
    const maxLength = Math.max(native.length, user.length);
    const distance = levenshteinDistance(native, user);
    const similarity = ((maxLength - distance) / maxLength) * 100;
    comparisonResult.value = similarity.toFixed(2);
};

const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    // Initialize matrix with 0s
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    // Calculate Levenshtein distance
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2[i - 1] === str1[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j] + 1, // deletion
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
};
</script>

<style scoped></style>
