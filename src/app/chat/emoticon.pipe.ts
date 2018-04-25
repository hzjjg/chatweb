
import {Pipe, PipeTransform} from "@angular/core";
import {MessageUtils} from "./message-utils";

@Pipe({
    name: "emoticon",
    pure: true
})
export class EmoticonPipe implements PipeTransform{
    transform(value: string, ...args: any[]): string {
        return value ? value.replace(/\[([^\]]+)\]/g, (_, text) => {
            return MessageUtils.getEmoticonByText(text) || ('[' + text + ']');
        }) : '';

    }
}