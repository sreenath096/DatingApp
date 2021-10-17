import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member!: Member;

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const routeParameter = this.route.snapshot.paramMap.get('username');
    const username = routeParameter ? routeParameter : " ";
    this.memberService.getMember(username).subscribe(member => {
      this.member = member;
      // this.galleryImages = this.getImages();
    })
  }

}
