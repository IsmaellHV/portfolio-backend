import axios from 'axios';
import { ENVIRONMENT } from '../../../env';

export class AdapterReCaptcha {
  public static async verifyCaptcha(captcha: string): Promise<void> {
    if (!ENVIRONMENT.RECAPTCHA.VALIDATE) return;
    const response = await axios.get(`${ENVIRONMENT.RECAPTCHA.URL}?secret=${ENVIRONMENT.RECAPTCHA.KEY}&response=${captcha}`);
    if (response.status !== 200) throw Error('Catpcha no válido');

    const { success, score } = response.data;
    if (!success) throw Error('Catpcha no válido');
    if (score <= 0.5) throw Error('Catpcha no válido');
  }
}
