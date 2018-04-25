import { Pipe, PipeTransform } from '@angular/core';
import { UserInfo } from "../user/user-info";
import { UserType } from "../user/index";

@Pipe({
    name: 'membersPipe'
})

export class MemberCountPipe implements PipeTransform {
    transform(members: UserInfo[], userType: UserType): any {
        if (members) {
            return members.reduce((value, current) => {
                if (current.userType == userType) {
                    value += 1;
                }
                return value
            }, 0)
        }
    }
}