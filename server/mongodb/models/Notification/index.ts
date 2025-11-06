import { Schema, model, models, Document, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  createdBy: Types.ObjectId;
  title: string;
  body: string;
  type: 'individual' | 'recurring';
  recipients: 'everyone' | Types.ObjectId[];
  scheduledFor: Date;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'annually' | 'custom';
    interval?: number; // For custom: repeat every X weeks/months
    daysOfWeek?: number[]; // For weekly: 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // For monthly: 1-31
    monthOfYear?: number; // For annually: 1-12
    endDate?: Date;
    endAfterOccurrences?: number;
  };
  sendInApp: boolean;
  sendEmail: boolean;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  sentAt?: Date;
  readBy: Types.ObjectId[];
  isBirthdayNotification: boolean;
  lastSentAt?: Date; // For recurring notifications
  nextScheduledFor?: Date; // For recurring notifications
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['individual', 'recurring'],
      required: true,
      default: 'individual',
    },
    recipients: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (value: any) {
          return value === 'everyone' || Array.isArray(value);
        },
        message: 'Recipients must be "everyone" or an array of user IDs',
      },
    },
    scheduledFor: {
      type: Date,
      required: true,
      index: true,
    },
    recurrence: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'annually', 'custom'],
      },
      interval: {
        type: Number,
        min: 1,
      },
      daysOfWeek: {
        type: [Number],
        validate: {
          validator: function (days: number[]) {
            return days.every((d) => d >= 0 && d <= 6);
          },
          message: 'Days of week must be between 0-6',
        },
      },
      dayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
      },
      monthOfYear: {
        type: Number,
        min: 1,
        max: 12,
      },
      endDate: {
        type: Date,
      },
      endAfterOccurrences: {
        type: Number,
        min: 1,
      },
    },
    sendInApp: {
      type: Boolean,
      default: true,
    },
    sendEmail: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    sentAt: {
      type: Date,
    },
    readBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isBirthdayNotification: {
      type: Boolean,
      default: false,
    },
    lastSentAt: {
      type: Date,
    },
    nextScheduledFor: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
NotificationSchema.index({ organizationId: 1, status: 1 });
NotificationSchema.index({ organizationId: 1, scheduledFor: 1 });
NotificationSchema.index({ status: 1, scheduledFor: 1 }); // For cron job
NotificationSchema.index({ status: 1, nextScheduledFor: 1 }); // For recurring notifications

const Notification = models.Notification || model<INotification>('Notification', NotificationSchema);

export default Notification;
