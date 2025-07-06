import axios, { AxiosRequestConfig } from 'axios';
import { ENVIRONMENT } from '../../../env';
import { IError } from '../Domain/IError';

export class AdapterReCaptcha {
  public static async verifyCaptcha(captcha: string): Promise<void> {
    if (!ENVIRONMENT.RECAPTCHA.VALIDATE) return;
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: ENVIRONMENT.RECAPTCHA.URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `secret=${ENVIRONMENT.RECAPTCHA.KEY}&response=${captcha}`,
    };
    const resp = await axios.request(config);
    if (resp.status !== 200) throw new IError(`Error: status code invalid ${resp.status}`, 0, 406, 'Captcha no válido');
    const { success } = resp.data;
    if (!success) throw new IError(`Error: success: ${success} `, 0, 406, 'Captcha no válido');
  }
}
