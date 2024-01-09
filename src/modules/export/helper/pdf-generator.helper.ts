import { pipe, gotenberg, convert, html, please } from 'gotenberg-js-client';
import { config } from 'convict-config';
import { isDev } from 'common/index';

const gotenbergUrl = (!isDev) ? config.get('gotenbergUrl') : config.get('gotenbergUrl');
const toPDF = pipe(
  gotenberg(`${gotenbergUrl}/forms/chromium`),
  convert,
  html,
  please
);

export const pdf = {
    generate: async (content: string): Promise<NodeJS.ReadableStream> => {
        return await toPDF(content);
    },

    // eslint-disable-next-line no-unused-vars
    export: async (response: any, content: string): Promise<any> => {
        const result = await pdf.generate(content);

        // response.attachment(filename + '.pdf');

        return result.pipe(response);
    },

    setAttachment: async (content: string): Promise<string> => {
        const result = await pdf.generate(content);
        return await streamToString(result);
    },
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("base64");
}
