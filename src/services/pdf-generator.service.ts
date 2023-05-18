import { pipe, gotenberg, convert, html, please } from 'gotenberg-js-client';
import { config } from '../config';

const gotenbergUrl = (config.get('env') !== 'development')
                        ? config.get('gotenbergUrl')
                        : 'http://localhost:7900';
const toPDF = pipe(
  gotenberg(`${gotenbergUrl}/forms/chromium`),
  convert,
  html,
  please
);

export const pdf = {
    generate: async (content: any): Promise<any> => {
        return await toPDF(content);
    },

    // eslint-disable-next-line no-unused-vars
    export: async (response: any, content: any, filename: string = null): Promise<any> => {
        const result = await pdf.generate(content);

        // response.attachment(filename + '.pdf');

        return result.pipe(response);
    },

    setAttachment: async (content: any): Promise<any> => {
        const result = await pdf.generate(content);
        return await streamToString(result);
    },
}

async function streamToString(stream: any): Promise<any> {
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("base64");
}
