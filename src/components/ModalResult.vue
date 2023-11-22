<template>
	<div
		class="bg-black/20 top-0 left-0 h-full w-full absolute flex items-center justify-center p-4"
	>
		<div
			class="bg-white rounded-lg shadow-lg flex items-center justify-around relative p-12"
		>
			<img
				class="w-80 rounded-lg shadow-lg"
				:src="changeImg"
			/>
			<h3 class="text-2xl font-bold p-4 text-center">
				{{
					totalPayment >= 10000
						? "Consider reducing your car usage to lessen your enviromental impact. Every kilometer counts for a greener planet. Thank you for being eco-conscious! Compensate your impact! Offset your carbon footprint by planting a tree"
						: "Saving on gas? Explore const-effective alternatives! Consider car-sharing to trim expenses and reduce your carbon footprint."
				}}
			</h3>
			<Icon
				@click="closeModal"
				icon="material-symbols:close"
				width="50"
				class="cursor-pointer absolute top-4 right-1"
			/>
		</div>
	</div>
</template>

<script setup>
	import { inject, computed } from "vue";
	import { Icon } from "@iconify/vue";

	// const defaultImg =
	//     'https://c4.wallpaperflare.com/wallpaper/449/313/275/mountains-clouds-landscapes-nature-trees-forest-hills-sunlight-roads-scenic-morning-skyscapes-256-nature-forests-hd-art-wallpaper-preview.jpg'

	// const imageSrc = ref(defaultImg)

	const changeImg = computed(() => {
		return props.totalPayment >= 10000
			? "https://wwftr.awsassets.panda.org/img/hava_kirlilii_1_1_13888.png"
			: "https://c4.wallpaperflare.com/wallpaper/449/313/275/mountains-clouds-landscapes-nature-trees-forest-hills-sunlight-roads-scenic-morning-skyscapes-256-nature-forests-hd-art-wallpaper-preview.jpg";
	});

	const showModal = inject("showModal");

	const closeModal = () => {
		showModal.value = !showModal.value;
	};

	const props = defineProps({
		userData: Array,
		totalPayment: Number,
	});
</script>

<style scoped></style>
