import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GroupsApiService } from '../Services/GroupsApiService';
import { CacheService } from '../Services/CacheService';
import { filter, map, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Values } from '../values';
import { GroupConversation } from '../Models/GroupConversation';
import { ConversationApiService } from '../Services/ConversationApiService';
import { HeaderService } from '../Services/HeaderService';
import { MessageService } from '../Services/MessageService';

@Component({
    templateUrl: '../Views/group.html',
    styleUrls: ['../Styles/menu.scss',
                '../Styles/button.scss',
                '../Styles/toggleButton.scss',
                '../Styles/badge.scss']
})

export class GroupComponent implements OnInit {
    public conversation: GroupConversation;
    public groupMembers: number;
    public loadingImgURL = Values.loadingImgURL;
    public muted: boolean;
    public muting = false;

    constructor(
        private route: ActivatedRoute,
        private groupsApiService: GroupsApiService,
        private conversationApiService: ConversationApiService,
        private router: Router,
        private cache: CacheService,
        private headerService: HeaderService,
        public messageService: MessageService) {
        this.headerService.title = 'Group Info';
        this.headerService.returnButton = true;
        this.headerService.button = false;
        this.headerService.shadow = false;
        this.headerService.timer = false;
    }

    public ngOnInit(): void {
        this.route.params
            .pipe(
                switchMap((params: Params) => this.conversationApiService.ConversationDetail(+params['id'])),
                filter(t => t.code === 0),
                map(t => t.value)
            )
            .subscribe(conversation => {
                this.messageService.conversation = conversation;
                this.conversation = <GroupConversation>conversation;
                this.groupMembers = conversation.users.length;
                this.conversation.avatarURL = Values.fileAddress + (<GroupConversation>this.conversation).groupImageKey;
                this.conversation.users.forEach(user => {
                    user.user.avatarURL = Values.fileAddress + user.user.headImgFileKey;
                    try {
                        if (user.userId === this.messageService.me.id) {
                            this.muted = user.muted;
                        }
                    } catch (error) {
                        setTimeout(() => {
                            if (user.userId === this.messageService.me.id) {
                                this.muted = user.muted;
                            }
                        }, 1000);
                    }
                });
            });
    }

    public leaveGroup(groupName: string): void {
        let alertTitle = '';
        if (this.groupMembers === 1) {
            alertTitle = 'This group will be deleted, are you sure?';
        } else {
            alertTitle = 'Are you sure to leave this group?';
        }
        Swal.fire({
            title: alertTitle,
            type: 'warning',
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                this.groupsApiService.LeaveGroup(groupName)
                    .subscribe(response => {
                        if (response.code === 0) {
                            Swal.fire('Success', response.message, 'success');
                            this.cache.updateConversation();
                            this.cache.updateFriends();
                            this.router.navigate(['/friends']);
                        } else {
                            Swal.fire('Error', response.message, 'error');
                        }
                    });
            }
        });
    }

    public mute(): void {
        if (!this.muting) {
            this.muting = true;
            this.groupsApiService.MuteGroup(this.conversation.displayName, !this.muted).subscribe(
                result => {
                    this.muting = false;
                    if (result.code === 0) {
                        this.muted = !this.muted;
                    } else {
                        Swal.fire('Error', result.message, 'error');
                    }
                }
            );
        }
    }
}
