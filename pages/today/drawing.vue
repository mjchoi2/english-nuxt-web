<template>
    <div class="wrapper">
        <CommonSkecth v-if="showlist" :contents="sketch" />
        <div v-else class="grid grid-flow-col grid-cols-4 gap-4 mx-10 h-full py-12">
            <div id="container" class="col-span-3 rounded-3xl w-full h-full overflow-hidden bg-white shadow-gray"></div>
            <div class="col-span-1 text-center flex flex-col gap-4 justify-center">
                <ul class="grid grid-flow-col grid-cols-3 gap-2">
                    <li class="inline-block"><img class="m-auto" src="/images/common/btn_list.png" /></li>
                    <li class="inline-block" @click="resetCanvas()"><img class="m-auto" src="/images/common/btn_reset.png" /></li>
                    <li class="inline-block" @click="saveWithoutBG()"><img class="m-auto" src="/images/common/btn_check_on.png" /></li>
                </ul>
                <div class="grid grid-flow-col grid-cols-4 gap-4">
                    <button type="button" class="pt-2 rounded-3xl outline-none border-0 focus:outline-none shadow-gray" @click="mode = 'crayon'">
                        <img class="m-auto" src="/images/common/art_canvas_crayon.png" />
                    </button>
                    <button type="button" class="pt-2 rounded-3xl outline-none border-0 focus:outline-none shadow-gray" @click="mode = 'brush'">
                        <img class="m-auto" src="/images/common/art_canvas_brush.png" />
                    </button>
                    <button type="button" class="pt-2 rounded-3xl outline-none border-0 focus:outline-none shadow-gray" @click="mode = 'eraser'">
                        <img class="m-auto" src="/images/common/art_canvas_eraser.png" />
                    </button>
                    <button type="button" class="pt-2 rounded-3xl outline-none border-0 focus:outline-none shadow-gray">
                        <color-picker v-model:pureColor="colors" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const content = ref([]);
const sketch = ref([]);
const showlist = ref(false);
const colors = ref('rgb(0, 0, 0)');
const paletteType = ref('m');
const mode = ref('brush');
const stage = ref(null);

const isPaint = ref(false);
const lastPointerPosition = ref([]);
const brush = ref(12);

onMounted(() => {
    getContents();
});

const getContents = async () => {
    try {
        const res = await $fetch('https://api.bigsmom.com/api/bigsplay/art/getcoloringcontent?idx=' + '646');
        console.log(res);
        content.value = res;
        colors.value = res.color[0];

        const container = document.getElementById('container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        console.log('$$%%$%$%$%');
        console.log(containerHeight);

        console.log(containerHeight);
        stage.value = new Konva.Stage({
            container,
            width: containerWidth,
            height: 500,
        });
        console.log(stage);
        const bglayer = new Konva.Layer({
            name: 'backgroundLayer',
        });
        const backgroundImage = new Konva.Image({
            x: 0,
            y: 0,
            width: stage.value.width(),
            height: stage.value.height(),
        });
        const bgImageObj = new Image();
        bgImageObj.onload = () => {
            backgroundImage.image(bgImageObj);
            bglayer.batchDraw();
        };
        bgImageObj.src = res.img_clip;
        bgImageObj.crossOrigin = 'Anonymous';
        bglayer.add(backgroundImage);
        stage.value.add(bglayer);
        setDrawLayer();
    } catch (e) {
        console.log(e);
    }
};

const setDrawLayer = () => {
    const drawGroup = new Konva.Group({ opacity: 0.7, id: 'drawGroup' });
    const drawLayer = new Konva.Layer({ name: 'canvasLayer', id: 'canvasLayer' });
    drawLayer.add(drawGroup);
    stage.value.add(drawLayer);
    let lastLine;
    drawLayer.moveToTop();
    stage.value.on('mousedown touchstart', (e) => {
        isPaint.value = true;
        lastPointerPosition.value = stage.value.getPointerPosition();
        const strokeStyle = colors.value;
        const shadowColor = colors.value;
        const lineWidth = mode.value === 'crayon' ? 15 : 12;
        lastLine = new Konva.Line({
            stroke: strokeStyle,
            shadowColor,
            strokeWidth: lineWidth,
            lineCap: 'round',
            lineJoin: 'round',
            points: [lastPointerPosition.value.x, lastPointerPosition.value.y, lastPointerPosition.value.x, lastPointerPosition.value.y],
        });
        if (mode.value === 'brush') lastLine.globalCompositeOperation('source-over');
        if (mode.value === 'eraser') {
            lastLine.globalCompositeOperation('destination-out');
            lastLine.strokeWidth(20);
        }
        if (mode.value === 'crayon') {
            lastLine.globalCompositeOperation('source-over');
            lastLine.lineJoin('round');
            lastLine.shadowBlur(20);
            lastLine.shadowOpacity(0.5);
        }
        drawGroup.add(lastLine);
    });

    stage.value.on('mousemove touchmove', (e) => {
        if (!isPaint.value) {
            return;
        }
        drawGroup.cache();
        e.evt.preventDefault();
        const pos = stage.value.getPointerPosition();
        const newPoints = lastLine.points().concat([pos.x, pos.y]);
        lastLine.points(newPoints);
    });

    stage.value.on('mouseup touchend', (e) => {
        isPaint.value = false;
    });
};

const selectColor = (style) => {
    colors.value = style;
    mode.value = 'brush';
};

const getList = async () => {
    try {
        const res = await $http.$get('https://api.bigsmom.com/api/bigsplay/speech/getwordsplaylist?mode=coloring&mng_num=' + $store.state.userinfo.childInfo.mng_num + '&idx=' + content.value.id);
        sketch.value = res;
        showlist.value = true;
    } catch (error) {
        console.log('error');
    }
};

const resetCanvas = () => {
    stage.value.findOne('#canvasLayer').destroy();
    setDrawLayer();
};

const saveWithoutBG = () => {
    const oriStage = stage.value.clone();
    oriStage.getLayers().forEach((layer) => {
        if (layer.attrs.name === 'backgroundLayer') {
            layer.destroyChildren();
            const background = new Konva.Rect({
                x: 0,
                y: 0,
                width: oriStage.width(),
                height: oriStage.height(),
                fill: 'white',
            });
            layer.add(background);
        }
    });

    setTimeout(() => {
        const oriURL = oriStage.toDataURL();
        save(oriURL);
    }, 10);
};

const save = (oriURL) => {
    const blobBin = Buffer.from(oriURL.split(',')[1], 'base64');
    const file = new Blob([new Uint8Array(blobBin)], {
        type: 'image/png',
    }); // Blob 생성

    const formData = new FormData();
    formData.append('type', 'coloring');
    formData.append('file', file);
    formData.append('agency', $store.state.userinfo.childInfo.agency);
    formData.append('user', $store.state.userinfo.childInfo.mng_num);
    formData.append('idx', content.value.id);

    for (const key of formData.entries()) {
        console.log(`${key}`);
    }

    $http
        .post('https://api.bigsmom.com/api/file/uplode/sketchupload', formData, {})
        .then((res) => {
            if (res.status == 200) {
                $store.dispatch('alert/setSaveAlert');
                resetCanvas();
            }
        })
        .catch((error) => {
            console.log(error);
            if (!error.response) {
                this.errorStatus = 'Error: Network Error';
                console.log(this.errorStatus);
            } else {
                const code = error.response.status;
                const response = error.response.data;
                console.log('code' + code);
                $store.dispatch('alert/setErrorAlert');
            }
        });
};
</script>

<style>
.vc-color-wrap {
    @apply !w-[65px] !h-[65px];
}
</style>
