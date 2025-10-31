/**
 * Type declarations for the mailersend npm package
 * This file provides TypeScript definitions for the mailersend module
 * which doesn't have official @types support
 */

declare module 'mailersend' {
  export class Recipient {
    constructor(email: string, name?: string);
    email: string;
    name?: string;
  }

  export class Sender {
    constructor(email: string, name?: string);
    email: string;
    name?: string;
  }

  export class EmailParams {
    constructor();
    setFrom(from: Sender | { email: string; name?: string }): this;
    setFromName(name: string): this;
    setRecipients(recipients: Recipient[]): this;
    setSubject(subject: string): this;
    setBcc(bcc: Recipient[]): this;
    setCc(cc: Recipient[]): this;
    setTemplateId(templateId: string): this;
    setPersonalization(personalization: EmailPersonalization[]): this;
    setHtml(html: string): this;
    setText(text: string): this;
    setReplyTo(replyTo: Recipient | { email: string; name?: string }): this;
    setAttachments(attachments: any[]): this;
  }

  export interface EmailPersonalization {
    email: string;
    data: Record<string, any>;
  }

  export interface EmailResponse {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  }

  export class MailerSend {
    constructor(config: { api_key?: string; apiKey?: string });
    email: {
      send(params: EmailParams): Promise<EmailResponse>;
    };
  }

  // Export all classes and interfaces
  export default MailerSend;
}
