import { PageManager } from "../app/system/page-manage";
import { Router } from "@angular/router";

import { Injectable } from '@angular/core';

@Injectable()
export class MobilePageManager extends PageManager {

    constructor(
        private router: Router
    ) {
        super();
    }

    goConversionApply() {
        this.router.navigate(['/conversion-money-apply'])
    }

    goConversionHistory() {
        this.router.navigate(['/conversion-money-work'])
    }

    goLogin() {
        this.router.navigate(['/login'])
    }

    goRegister() {
        this.router.navigate(['/register'])
    }

    goChat(userId: any) {
        this.router.navigate(['/c2c-chat', userId])
    }
}