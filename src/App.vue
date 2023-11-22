<template>
	<!-- Header-->
	<header
		class="bg-gray-100 fixed top-0 left-0 z-10 h-24 w-full flex items-center shadow-lg px-4"
	>
		<nav class="container mx-auto flex items-center w-full">
			<Icon
				icon="fluent:gas-pump-20-filled"
				width="50"
			/>
			<h1 class="ml-4 font-primary font-bold">$GAS TRACKER</h1>
		</nav>
	</header>
	<!--Main-->
	<main class="min-w-[768px] min-h-screen relative font-secondary lg:pt-44 pt-36">
		<div class="container w-full mx-auto px-4 md:px-0">
			<div class="flex justify-between">
				<div class="mb-4">
					<span class="text-2xl">Last Purchase : </span>
					<span class="text-2xl"
						>{{ currentPayment.payment }}(&#x20BA;)</span
					>
				</div>
				<div>
					<span class="text-2xl">Current reading : </span>
					<span class="text-2xl"
						>{{ currentPayment.distance }}km</span
					>
				</div>
			</div>
			<form
				@submit="addUserData"
				class="flex flex-row gap-12"
			>
				<input
					class="py-6 px-4 bg-gray-200 rounded-lg text-2xl focus:outline-none flex-1 placeholder:text-4xl"
					type="number"
					step="1"
					required
					v-model="inputPayment"
					placeholder="Enter purchased amount?"
				/>
				<input
					class="py-6 px-4 bg-gray-300 text-2xl rounded-lg focus:outline-none flex-1 placeholder:text-4xl"
					placeholder="Enter your current km"
					type="number"
					required
					v-model="inputDistance"
				/>
				<input
					class="py-6 px-4 flex-1 bg-green-700 rounded-lg text-white text-2xl font-bold max-w-[96px]"
					type="submit"
					value="Add"
				/>
			</form>
			<!--Results-->
			<div
				class="mt-5 max-h-[768px]"
				v-if="userData && userData.length > 0"
			>
				<h2 class="text-2xl">Last month</h2>
				<div class="canvas-box">
					<canvas ref="dataChartEl"></canvas>
				</div>
				<div class="payment-history">
					<h2 class="text-4xl font-bold text-center p-4">
						Drive History
					</h2>
					<div class="min-w-lg p-4">
						<table
							class="w-full flex flex-col gap-6 justify-between"
						>
							<tr
								class="flex flex-row justify-around pb-2 border-b-zinc-400 border-b"
							>
								<th>Date</th>
								<th>Purchase Amount</th>
								<th>Distance</th>
							</tr>
							<tr
								class="flex flex-row justify-around relative last:border-b-zinc-400 last:border-b last:pb-4"
								v-for="(data, index) in userData"
								:key="index"
							>
								<td>
									{{
										new Date(data.date).toLocaleDateString()
									}}
								</td>
								<td>{{ data.payment }}</td>
								<td>{{ data.distance }}</td>
								<div class="absolute top-[-8px] right-0">
									<Icon
										icon="material-symbols:delete-outline"
										height="36"
										@click="deleteData(index)"
									/>
								</div>
							</tr>
						</table>
					</div>
					<div class="flex justify-end mt-4">
						<div>
                            <h3 class="font-bold text-2xl flex justify-end gap-10">
                                <span class="font-normal">Total purchase: </span
                                >{{ totalPayment }} (&#x20BA;)
                            </h3>
                            <h3 class="font-bold text-2xl flex justify-end gap-10">
                                <span class="font-normal">Total distance traveled: </span
                                >{{ totalDistance }} km
                            </h3>
                        </div>
					</div>
				</div>
			</div>
			<Transition name="fade">
				<ModalResult
					v-if="showModalHandler && showModal"
					:user-data="userData"
					:total-payment="totalPayment"
				/>
			</Transition>
		</div>
	</main>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch,
		nextTick,
		shallowRef,
		provide,
	} from "vue";
	import Chart from "chart.js/auto";
	import { Icon } from "@iconify/vue";
	import ModalResult from "./components/ModalResult.vue";

	const userData = ref([]);
	const inputPayment = ref(null);
	const inputDistance = ref(null);

	const showModal = ref(true);

	provide("showModal", showModal);

	const previousDate = ref(null);

	const dataChartEl = ref(null);

	const dataChart = shallowRef(null);

	const showModalHandler = computed(() => {
		if (userData.value.length > 1 || totalPayment.value > 2000) {
			return true;
		}
		return false;
	});

	const addUserData = () => {
		const currentDate = new Date().getTime();
		userData.value.push({
			payment: inputPayment.value,
			date: currentDate,
			distance: inputDistance.value,
		});

		previousDate.value = currentDate;
		inputPayment.value = "";
		inputDistance.value = "";
	};

	const currentPayment = computed(() => {
		return (
			userData.value.sort((a, b) => b.date - a.date)[0] || { payment: 0 }
		);
	});

	const totalPayment = computed(() => {
		return userData.value.reduce((prev, curr) => prev + curr.payment, 0);
	});

	const totalDistance = computed(() => {
		let lastD = userData.value[0].distance;
		let firstD = userData.value[userData.value.length - 1].distance;
		return lastD - firstD;
	});

	watch(
		userData,
		(newVal) => {
			localStorage.setItem("user-data", JSON.stringify(newVal));
		},
		{ deep: true },
	);

	watch(
		userData,
		async (newData) => {
			const ps = [...newData];

			if (dataChart.value) {
				dataChart.value.data.labels = ps
					.sort((a, b) => a.date - b.date)
					.map((p) => new Date(p.date).toLocaleDateString())
					.slice(-30);

				dataChart.value.data.datasets[0].data = ps
					.sort((a, b) => a.date - b.date)
					.map((p) => p.payment)
					.slice(-30);

				dataChart.value.update();

				return;
			}

			await nextTick(() => {
				dataChart.value = new Chart(
					dataChartEl.value.getContext("2d"),
					{
						type: "bar",
						data: {
							labels: ps
								.sort((a, b) => a.date - b.date)
								.map((p) =>
									new Date(p.date).toLocaleDateString(),
								),
							datasets: [
								{
									label: "Payment",
									data: ps
										.sort((a, b) => a.date - b.date)
										.map((p) => p.payment),
									backgroundColor: "rgba(255, 105, 180, 0.2)",
									borderColor: "rgb(255, 105, 180)",
									borderWidth: 1,
									fill: true,
								},
							],
						},
					},
				);
			});
		},
		{ deep: true },
	);

	watch(
		() => previousDate,
		(newDate, oldDate) => {
			if (newDate && oldDate) {
				const newDateObj = new Date(newDate);
				const oldDateObj = new Date(oldDate);

				if (newDateObj.getMonth() > oldDateObj.getMonth()) {
					showModal.value = true;
				}
			}
		},
	);

	onMounted(() => {
		if (localStorage.getItem("user-data")) {
			userData.value = JSON.parse(
				localStorage.getItem("user-data") || [],
			);
		}
	});

	const deleteData = (index) => {
		userData.value.splice(index, 1);
	};
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 1s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
