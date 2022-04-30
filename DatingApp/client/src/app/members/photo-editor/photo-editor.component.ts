import { MembersService } from 'src/app/Services/members.service';
import { Photo } from './../../models/photo';
import { take } from 'rxjs/operators';
import { AccountService } from './../../Services/account.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: Member;

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  baseUrl = environment.apiUrl;
  user: User;
  constructor(
    private accountService: AccountService,
    private memberService: MembersService
    ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user = user);
   }

  ngOnInit(): void {
    this.initializeUploader();
  }
  setMainPhoto(photo: Photo) {
      this.memberService.setMainPhoto(photo.id).subscribe(()=> {
      this.user.photoUrl = photo.url;
      this.accountService.setCurentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
      if(p.isMain) p.isMain = false;
      if(p.id === photo.id) p.isMain = true;
    })
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(()=>{
    this.member.photos = this.member.photos.filter(p=>p.id !== photoId);
    });
  }
  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item , res , status , headers) => {
      if(res) {
        const photo = JSON.parse(res);
        this.member.photos.push(photo);
      }
    };
  }

  fileOverBase(e: any):void{
    this.hasBaseDropZoneOver = e;
  }
}
