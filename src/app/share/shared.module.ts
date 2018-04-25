import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule} from "@angular/forms";
import { UIModule } from "../rui";
import { IMTimePipe } from "./im-time.pipe";
import { NgUploaderModule } from "ngx-uploader";
import { OrderModule } from "ngx-order-pipe";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // ReactiveFormsModule, //https://segmentfault.com/a/1190000009053752
        UIModule.forRoot(),
        NgUploaderModule,
        OrderModule
    ],
    exports: [
        CommonModule,
        NgUploaderModule,
        // ReactiveFormsModule,
        FormsModule,
        UIModule,
        IMTimePipe,
        OrderModule
    ],
    declarations: [
        IMTimePipe,
    ],
    providers: [
        IMTimePipe,
    ]
})
export class SharedModule { }