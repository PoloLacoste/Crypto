const crypto = require('crypto');
const jwa = require('jwa');
import { sign, SignOptions, verify } from 'jsonwebtoken';

let header = {
	'algorithm': 'sha256',
}
let payload = {
	'name': 'Projet JWT'
}
let key = 'private_key';

let options: SignOptions = {
	'algorithm': 'HS256',
}

interface Options {
	algorithm: string;
}

let token = sign(payload, key, options);

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

function encodeJWT(payload: string | Buffer | object, 
	key: string, header: Options): string
{
	let base64Header = base64url(JSON.stringify(header), 'binary');
	let base64Payload = base64url(JSON.stringify(payload));
	let input = `${base64Header}.${base64Payload}`
	let hmac = crypto.createHmac(header.algorithm, key);
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

const hmac = jwa('HS256');
console.log(hmac.sign(payload, key))