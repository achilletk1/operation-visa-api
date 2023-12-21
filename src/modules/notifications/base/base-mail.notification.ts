import { NotificationsType, NotificationFormat, QueuePriority } from 'modules/notifications/enum';
import { replaceMailVariables } from 'modules/notifications/helper';
import { MailNotificationInterface } from 'common/interfaces';
import { MailAttachment } from 'modules/notifications/model';
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

  constructor(
    protected templateName: string,
    protected eventData: T,
    protected priority: QueuePriority,
    protected delayUntil?: Date | number,
    public keyNotification?: string,
    public lang: 'fr' | 'en' = 'fr',
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
    this.logger.info(`send mail ${this.keyNotification || this.templateName} to ${get(this.eventData, 'receiver', null)}`);
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
      let visaTemplate: any = await TemplatesController.templatesService.findOne({ filter: { key: this.keyNotification } });

      // send notice letters 
      if (this.keyNotification === 'letters') visaTemplate = (await LettersController.lettersService.findOne({})).pdf;
      if (!visaTemplate) { throw `Template ${this.keyNotification} Not Found`; }

      this.templateData = replaceMailVariables(visaTemplate[this.lang], this.eventData, this.lang, visaTemplate?.signature);
      this.subject = (!!this.templateData.obj) ? (this.templateData.obj as string) : this.subject;

      return this.getNotificationBody();
    } catch (error: any) {
      this.logger.error(`Error during mail ${this.templateName} notification generation \n${error.stack}`);
      return '';
    }
  }

  async sendNotification() {
    if (isDevOrStag) { return null; }

    const queueData: QueueData = {
      subject: this.subject,
      receiver: !isDevOrStag ? String(get(this.eventData, 'receiver', '')) : config.get('emailTest'),
      body: (this.keyNotification) ? await this.getSendersNotificationBody() : this.getNotificationBody(),
      cc: !isDevOrStag ? String(get(this.eventData, 'cc', '')) : '',
      attachments: get(this.eventData, 'attachments', []) as MailAttachment[],
      date: new Date(),
    };
    if (!queueData.body || !queueData.receiver) { return null; }

    try {
      if (this.keyNotification) return await this.insertNotification(this.subject, NotificationFormat.MAIL, queueData.body, queueData.receiver, (this.eventData as any)?.id, queueData.attachments, (this.eventData as any)?.key, (this.eventData as any)?.type);
      return await this.add(NotificationsType.MAIL, queueData, this.priority, this.delayUntil);
    } catch (error: any) { this.logger.error(`Error during insertion mail ${this.templateName} notification in queue \n${error.stack}`); }
  }

}
