import { MemberCardComponent } from './../members/member-card/member-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MemberListComponent } from '../members/member-list/member-list.component';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';
import { SharedModule } from './shared.module';
import { MemberMessagesComponent } from '../members/member-messages/member-messages.component';
import { MemberDetailedResolver } from '../resolvers/member-detailed-resolver';

const routes: Routes = [
  {path:'',component: MemberListComponent, pathMatch:'full'},
  {path:':username',component: MemberDetailComponent,
    resolve: { member: MemberDetailedResolver,}
  },
];

@NgModule({
  declarations: [
    MemberListComponent,
    MemberDetailComponent,
    MemberMessagesComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule,
    MemberListComponent,
  ]
})
export class MembersModule { }
