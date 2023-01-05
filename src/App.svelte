<script lang="ts">
  import { onMount } from "svelte";
  import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

  let ready = false;
  let progress = 0;

  const ffmpeg = createFFmpeg({
    log: true,
    progress: ({ ratio }) => {
      progress = ratio;
    },
  });

  const load = async () => {
    await ffmpeg.load();
    ready = true;
  };

  onMount(load);

  let videos;
  let gif;
  let trimmedVideo;

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(videos[0]));

    // Run the FFMpeg command
    await ffmpeg.run("-i", "test.mp4", "-t", "5", "-ss", "0", "out.gif");

    // Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // Create a URL
    gif = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
  };

  const trimVideo = async () => {
    // Write the file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(videos[0]));

    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "10",
      "-ss",
      "0",
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      "out.mp4"
    );

    // Read the result
    const data = ffmpeg.FS("readFile", "out.mp4");

    // Create a URL
    trimmedVideo = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
  };
</script>

<main>
  <h1>Video cutter</h1>
  {#if ready}
    <p>
      {#if progress > 0}
        Working... {Math.round(progress * 1000) / 10}
      {:else}
        Ready to go!
      {/if}
    </p>
    <div class="flex-col">
      <input type="file" accept="video/*" bind:files={videos} />
      {#if videos}
        <video controls width="400" src={URL.createObjectURL(videos[0])} />
        <button on:click={convertToGif}>Convert to GIF</button>
        <button on:click={trimVideo}>Trim video</button>
        {#if trimmedVideo}
          <video controls width="400" src={trimmedVideo} />
        {/if}
        {#if gif}
          <img src={gif} width="400" />
        {/if}
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
