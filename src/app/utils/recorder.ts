

import {Injectable} from "@angular/core";

export class AudioConfig {

    sampleBits?: number = 8; //采样数位 8, 16
    sampleRate?: number = (44100 / 6); //采样率(1/6 44100)
    //单声道
    channelCount: number = 1;
}

navigator.getUserMedia = navigator.getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).navigator.mozGetUserMedia || (<any>navigator).msGetUserMedia;
window.URL = (<any>window).URL || (<any>window).webkitURL;
(<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;

@Injectable()
export class AudioRecorder {
    // public static URL: any = (<any>window).URL || (<any>window).webkitURL;
    // public static getUserMedia: any =

    //是否支持
    public static support: boolean = !!navigator.getUserMedia;

    config: AudioConfig = new AudioConfig();
    context: AudioContext;
    audioSourceNode: MediaStreamAudioSourceNode;
    recorder: ScriptProcessorNode;

    size: number = 0;
    frameBuffer: any[] = []; //录音缓存

    constructor() {

    }


    inputSampleRate: number;  //输入采样率
    inputSampleBits: number;  //输入采样数位 8, 16
    outputSampleRate: number; //输出采样率
    outputSampleBits: number;  //输出采样数位 8, 16
    public requestAuthorization(callback: () => void) {

        let throwError = (info: string) => {
            console.error(info);
        };
        if (!AudioRecorder.support) {
            throwError("当前浏览器不支持");
            return;
        }

        navigator.getUserMedia(
            {audio: true} //只启用音频
            , (stream: any) => {
                //创建一个音频环境
                this.context = new AudioContext();
                this.audioSourceNode = this.context.createMediaStreamSource(stream);

                //音量节点
                let volume = this.context.createGain();
                this.audioSourceNode.connect(volume);

                //创建缓存, 用来缓存声音
                let bufferSize = 4096;

                // 创建声音的缓存节点，createScriptProcessor方法的
                // 第二个和第三个参数指的是输入和输出都是双声道。
                this.recorder = this.context.createScriptProcessor(bufferSize, 2, 2);

                this.recorder.onaudioprocess = ((e)=> {
                    this.input(e.inputBuffer.getChannelData(0));
                });
                this.inputSampleRate = this.context.sampleRate;
                this.inputSampleBits = 16;
                this.outputSampleRate = this.config.sampleRate;
                this.outputSampleBits = this.config.sampleBits;
                callback();
            }, (error: any) => {
                switch (error.code || error.name) {
                    case 'PERMISSION_DENIED':
                    case 'PermissionDeniedError':
                        throwError('用户拒绝提供信息。');
                        break;
                    case 'NOT_SUPPORTED_ERROR':
                    case 'NotSupportedError':
                        throwError('浏览器不支持硬件设备。');
                        break;
                    case 'MANDATORY_UNSATISFIED_ERROR':
                    case 'MandatoryUnsatisfiedError':
                        throwError('无法发现指定的硬件设备。');
                        break;
                    default:
                        throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                        break;
                }
            }
        );
    }

    private input(data: any) {
        this.frameBuffer.push(new Float32Array(data));
        this.size += data.length;
    }

    //合并压缩
    private compress() {
        //合并
        let data = new Float32Array(this.size);
        let offset = 0;
        for (let i = 0; i < this.frameBuffer.length; i++) {
            data.set(this.frameBuffer[i], offset);
            offset += this.frameBuffer[i].length;
        }
        //压缩
        // let compression = parseInt(this.inputSampleRate / this.outputSampleRate);
        let compression = Math.floor(this.inputSampleRate / this.outputSampleRate);
        let length = data.length / compression;
        let result = new Float32Array(length);
        let index = 0, j = 0;
        while (index < length) {
            result[index] = data[j];
            j += compression;
            index++;
        }
        return result;
    }
    //编码
    private encodeWAV(): Blob {
        let sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
        let sampleBits = Math.min(this.inputSampleBits, this.outputSampleBits);
        let bytes = this.compress();
        let dataLength = bytes.length * (sampleBits / 8);
        let buffer = new ArrayBuffer(44 + dataLength);
        let data = new DataView(buffer);

        let offset = 0;
        let writeString = (str: string) => {
            for (let i = 0; i < str.length; i++) {
                data.setUint8(offset + i, str.charCodeAt(i));
            }
            offset += str.length;
        };
        let writeUint32 =(value: number) => {
            data.setUint32(offset,value, true);
            offset += 4;
        }
        let writeUint16 = (value: number) => {
            data.setUint16(offset, value, true);
            offset += 2;
        }
        let writeInt8 = (value : number) => {
            data.setInt8(offset, value);
            offset += 1;
        }
        let writeInt16 = (value : number) => {
            data.setInt16(offset, value);
            offset += 2;
        }


        // 资源交换文件标识符
        writeString('RIFF');
        // 下个地址开始到文件尾总字节数
        writeUint32(36 + dataLength);
        // WAV文件标志
        writeString('WAVE');
        // 波形格式标志
        writeString('fmt ');
        // 过滤字节,一般为 0x10 = 16
        writeUint32(32);
        // 格式类别 (PCM形式采样数据)
        writeUint16(1);
        // 通道数
        writeUint16(this.config.channelCount);
        // 采样率,每秒样本数,表示每个通道的播放速度
        writeUint32(sampleRate);
        // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
        writeUint32(sampleRate * this.config.channelCount * (sampleBits / 8));
        // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
        writeUint16(sampleRate * this.config.channelCount * (sampleBits / 8));
        // 每样本数据位数
        writeUint16(sampleBits);
        // 数据标识符
        writeString('data');
        // 采样数据总数,即数据总大小-44
        writeUint32(dataLength);

        // 写入采样数据
        if (sampleBits === 8) {
            for (let i = 0; i < bytes.length; i++) {
                let s = Math.max(-1, Math.min(1, bytes[i]));
                let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                // val = parseInt(255 / (65535 / (val + 32768)));
                val = Math.floor(255 / (65535 / (val + 32768)));

                writeInt8(val);
            }
        } else {
            for (let i = 0; i < bytes.length; i++) {
                let s = Math.max(-1, Math.min(1, bytes[i]));
                writeInt16(s < 0 ? s * 0x8000 : s * 0x7FFF);
            }
        }

        return new Blob([data], { type: 'audio/wav' });
    }
    //开始录音
    public start() {
        this.audioSourceNode.connect(this.recorder);
        this.recorder.connect(this.context.destination);
    }

    //停止
    public stop() {
        this.recorder.disconnect();
    }

    public getBlob(): Blob {
        this.stop();
        return this.encodeWAV();
    }

    public play() {

        let audio = document.createElement('AUDIO');
        (<any>audio).src = window.URL.createObjectURL(this.getBlob());
        (<any>audio).play();
    }
}