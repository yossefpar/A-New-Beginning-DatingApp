import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './guards/auth.gruard';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers:'always',
    canActivate: [AuthGuard],
    children: [
     { path: 'members',
     loadChildren: () => import('./modules/members.module').then(m => m.MembersModule) },
     {path: 'lists', component: ListsComponent},
     {path: 'messages', component: MessagesComponent }
    ]
  },
  {
   path:'**',
   component: HomeComponent,
   pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
