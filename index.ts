const crypto = require('crypto');
const jwa = require('jwa');
const jws = require('jws');
import { sign, SignOptions, verify } from 'jsonwebtoken';

let header: SignOptions = {
	algorithm: 'HS256',
}
let payload = {
	'name': 'Projet JWT'
}
let key = 'private_key';

interface Options {
	algorithm: string;
}

let token = sign(payload, key, header);

console.log(token);

let decoded = verify(token, key);

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
	let header = {
		alg: headerData.algorithm,
		typ: 'JWT'
	}

	let payload = Object.assign({
		iat: Math.floor(Date.now() / 1000)
	}, payloadData);

	let algo = header.alg?.substr(header.alg.length - 3);
	let base64Header = base64url(JSON.stringify(header), 'binary');
	let base64Payload = base64url(JSON.stringify(payload));
	let input = `${base64Header}.${base64Payload}`
	let hmac = crypto.createHmac(`sha${algo}`, key);
	let hash = (hmac.update(input), hmac.digest('base64'));
	let signature = base64url(JSON.stringify(hash));

	return `${input}.${signature}`;
}

/*function decodeJWT(): string | object
{

}*/

let encoded = encodeJWT(payload, key, header);

console.log(encoded);

let decode = verify(token, key);

console.log(decode);