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
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
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
    this.loadMember();
    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false,
    }];

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

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username') as string;
    this.membersService.getMember(username).subscribe(member=> {
      this.member = member;
      this.galleryImages = this.getImages();
    });
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
