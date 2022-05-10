import { MessageService } from './../../Services/Message.service';
import { Message } from './../../models/message';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { MembersService } from './../../Services/members.service';
import { Member } from 'src/app/models/member';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  messages: Message[] = [];
  member: Member;
  galleryOptions: NgxGalleryOptions[]
  galleryImages: NgxGalleryImage[]
  activeTab: TabDirective;

  constructor(
    private membersService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    });
    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });
    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false,
    }];

    this.galleryImages = this.getImages();

  }

  getImages(): NgxGalleryImage[] {
    const imagsUrls = [];
    for (const photo of this.member.photos) {
        imagsUrls.push({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url
        });
    }
    return imagsUrls;
  }

  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username') as string;
  //   this.membersService.getMember(username).subscribe(member=> {
  //     this.member = member;
  //     this.galleryImages = this.getImages();
  //   });
  // }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages()
    }
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(message => {
      this.messages =message;
    })
  }

}
