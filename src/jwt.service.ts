import * as crypto from "crypto";
import { Injectable } from '@nestjs/common';

type Algorithm =
  "HS256" | "HS384" | "HS512" |
  "RS256" | "RS384" | "RS512" |
  "ES256" | "ES384" | "ES512" |
  "PS256" | "PS384" | "PS512" |
  "none";

export interface SignOptions {
  algorithm?: Algorithm
}

@Injectable()
export class JwtService {
  private base64url(str: string, encoding: BufferEncoding = 'utf8'): string
  {
    return Buffer
      .from(str, encoding)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private fromBase64(base64: string)
  {
    return base64
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private decodeBase64(str: string, encoding: BufferEncoding = 'utf8'): string
  {
    return Buffer.from(str, 'base64').toString(encoding);
  }

  private toString(obj: any)
  {
    if (typeof obj === 'string')
      return obj;
    if (typeof obj === 'number' || Buffer.isBuffer(obj))
      return obj.toString();
    return JSON.stringify(obj);
  };

  private createSignature(algo: string | undefined, secret: string, input: string): string
  {
    const hmac = crypto.createHmac(`sha${algo}`, secret);
    const hash = (hmac.update(input), hmac.digest('base64'));
    return this.fromBase64(this.toString(hash));
  }

  sign(payloadData: string | Buffer | object,
                       secret: string, headerData: SignOptions): string
  {
    const header = {
      alg: headerData.algorithm ?? 'HS256',
      typ: 'JWT'
    }

    const payload = Object.assign({
      iat: Math.floor(Date.now() / 1000)
    }, payloadData);

    const algo = header.alg?.substr(header.alg.length - 3);
    const base64Header = this.base64url(this.toString(header), 'binary');
    const base64Payload = this.base64url(this.toString(payload));
    const input = `${base64Header}.${base64Payload}`;
    const signature = this.createSignature(algo, secret, input);

    return `${input}.${signature}`;
  }

  verify(token: string, secret: string): string | object
  {
    const split = token.split('.');

    const header = JSON.parse(this.decodeBase64(split[0], 'binary'));
    const algo = header.alg?.substr(header.alg.length - 3);
    const payload =  JSON.parse(this.decodeBase64(split[1]));

    const input = `${split[0]}.${split[1]}`;
    const signature = split[2];
    const createdSignature = this.createSignature(algo, secret, input);

    if(signature !== createdSignature) {
      throw new Error('Invalid JWT token')
    }

    return payload;
  }
}
