<template>
    <div>
        <link rel="stylesheet" href="https://cdn.plyr.io/3.6.9/plyr.css" />
        <video id="player" ref="videoplayer" class="player" style="--plyr-color-main: #1ac266"></video>
    </div>
</template>

<script setup>
import Plyr from 'plyr';
import { ref, defineProps, watch, onMounted, toRef } from 'vue';

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    section: {
        type: Number,
        required: false,
        default: 0,
    },
});
const { url } = props;
const section = toRef(props, 'section'); // props를 ref로 변환합니다.

const video = ref(null);
let player;

onMounted(() => {
    onSetVideoPlayer();
});

watch(section, (newSection) => {
    if (newSection !== 0) {
        console.log(player);
        player.currentTime = newSection;
        player.play();
    }
});

function getEventVideo() {
    console.log(player.currentTime);
}

function onSetVideoPlayer() {
    video.value = document.getElementById('player');
    player = new Plyr(video.value);
    player.source = {
        type: 'video',
        title: '샘플 영상',
        sources: [
            {
                src: url,
            },
        ],
    };

    player.on('pause', () => {
        getEventVideo('playing');
    });
    player.on('ended', () => {
        getEventVideo('ended');
    });
    player.on('play', () => {});

    // 현재 재생위치
    player.on('timeupdate', () => {});

    player.muted = false;
}
</script>

<style>
:root {
    --plyr-color-main: #1ac266;
}

.player {
    --plyr-color-main: #1ac266;
}
</style>
