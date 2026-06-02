import { Injectable } from '@nestjs/common';
import { GroupsTypeormAdapter } from '../../infrastructure/groups/adapters/groups-typeorm.adapter';
import { CreateGroupEncouragementUsecase } from '../../usecases/groups/create-group-encouragement.usecase';
import { CreateGroupUsecase } from '../../usecases/groups/create-group.usecase';
import { DeleteGroupUsecase } from '../../usecases/groups/delete-group.usecase';
import { GetGroupByIdUsecase } from '../../usecases/groups/get-group-by-id.usecase';
import { GetGroupEncouragementsUsecase } from '../../usecases/groups/get-group-encouragements.usecase';
import { GetGroupMembersUsecase } from '../../usecases/groups/get-group-members.usecase';
import { GetGroupProgressUsecase } from '../../usecases/groups/get-group-progress.usecase';
import { GetMyGroupsUsecase } from '../../usecases/groups/get-my-groups.usecase';
import { JoinGroupUsecase } from '../../usecases/groups/join-group.usecase';
import { RemoveGroupMemberUsecase } from '../../usecases/groups/remove-group-member.usecase';
import { UpdateGroupUsecase } from '../../usecases/groups/update-group.usecase';

@Injectable()
export class GroupsUsecasesProxyService {
  constructor(private readonly groups: GroupsTypeormAdapter) {}

  create(userId: string, data: any) {
    return new CreateGroupUsecase(this.groups).execute(userId, data);
  }
  my(userId: string) {
    return new GetMyGroupsUsecase(this.groups).execute(userId);
  }
  get(userId: string, id: string) {
    return new GetGroupByIdUsecase(this.groups).execute(userId, id);
  }
  update(userId: string, id: string, data: any) {
    return new UpdateGroupUsecase(this.groups).execute(userId, id, data);
  }
  delete(userId: string, id: string) {
    return new DeleteGroupUsecase(this.groups).execute(userId, id);
  }
  join(userId: string, inviteCode: string) {
    return new JoinGroupUsecase(this.groups).execute(userId, inviteCode);
  }
  members(userId: string, groupId: string) {
    return new GetGroupMembersUsecase(this.groups).execute(userId, groupId);
  }
  removeMember(userId: string, groupId: string, memberId: string) {
    return new RemoveGroupMemberUsecase(this.groups).execute(
      userId,
      groupId,
      memberId,
    );
  }
  progress(userId: string, groupId: string) {
    return new GetGroupProgressUsecase(this.groups).execute(userId, groupId);
  }
  encourage(userId: string, groupId: string, data: any) {
    return new CreateGroupEncouragementUsecase(this.groups).execute(
      userId,
      groupId,
      data,
    );
  }
  encouragements(userId: string, groupId: string) {
    return new GetGroupEncouragementsUsecase(this.groups).execute(
      userId,
      groupId,
    );
  }
}
