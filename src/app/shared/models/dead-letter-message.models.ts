export interface DeadLetterMessage {
  messageId: string;
  body: string;
  deadLetterReason: string;
  deadLetterErrorDescription: string;
  deliveryCount: number;
  enqueuedTime: string;
}
