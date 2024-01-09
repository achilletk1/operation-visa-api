import { NotificationsType, NotificationFormat, QueuePriority } from 'modules/notifications/enum';
import { replaceMailVariables } from 'modules/notifications/helper';
import { MailNotificationInterface } from 'common/interfaces';
import { MailAttachment } from 'modules/notifications/model';
import { generateFormalNoticeLetter } from 'modules/export';
import { TemplatesController } from 'modules/templates';
import { QueueData, TemplateData } from 'common/types';
import { LettersController } from 'modules/letters';
import { isDevOrStag } from 'common/helpers';
import { QueueService } from './base-queue';
import { config } from 'convict-config';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { get } from 'lodash';
import path from 'path';

export class BaseMailNotification<T> extends QueueService implements MailNotificationInterface {

  key!: string;

  type!: string;

  subject!: string;

  hasAttachement: boolean = false;

  protected templateData!: TemplateData;

  protected appName = config.get('appName') || config.get('template.app');

  protected company = config.get('clientName') || config.get('template.company');

  protected formalNoticeLetterAttachmentBody!: string;

  constructor(
    protected templateName: string,
    protected eventData: T,
    protected priority: QueuePriority,
    protected delayUntil?: Date | number,
    public keyNotification?: string,
    public lang: 'fr' | 'en' = 'fr',
    public saveNotification = false,
  ) {
    super();
    this.templateData = {
      ...this.eventData,
      civility: String(get(this.eventData, 'civility', 'Mr/Mme')),
      actionUrl: config.get('baseUrl') + '/home',
      image: config.get('template.image'),
      color: config.get('template.color'),
      app: this.appName,
      company: this.company,
    };
    this.logger.info(`send mail ${this.keyNotification || this.templateName} to ${get(this.eventData, 'receiver', null)} ${get(this.eventData, 'cc', '')}`);
  }

  private loadTemplate(filename: string): string {
    return readFileSync(path.join(__dirname, 'templates', filename + '.template.html'), { encoding: 'utf8', flag: 'r' });
  }

  private getNotificationBody(): string {
    const template = handlebars.compile(this.loadTemplate(this.templateName));
    return template(this.templateData);
  }

  private async getSendersNotificationBody(): Promise<string> {
    try {
      let visaTemplate: any
      try { visaTemplate = await TemplatesController.templatesService.findOne({ filter: { key: this.keyNotification } }); } catch (e) { }

      // send notice letters 
      if (this.keyNotification === 'letters') visaTemplate = this.getFormalNoticeLetterVisaTemplateMail();
      if (!visaTemplate) { throw new Error(`Template ${this.keyNotification} Not Found`); }

      this.templateData = replaceMailVariables(visaTemplate[this.lang], this.eventData, this.lang, visaTemplate?.signature);
      this.subject = (!!this.templateData.obj) ? (this.templateData.obj as string) : this.subject;

      return this.getNotificationBody();
    } catch (error: any) {
      this.logger.error(`Error during mail ${this.keyNotification || this.templateName} notification generation to ${get(this.eventData, 'receiver', '')} ${get(this.eventData, 'cc', '')} \n${error.stack}`);
      return '';
    }
  }

  private async getFormalNoticeLetterVisaTemplateMail() {
    const visaTemplate = await LettersController.lettersService.findOne({});
    this.formalNoticeLetterAttachmentBody = replaceMailVariables(visaTemplate.pdf[this.lang], this.eventData, this.lang, visaTemplate?.pdf?.signature);
    return visaTemplate.emailText;
  }

  async sendNotification() {
    // if (isDevOrStag) { return null; }

    const body = (this.keyNotification) ? await this.getSendersNotificationBody() : this.getNotificationBody();
    if (this.keyNotification === 'letters') { (this.eventData as any).attachments = await generateFormalNoticeLetter(this.formalNoticeLetterAttachmentBody, true); }
    const queueData: QueueData = {
      subject: this.subject,
      receiver: !isDevOrStag ? String(get(this.eventData, 'receiver', '')) : config.get('emailTest'),
      body,
      cc: !isDevOrStag ? String(get(this.eventData, 'cc', '')) : '',
      attachments: get(this.eventData, 'attachments', []) as MailAttachment[],
      date: new Date(),
    };
    if (!queueData.body || !queueData.receiver) { return null; }

    try {
      if (this.keyNotification || this.saveNotification) await this.insertNotification(this.subject, NotificationFormat.MAIL, queueData.body, ''.concat(queueData?.receiver, queueData?.cc || ''), (this.eventData as any)?.id, queueData.attachments, this.key, this.type);
      await this.add(NotificationsType.MAIL, queueData, this.priority, this.delayUntil);
    } catch (error: any) { this.logger.error(`Error during insertion mail ${this.keyNotification || this.templateName} notification to ${get(this.eventData, 'receiver', '')} ${get(this.eventData, 'cc', '')} in queue \n${error.stack}`); }
  }

}
