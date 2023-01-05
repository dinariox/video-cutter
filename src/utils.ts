export const formatVideoTime = (time) => {
	// return time in format "mm:ss.ms" and always 2 digits for each
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time - minutes * 60);
	const milliseconds = Math.floor((time - minutes * 60 - seconds) * 1000);
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};
