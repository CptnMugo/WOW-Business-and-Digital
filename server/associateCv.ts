import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
export const CV_MAX = 5 * 1024 * 1024;
export type CvAttachment = { storageName: string; name: string; size: number; contentType: string };
export function validateCv(value: unknown): { bytes: Buffer; name: string; extension: string; contentType: string } | undefined {
 if (value == null) return;
 const v = value as any;
 if (typeof v.name !== 'string' || v.name.length > 200 || typeof v.base64 !== 'string' || v.base64.length > Math.ceil(CV_MAX / 3) * 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(v.base64)) throw new Error('Please upload a PDF or Word CV up to 5 MB.');
 const name = path.basename(v.name.replace(/\\/g, '/')).replace(/[\x00-\x1f\x7f]/g, '');
 const extension = path.extname(name).toLowerCase(); const bytes = Buffer.from(v.base64, 'base64');
 const pdf = extension === '.pdf' && bytes.subarray(0,5).toString() === '%PDF-';
 const doc = extension === '.doc' && bytes.subarray(0,8).equals(Buffer.from('d0cf11e0a1b11ae1','hex'));
 const docx = extension === '.docx' && bytes.subarray(0,4).equals(Buffer.from('504b0304','hex')) && bytes.includes(Buffer.from('[Content_Types].xml')) && bytes.includes(Buffer.from('word/document.xml')) && !bytes.includes(Buffer.from('vbaProject.bin'));
 if (bytes.toString('base64') !== v.base64 || !bytes.length || bytes.length > CV_MAX || !(pdf || doc || docx)) throw new Error('Please choose a valid PDF, DOC or DOCX CV, up to 5 MB.');
 return {bytes,name,extension,contentType:pdf?'application/pdf':doc?'application/msword':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
}
export function saveCv(cv: ReturnType<typeof validateCv>): CvAttachment | undefined {
 if (!cv) return;
 fs.mkdirSync('data/associate-cvs', { recursive:true, mode:0o700 });
 const storageName=randomUUID()+cv.extension;
 fs.writeFileSync(path.join('data/associate-cvs',storageName),cv.bytes,{mode:0o600,flag:'wx'});
 return {storageName,name:cv.name,size:cv.bytes.length,contentType:cv.contentType};
}
