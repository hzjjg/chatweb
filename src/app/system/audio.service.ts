import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class AudioService {
    private audioEle: HTMLAudioElement;
    private playSubject: Subject<AudioConfig>;
    private audioUrls: any;

    constructor() {
        this.audioUrls = {
            'joinRoom': '/resources/sounds/join_room.wav',
            'newC2cMsg': '/resources/sounds/new_msg.wav',
            'newRegister': '/resources/sounds/join_room.wav',
            'notice': '/resources/sounds/join_room.wav',
        }

        this.audioEle = document.createElement('audio');
        this.audioEle.innerHTML = `<source>`;
        // this.audioEle.setAttribute('loop', 'loop');
        this.playSubject = new Subject();

        this.playSubject.throttleTime(2000).subscribe((config) => {
            let volume = '1',
                audioUrl = '/resources/sounds/join_room.wav'

            if (config) {
                volume = config.volume || volume
                audioUrl = this.audioUrls[config.audioType] || audioUrl
            }

            this.audioEle.setAttribute('volume', volume);
            this.audioEle.src = audioUrl;
            this.audioEle.play();
        })
    }

    play(params: AudioConfig) {
        this.playSubject.next(params);
    }

    notice(type: AudioType) {
        this.play({ audioType: type })
    }
}

export enum AudioType {
    JOIN_ROOM = 'joinRoom',
    NEW_C2C_MSG = 'newC2cMsg',
    NEW_REGISTER = 'newRegister',
    NOTICE = 'notice'
}

export interface AudioConfig {
    volume?: any;
    audioType?: AudioType;
    url?: string
}

