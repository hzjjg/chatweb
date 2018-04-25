
import {EMOTICON_LIST, EMOTICON_MAP} from "../system/emoticon";
export class MessageUtils {
    private static EMOTICON_REGEXP = /\[(\s+)\]/g;
    //new RegExp("\[em", 'g');

    // return (text || '').replace(MessageUtils.EMOTICON_REGEXP, (_, text) => {
    // })
    public static genEmoticonHTML(text: string): string {
        let textId = EMOTICON_MAP[text];
        return `<img class="emoji" text="${text}" src="/images/emoticons/${textId}@2x.gif" style="width:26px;">`;
    }

    public static getEmoticonByText(text: string): string {
        if (~EMOTICON_LIST.indexOf(text)) {
            return MessageUtils.genEmoticonHTML(text);
        }
        return null;
        // exports.EMOTICON.indexOf
        // var t;
        // if (text.indexOf("<") > -1) {
        //     if (t = this.QQFaceMap[e]) return n.genEmoticonHTML("emoji emoji" + t, this.EmojiCodeMap[t])
        // } else if (
        //     t = this.QQFaceMap[e.replace(/\[|\]/g, "")]) return n.genEmoticonHTML("qqemoji qqemoji" + t, e);
        // return null
    }


}