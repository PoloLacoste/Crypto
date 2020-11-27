const crypto = require('crypto');
const jwa = require('jwa');
const jws = require('jws');
import { sign, SignOptions, verify } from 'jsonwebtoken';

const header: SignOptions = {
	algorithm: 'HS256',
}
const payload = {
	'name': 'Projet JWT'
}
const key = 'private_key';

interface Options {
	algorithm: string;
}

const token = sign(payload, key, header);

console.log(token);

const decoded = verify(token, key);

console.log(decoded);

function base64url(string: string, encoding: BufferEncoding = 'utf8'): string 
{
	return Buffer
	  .from(string, encoding)
	  .toString('base64')
	  .replace(/=/g, '')
	  .replace(/\+/g, '-')
	  .replace(/\//g, '_');
}

function encodeJWT(payloadData: string | Buffer | object,
	key: string, headerData: SignOptions): string
{
	const header = {
		alg: headerData.algorithm,
		typ: 'JWT'
	}

	const payload = Object.assign({
		iat: Math.floor(Date.now() / 1000)
	}, payloadData);

	const algo = header.alg?.substr(header.alg.length - 3);
	const base64Header = base64url(JSON.stringify(header), 'binary');
	const base64Payload = base64url(JSON.stringify(payload));
	const input = `${base64Header}.${base64Payload}`
	const hmac = crypto.createHmac(`sha${algo}`, key);
	const hash = (hmac.update(input), hmac.digest('base64'));
	const signature = base64url(JSON.stringify(hash));

	return `${input}.${signature}`;
}

/*function decodeJWT(): string | object
{

}*/

const encoded = encodeJWT(payload, key, header);

console.log(encoded);

const decode = verify(token, key);

console.log(decode);