import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';
import { ip } from 'elysia-ip';
import { rateLimit } from 'elysia-rate-limit';
import staticPlugin from '@elysiajs/static';

const app = new Elysia()
  .use(ip({ checkHeaders: ['X-Forwarded-For', 'X-Real-IP'] }))
  .onRequest(({ request }) => {
    const url = new URL(request.url);

    const clientIp = app.server?.requestIP(request)?.address ?? 'unknown';

    console.log(`[REQ] ${request.method} ${url.pathname} → ${clientIp}`);
  })
  .use(staticPlugin({ prefix: '/'}))
  .use(rateLimit({ duration: 60_000, max: 50 }))
  .use(cors())
  .get('/', () => `Hello, world!`)
  .all('/player/login/dashboard', async ({ body }) => {
    const tData: Record<string, string> = {};

    // @note handle empty body or missing data
    if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      try {
        const bodyStr = JSON.stringify(body);
        const parts = bodyStr.split('"');
        
        if (parts.length > 1) {
          const uData = parts[1].split('\\n');
          for (let i = 0; i < uData.length - 1; i++) {
            const d = uData[i].split('|');
            if (d.length === 2) {
              tData[d[0]] = d[1];
            }
          }
        }
      } catch (why) {
        console.log(`[ERROR]: ${why}`);
      }
    }

    // @note convert tData object to base64 string
    const tDataBase64 = Buffer.from(JSON.stringify(tData)).toString('base64');

    // @note read dashboard template and replace placeholder
    const templateFile = Bun.file('./src/template/dashboard.html');
    const templateContent = await templateFile.text();
    const htmlContent = templateContent.replace('{{ data }}', tDataBase64);

    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  })
  .all('/player/growid/login/validate', async ({ body }) => {
    try {
      // @note type assertion for form data
      const formData = body as Record<string, string>;
      const _token = formData._token;
      const growId = formData.growId;
      const password = formData.password;

      const token = Buffer.from(
        `_token=${_token}&growId=${growId}&password=${password}`,
      ).toString('base64');

      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Account Validated.',
          token,
          url: '',
          accountType: 'growtopia',
        }),
        {
          headers: { 'Content-Type': 'text/html' },
        },
      );
    } catch (why) {
      console.log(`[ERROR]: ${why}`);
      return new Response('Invalid request', { status: 400 });
    }
  })
  .all('/player/growid/checktoken', async ({ body }) => {
    try {
      // @note type assertion for request body
      const requestData = body as {
        data: { refreshToken: string; clientData: string };
      };
      const { refreshToken, clientData } = requestData.data;

      if (!refreshToken || !clientData) {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Missing refreshToken or clientData',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      let decodeRefreshToken = Buffer.from(refreshToken, 'base64').toString(
        'utf-8',
      );

      console.log(decodeRefreshToken);

      const token = Buffer.from(
        decodeRefreshToken.replace(
          /(_token=)[^&]*/,
          `$1${Buffer.from(clientData).toString('base64')}`,
        ),
      ).toString('base64');

      console.log(token);

      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Token is valid.',
          token: token,
          url: '',
          accountType: 'growtopia',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  })
  .listen(5000);

console.log(
  `🦊 GTLogin is running at ${app.server?.hostname}:${app.server?.port}`,
);
