import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { MembersService } from './../../Services/members.service';
import { Member } from 'src/app/models/member';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  galleryOptions: NgxGalleryOptions[]
  galleryImages: NgxGalleryImage[]
  constructor(
    private membersService: MembersService, private route: ActivatedRoute
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

  getImage() {
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
      this.galleryImages = this.getImage();
    });
  }

}
