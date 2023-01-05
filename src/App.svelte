<script lang="ts">
	import InputVideoPlayer from './components/InputVideoPlayer.svelte';

	import { onMount } from 'svelte';
	import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
	import Dropzone from 'svelte-file-dropzone';

	let ffmpegReady = false;
	let ffmpegIsWorking = false;
	let inputVideo;
	let selectedStart;
	let selectedEnd;
	let trimmedVideo;

	const ffmpeg = createFFmpeg({
		log: true,
		corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
		mainName: 'main',
		progress: ({ ratio }) => {
			if (ratio === 1) {
				ffmpegIsWorking = false;
			}
		}
	});

	function load() {
		ffmpeg.load().then(() => {
			ffmpegReady = true;
		});
	}

	onMount(load);

	function handleFilesSelect(e) {
		if (e.detail.fileRejections.length > 0) {
			alert('Please select a video file');
			return;
		}
		inputVideo = e.detail.acceptedFiles[0];
	}

	function resetVideo() {
		inputVideo = null;
	}

	async function trimVideo() {
		if (selectedStart >= selectedEnd) {
			alert('Your start time must be before your end time');
			return;
		}

		ffmpegIsWorking = true;

		const extension = inputVideo.name.split('.').pop();
		ffmpeg.FS('writeFile', `input.${extension}`, await fetchFile(inputVideo));
		await ffmpeg.run('-i', `input.${extension}`, '-to', selectedEnd.toString(), '-ss', selectedStart.toString(), '-c:v', 'copy', '-c:a', 'copy', `out.${extension}`);
		const data = ffmpeg.FS('readFile', `out.${extension}`);
		trimmedVideo = URL.createObjectURL(new Blob([data.buffer], { type: 'video/' + extension || 'mp4' }));
	}
</script>

<main>
	<h1>Video cutter</h1>
	{#if ffmpegReady}
		{#if ffmpegIsWorking}
			<p>Working...</p>
		{:else}
			<p>Ready to go!</p>
		{/if}

		<div class="flex-col">
			{#if inputVideo}
				<h3>Input Video</h3>
				<InputVideoPlayer {inputVideo} bind:selectedStart bind:selectedEnd />
				<div class="video-action-buttons">
					<button on:click={resetVideo} disabled={ffmpegIsWorking}>Choose other video</button>
					<button on:click={trimVideo} disabled={ffmpegIsWorking}>Trim video</button>
				</div>
				{#if trimmedVideo}
					<h3>Trimmed Video</h3>
					<!-- svelte-ignore a11y-media-has-caption -->
					<video controls src={trimmedVideo} />
				{/if}
			{:else}
				<p>To begin, select a video:</p>
				<Dropzone on:drop={handleFilesSelect} accept="video/*" multiple={false} containerClasses="dropzone-custom" disableDefaultStyles={true} />
			{/if}
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</main>

<style>
	.flex-col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
