//
// Copyright (c) 2016 Samuel Fisher
// Licensed under the MIT License. See LICENSE.txt file in the project root for full license information.
//

class WsAudio
{
    private sourceBuffer: SourceBuffer;
    private queue: any[];
    private worker: Worker;
    private isFirstBlock: boolean;
    public onUpdate: (currentTime: number, bufferedTime: number) => void;

    constructor(private audio: HTMLAudioElement, audioUrl: string, workerSrc: string)
    {
        // Set audio element source
        var mediaSource = new MediaSource();
        this.audio.src = window.URL.createObjectURL(mediaSource);
        this.isFirstBlock = true;
        this.onUpdate = (c, b) => {};

        // Initialize background worker
        this.queue = [];
        this.worker = new Worker(workerSrc);
        
        mediaSource.addEventListener('sourceopen', () => {
            this.sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="vorbis"');

            this.worker.addEventListener('message', e => {

                // Audio data received
                var reader = new FileReader();
                reader.addEventListener('loadend', () => {
                    this.queue.push(reader.result);
                    this.appendBlock();
                });
                reader.readAsArrayBuffer(e.data);

            }, false);

            // Start receiving audio segments
            this.worker.postMessage({ command: 'init', url: audioUrl });

            this.sourceBuffer.addEventListener('updateend', () => {
                this.appendBlock(); // Get a chance to clean up old audio
            });

        });
    }

    private appendBlock()
    {
        if (this.sourceBuffer.updating) return;

        if (this.queue.length == 0 &&
            this.audio.currentTime > 2 &&
            this.audio.currentTime > this.sourceBuffer.buffered.start(0) + 5)
        {
            // Remove audio already listened to
            this.sourceBuffer.remove(0, this.audio.currentTime - 1);
            return;
        }

        if (this.queue.length == 0) {
            // Nothing to do
            return;
        }

        // Determine next append time
        var appendTime = 0;
        if (!this.isFirstBlock)
        {
            appendTime = this.sourceBuffer.buffered.end(0);
        }
        this.isFirstBlock = false;

        // Append audio segment
        this.sourceBuffer.timestampOffset = appendTime;
        this.sourceBuffer.appendBuffer(this.queue.shift());

        // Update stats
        this.onUpdate(this.audio.currentTime, appendTime);
    }
}
