<template>
    <div class="wrapper flex-col gap-y-4">
        <div class="content">
            <div v-for="(card, i) in cardList" :key="i" class="find__card">
                <button @click="onClickCard(i)">
                    <img :src="card" alt="find card" class="p-4 w-48 h-48" />
                </button>
                <span v-if="isAnswer !== null && !isAnswer && selected === i">
                    <XMarkIcon class="absolute text-red-500 top-0" />
                </span>
                <span v-if="isAnswer !== null && isAnswer && selected === i">
                    <CheckIcon class="absolute text-green-500 top-0" />
                </span>
            </div>
        </div>
        <p class="font-bold text-4xl text-center">Penguin</p>
        <NuxtLink to="/today/speech"
            ><button class="flex items-center absolute right-0 top-0">NEXT <ArrowRightEndOnRectangleIcon class="w-8 h-8" /></button
        ></NuxtLink>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { CheckIcon, XMarkIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/solid';

const cardList = ref(['/images/today/bear.png', '/images/today/chick.png', '/images/today/dolphin.png', '/images/today/penguin.png']);
const answer = ref(3);
const isAnswer = ref(null);
const selected = ref(null);

const onClickCard = (index) => {
    if (answer.value === index) {
        isAnswer.value = true;
    } else {
        isAnswer.value = false;
    }
    selected.value = index;
};
</script>

<style scoped>
.content {
    @apply grid grid-cols-4 gap-4;
}
.find__card {
    @apply bg-white rounded-md border relative;
}
</style>
