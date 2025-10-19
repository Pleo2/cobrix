export interface ScheduledMessage {
    id: string;
    messageType: "recordatorio" | "marketing-hooking";
    dayOffset: number; // -10 to +10, where 0 is the due date
    content: string;
}

export interface MessageScheduleConfig {
    templateId: string;
    scheduledMessages: ScheduledMessage[];
}
