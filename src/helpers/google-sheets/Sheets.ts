import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { RangeSpreadsheet } from '../../interfaces/RangeSpreadsheet';
import { ValueInputOption } from '../../interfaces/ValueInputOption';

export class Sheets {
  private SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  private TOKEN_PATH = path.join(process.cwd(), 'token.json');
  private CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
  private spreadsheetId: string;

  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;
  }

  private async loadSavedCredentialsIfExist(): Promise<
    JSONClient | OAuth2Client | null
  > {
    try {
      const content = await fs.readFile(this.TOKEN_PATH);
      //@ts-ignore
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  private async saveCredentials(client: JSONClient | OAuth2Client | null) {
    const content = await fs.readFile(this.CREDENTIALS_PATH);
    //@ts-ignore
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client!.credentials.refresh_token,
    });
    await fs.writeFile(this.TOKEN_PATH, payload);
  }

  private async authorize(): Promise<JSONClient | OAuth2Client> {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client!.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  private async sheets() {
    const auth = await this.authorize();
    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  }

  public async get(range: RangeSpreadsheet) {
    const sheets = await this.sheets();

    let rangeSpreadsheet: string;
    if (range.celdaFinal) {
      rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}:${range.celdaFinal}`;
    } else {
      rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}`;
    }

    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: rangeSpreadsheet,
      });
      return res.data.values;
    } catch (error) {
      throw new Error(`Unable to parse range: ${rangeSpreadsheet}`);
    }
  }

  public async update(
    range: RangeSpreadsheet,
    values: Array<Array<string>>,
    valueInputOption?: ValueInputOption
  ) {
    const sheets = await this.sheets();

    let rangeSpreadsheet: string;
    if (range.celdaFinal) {
      rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}:${range.celdaFinal}`;
    } else {
      rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}`;
    }

    if (!valueInputOption) {
      valueInputOption = ValueInputOption.RAW;
    }

    try {
      //@ts-ignore
      const res = await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: rangeSpreadsheet,
        valueInputOption,
        resource: {
          values,
        },
      });

      //@ts-ignore
      return res.data;
    } catch (error) {
      throw new Error(`Unable to parse range: ${rangeSpreadsheet}`);
    }
  }
}
