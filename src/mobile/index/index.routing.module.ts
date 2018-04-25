import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index.component';
import { ChatComponent } from '../../app/chat/chat.component';
import { ContactListComponent } from '../../app/contact/contact-list.component';
import { DiscoverComponent } from '../discover/discover.component';
import { MineComponent } from '../mine/mine.component';
import { GroupChatComponent } from '../../app/chat/group-chat.component';

const indexRoutes: Routes = [
    {
        path: '',
        component: IndexComponent,
        children: [
            // {
            //     path:'',
            //     redirectTo:'/chat',
            //     pathMatch:'full'
            // },
            {
                path: 'chat',
                component: GroupChatComponent,
                // outlet: 'chat'
            },
            // {
            //     path: 'chat',
            //     component: ChatComponent,
            //     outlet: 'chat'
            // },
            {
                path: 'contact',
                component: ContactListComponent
            },
            {
                path: 'discover',
                component: DiscoverComponent
            },
            {
                path: 'mine',
                component: MineComponent
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(indexRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class IndexRoutingModule { }