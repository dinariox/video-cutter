<script lang="ts">
	import { formatVideoTime } from '../utils';

	export let inputVideo;
	export let selectedStart = 0;
	export let selectedEnd = 10;

	let inputVideoEl;
	let inputVideoCurrentTime = 0;
	let inputVideoDuration = 0;
	let inputVideoPaused = true;

	function playPauseVideo() {
		if (inputVideoEl.paused) {
			inputVideoEl.play();
		} else {
			inputVideoEl.pause();
		}
	}

	function changeInputVideoTime(e) {
		inputVideoEl.currentTime = e.target.value;
	}
</script>

<div class="input-video-container">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video src={URL.createObjectURL(inputVideo)} bind:this={inputVideoEl} bind:currentTime={inputVideoCurrentTime} bind:duration={inputVideoDuration} bind:paused={inputVideoPaused} />
	<div class="video-controls">
		<button on:click={playPauseVideo}>{inputVideoPaused ? 'Play' : 'Pause'}</button>
		<input type="range" min="0" max={inputVideoDuration} value={inputVideoCurrentTime} on:input={changeInputVideoTime} />
		<p>{formatVideoTime(inputVideoCurrentTime)} / {formatVideoTime(inputVideoDuration)}</p>
	</div>
	<div class="video-controls">
		<button
			on:click={() => {
				selectedStart = inputVideoCurrentTime;
			}}>Set beginning of the video</button
		>
		<p>Start: {formatVideoTime(selectedStart)}</p>
		<p>End: {formatVideoTime(selectedEnd)}</p>
		<button
			on:click={() => {
				selectedEnd = inputVideoCurrentTime;
			}}>Set end of the video</button
		>
	</div>
</div>

<style>
	.video-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.video-controls input[type='range'] {
		width: 100%;
	}

	.video-controls p {
		margin: 0;
		min-width: max-content;
	}

	.input-video-container {
		margin-bottom: 1rem;
	}
</style>
