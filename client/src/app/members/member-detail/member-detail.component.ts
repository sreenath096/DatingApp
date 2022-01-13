import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member!: Member;
  @ViewChild('memberTabs', { static: false }) input!: TabsetComponent;
  activeTab!: TabDirective;
  messages: Message[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit(): void {
    //this.loadMember();
    this.route.data.subscribe(data => {
      this.member = data.member;
    });

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });
  }

  // loadMember() {
  //   const routeParameter = this.route.snapshot.paramMap.get('username');
  //   const username = routeParameter ? routeParameter : " ";
  //   this.memberService.getMember(username).subscribe(member => {
  //     this.member = member;
  //     // this.galleryImages = this.getImages();
  //   })
  // }


  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages.length === 0) {
      this.loadMessages();
    }
  }

  selectTab(tabId: number) {
    if (this.input !== undefined) {
      this.input.tabs[tabId].active = true;
    }
    //this.memberTabs.tabs[tabId].active = true;
  }


}
