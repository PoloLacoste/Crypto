import crypto from 'crypto';

type Algorithm =
    "HS256" | "HS384" | "HS512" |
    "RS256" | "RS384" | "RS512" |
    "ES256" | "ES384" | "ES512" |
    "PS256" | "PS384" | "PS512" |
	"none";

interface SignOptions {
	algorithm?: Algorithm
}

function base64url(str: string, encoding: BufferEncoding = 'utf8'): string
{
	return Buffer
	  .from(str, encoding)
	  .toString('base64')
	  .replace(/=/g, '')
	  .replace(/\+/g, '-')
	  .replace(/\//g, '_');
}

function fromBase64(base64: string)
{
	return base64
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

function decodeBase64(str: string, encoding: BufferEncoding = 'utf8'): string
{
	return Buffer.from(str, 'base64').toString(encoding);
}

function toString(obj: any)
{
	if (typeof obj === 'string')
		return obj;
	if (typeof obj === 'number' || Buffer.isBuffer(obj))
		return obj.toString();
	return JSON.stringify(obj);
};

function createSignature(algo: string | undefined, secret: string, input: string): string
{
	const hmac = crypto.createHmac(`sha${algo}`, secret);
	const hash = (hmac.update(input), hmac.digest('base64'));
	return fromBase64(toString(hash));
}

export function sign(payloadData: string | Buffer | object,
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
	const base64Header = base64url(toString(header), 'binary');
	const base64Payload = base64url(toString(payload));
	const input = `${base64Header}.${base64Payload}`;
	const signature = createSignature(algo, secret, input);

	return `${input}.${signature}`;
}

export function verify(token: string, secret: string): string | object
{
	const split = token.split('.');

	const header = JSON.parse(decodeBase64(split[0], 'binary'));
	const algo = header.alg?.substr(header.alg.length - 3);
	const payload =  JSON.parse(decodeBase64(split[1]));

	const input = `${split[0]}.${split[1]}`;
	const signature = split[2];
	const createdSignature = createSignature(algo, secret, input);

	if(signature !== createdSignature) {
		throw new Error('Invalid JWT token')
	}

	return payload;
}