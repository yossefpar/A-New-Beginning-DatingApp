import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MemberListComponent } from '../members/member-list/member-list.component';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';

const routes: Routes = [
  {path:'',component: MemberListComponent, pathMatch:'full'},
  {path:':id',component: MemberDetailComponent},
];

@NgModule({
  declarations: [
    MemberListComponent,
    MemberDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule,
    MemberListComponent,
    MemberDetailComponent,
  ]
})
export class MembersModule { }
