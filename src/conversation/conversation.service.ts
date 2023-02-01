import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CONVERSATION_SCHEMA, ConversationDocument } from './entities/conversation.entity';
import mongoose, { Model } from 'mongoose';
import { CONVERSATION_MEMBER_SCHEMA, ConversationMemberDocument } from './entities/conversation.member';
import { CONVERSATION_SETTING_SCHEMA, ConversationSettingDocument } from './entities/conversation.setting.entity';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { BOOLEAN, CONVERSATION_PERMISSION, CONVERSATION_TYPE } from '../enum';
import { isEmpty } from 'lodash';
import { BaseResponse } from '../response';
import { ChangeSettingDto } from './dto/change-setting.dto';
import { ConversationSettingResponse } from '../response/convsersation-setting.response';
import { ConversationDetailResponse } from '../response/conversation-detail.response';
import { AddMemberDto } from './entities/addmember.dto';
import { ConversationResponse } from '../response/conversation.response';
import { ChangeConversationDto } from './dto/change-conversation.dto';
import { ChangeAdminDto } from './dto/change-admin.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(CONVERSATION_SCHEMA) private conversationDocument: Model<ConversationDocument>,
    @InjectModel(CONVERSATION_MEMBER_SCHEMA) private conversationMemberDocument: Model<ConversationMemberDocument>,
    @InjectModel(CONVERSATION_SETTING_SCHEMA) private conversationSettingDocument: Model<ConversationSettingDocument>,
  ) {}

  async createConversation(user_id: string, createConversationDto: CreateConversationDto) {
    try {
      const { members } = createConversationDto;

      if (isEmpty(members)) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Members is required');

      const conversation = await this.conversationDocument.findOne({
        members: { $eq: [user_id, ...members] },
        deleted: BOOLEAN.FALSE,
      });

      if (conversation) {
        return new BaseResponse({ data: { conversation_id: conversation._id } });
      }
      const conversationType = members.length > 1 ? CONVERSATION_TYPE.GROUP : CONVERSATION_TYPE.PRIVATE;

      const newConversation = new this.conversationDocument({
        ...createConversationDto,
        members: [user_id, ...members],
        type: conversationType,
      });

      await newConversation.save();

      await new this.conversationSettingDocument({
        conversation_id: newConversation._id,
      }).save();

      await Promise.all(
        [user_id, ...members].map(async (member) => {
          const newConversationMember = new this.conversationMemberDocument({
            conversation_id: newConversation._id,
            user_id: member,
            is_admin: member === user_id ? BOOLEAN.TRUE : BOOLEAN.FALSE,
            ...(member === user_id && { permission: CONVERSATION_PERMISSION.ADMIN }),
          });
          await newConversationMember.save();
        }),
      );

      return new BaseResponse({ data: { conversation_id: newConversation._id } });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async changeSetting(user_id: string, changeSettingDto: ChangeSettingDto) {
    try {
      const { conversation_id, ...rest } = changeSettingDto;
      const conversation = await this.conversationDocument.findById(conversation_id);

      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const conversationMember = await this.conversationMemberDocument.findOne({ conversation_id, user_id: user_id });

      if (!conversationMember) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation member not found');

      if (conversationMember.is_admin === BOOLEAN.FALSE && conversationMember.permission === BOOLEAN.FALSE) {
        throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'You are not permission');
      }

      await this.conversationSettingDocument.findOneAndUpdate({ conversation_id }, { $set: rest }, { new: true });

      return new BaseResponse({
        message: 'Change setting success!',
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async getSetting(user_id: string, conversation_id: string) {
    try {
      const conversation = await this.conversationDocument.findOne({
        _id: conversation_id,
        members: { $all: [user_id] },
      });

      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const [conversationSetting, conversationMember] = await Promise.all([
        await this.conversationSettingDocument.findOne({ conversation_id }),
        await this.conversationMemberDocument.findOne({ conversation_id, user_id }),
      ]);

      return new BaseResponse({
        data: {
          ...new ConversationSettingResponse(conversationSetting),
          permission: conversationMember.permission,
        },
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async getDetailConversation(user_id: string, conversation_id: string) {
    try {
      const conversation = await this.conversationDocument.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(conversation_id) } },
        {
          $lookup: {
            from: 'conversation_members',
            localField: '_id',
            foreignField: 'conversation_id',
            as: 'members',
            pipeline: [{ $match: { user_id: new mongoose.Types.ObjectId(user_id) } }],
          },
        },
        {
          $lookup: { from: 'conversation_settings', localField: '_id', foreignField: 'conversation_id', as: 'setting' },
        },
        {
          $addFields: {
            setting: { $arrayElemAt: ['$setting', 0] },
            member: { $arrayElemAt: ['$members', 0] },
            permission: { $arrayElemAt: ['$members.permission', 0] },
          },
        },
      ]);
      if (!conversation[0]) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      return new BaseResponse({
        data: new ConversationDetailResponse(conversation[0]),
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async addMember(user_id: string, addMemberDto: AddMemberDto) {
    try {
      const { conversation_id, members } = addMemberDto;

      const conversation = await this.conversationDocument.findOne({
        _id: conversation_id,
        type: CONVERSATION_TYPE.GROUP,
      });

      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const exitMembers = await this.conversationMemberDocument.find({ conversation_id, user_id: { $in: members } });
      if (!isEmpty(exitMembers)) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Members already exists');
      }

      const conversationMember = await this.conversationMemberDocument.findOne({ conversation_id, user_id });

      if (!conversationMember)
        throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'You are not member of this conversation');

      if (conversationMember.is_admin === BOOLEAN.FALSE && conversationMember.permission === BOOLEAN.FALSE) {
        throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'You are not permission');
      }

      await this.conversationDocument.findByIdAndUpdate(conversation_id, {
        members: [...conversation.members, ...members],
      });

      await Promise.all(
        members.map(async (member) => {
          const newConversationMember = new this.conversationMemberDocument({
            conversation_id,
            user_id: member,
            is_admin: BOOLEAN.FALSE,
            permission: BOOLEAN.FALSE,
          });
          await newConversationMember.save();
        }),
      );
      return new BaseResponse({ message: 'Add member success!' });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async removeMember(user_id: string, addMemberDto: AddMemberDto) {
    try {
      const { conversation_id, members } = addMemberDto;
      const conversation = await this.conversationDocument.findOne({
        _id: conversation_id,
        type: CONVERSATION_TYPE.GROUP,
      });
      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const existsMember = await this.conversationMemberDocument.find({ conversation_id, user_id: { $in: members } });

      if (existsMember.length !== members.length) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Members not exists');
      }

      const conversationMember = await this.conversationMemberDocument.findOne({ conversation_id, user_id });
      if (!conversationMember)
        throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'You are not member of this conversation');

      if (conversationMember.is_admin === BOOLEAN.FALSE && conversationMember.permission === BOOLEAN.FALSE) {
        throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'You are not permission');
      }

      await this.conversationDocument.findByIdAndUpdate(conversation_id, {
        members: conversation.members.filter((member) => !members.includes(member.toString())),
      });

      await Promise.all(
        members.map((member) => this.conversationMemberDocument.findOneAndDelete({ conversation_id, user_id: member })),
      );
      return new BaseResponse({ message: 'Remove member success!' });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async getConversations(user_id: string) {
    try {
      const conversation = await this.conversationDocument
        .aggregate([
          {
            $lookup: {
              from: 'conversation_members',
              localField: '_id',
              foreignField: 'conversation_id',
              as: 'members',
              pipeline: [{ $match: { user_id: new mongoose.Types.ObjectId(user_id) } }],
            },
          },
          {
            $addFields: {
              permission: { $arrayElemAt: ['$members.permission', 0] },
              is_pinned: { $arrayElemAt: ['$members.is_pinned', 0] },
              last_removed_message: { $arrayElemAt: ['$members.last_removed_message', 0] },
            },
          },
          {
            $match: {
              $expr: {
                $ne: ['$last_message', '$last_removed_message'],
              },
              deleted: BOOLEAN.FALSE,
            },
          },
        ])
        .sort({
          is_pinned: -1,
          last_message_at: -1,
        });
      return new BaseResponse({
        data: ConversationResponse.mapList(conversation),
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async leaveConversation(user_id: string, conversation_id: string) {
    try {
      const conversation = await this.conversationDocument.findOne({
        _id: conversation_id,
        type: CONVERSATION_TYPE.GROUP,
      });
      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const conversationMember = await this.conversationMemberDocument.findOne({ conversation_id, user_id });
      if (!conversationMember)
        throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'You are not member of this conversation');

      if (conversationMember.is_admin === BOOLEAN.TRUE) {
        throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'You are admin of this conversation');
      }

      await this.conversationDocument.findByIdAndUpdate(conversation_id, {
        members: conversation.members.filter((member) => member.toString() !== user_id),
      });

      await this.conversationMemberDocument.findByIdAndDelete(conversationMember._id);

      return new BaseResponse({ message: 'Leave conversation success!' });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async deleteConversation(user_id: string, conversation_id: string) {
    try {
      const conversation = await this.conversationDocument.findOne({
        _id: conversation_id,
      });
      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const conversationMember = await this.conversationMemberDocument.findOne({ conversation_id, user_id });

      if (!conversationMember) {
        throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'You are not member of this conversation');
      }

      conversationMember.last_removed_message = conversation.last_message;

      await conversationMember.save();

      return new BaseResponse({ message: 'Delete conversation success!' });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async changeConversationProfile(user_id: string, changeConversationDto: ChangeConversationDto) {
    try {
      const { conversation_id, ...rest } = changeConversationDto;
      const conversation = await this.conversationDocument.findOne({
        _id: conversation_id,
        type: CONVERSATION_TYPE.GROUP,
      });

      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const conversationMember = await this.conversationMemberDocument.findOne({ conversation_id, user_id });

      if (!conversationMember) {
        throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'You are not member of this conversation');
      }

      if (conversationMember.is_admin === BOOLEAN.FALSE && conversationMember.permission === BOOLEAN.FALSE) {
        throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'You are not permission');
      }

      await this.conversationDocument.findByIdAndUpdate(conversation_id, { ...rest });

      return new BaseResponse({ message: 'Change conversation profile success!' });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async changeAdmin(user_id: string, changeAdminDto: ChangeAdminDto) {
    try {
      const conversation = await this.conversationDocument.findOne({
        _id: changeAdminDto.conversation_id,
        type: CONVERSATION_TYPE.GROUP,
      });

      if (!conversation) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Conversation not found');

      const newAdmin = await this.conversationMemberDocument.findOne({
        conversation_id: changeAdminDto.conversation_id,
        user_id: changeAdminDto.user_id,
      });

      if (!newAdmin) {
        throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'User are not member of this conversation');
      }

      const conversationMember = await this.conversationMemberDocument.findOne({
        conversation_id: changeAdminDto.conversation_id,
        user_id,
      });

      if (!conversationMember) {
        throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'You are not member of this conversation');
      }

      if (conversationMember.is_admin === BOOLEAN.FALSE && conversationMember.permission === BOOLEAN.FALSE) {
        throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'You are not permission');
      }

      await Promise.all([
        this.conversationMemberDocument.findByIdAndUpdate(conversationMember._id, {
          is_admin: BOOLEAN.FALSE,
          permission: CONVERSATION_PERMISSION.MEMBER,
        }),
        this.conversationMemberDocument.findByIdAndUpdate(newAdmin._id, {
          is_admin: BOOLEAN.TRUE,
          permission: CONVERSATION_PERMISSION.ADMIN,
        }),
      ]);
    } catch (e) {}
  }
}
