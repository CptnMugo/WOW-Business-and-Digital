export const reviewStatuses = ['Received', 'Call arranged', 'Call completed', 'Accepted', 'Not accepted'] as const;
export type ReviewStatus = typeof reviewStatuses[number];
export type Review = { version: number; status: ReviewStatus; notes: string; callDate: string; callTime: string; callZone: string; updatedAt?: string; updatedBy?: string };
export const emptyReview = (): Review => ({ version: 0, status: 'Received', notes: '', callDate: '', callTime: '', callZone: '' });
export const answerLabels: Record<string, string> = {
 fullName:'Full name', firstName:'First name', lastName:'Last name', email:'Email', mobileWhatsapp:'Mobile / WhatsApp', phone:'Phone', townCity:'Town / city', city:'City', country:'Country', address:'Address', postalCode:'Postcode', gender:'Gender',
 workStatus:'Work status', workStatusOther:'Other work status', rightToWorkUK:'Right to work in the UK', highestQualification:'Highest qualification', highestQualificationOther:'Other qualification', pmQualifications:'Project management qualifications', ukWorkExperience:'UK work experience', englishFirstLanguage:'English first language', previousExperience:'Previous experience', careerObjective:'Career objective', currentChallenge:'Current challenge', developmentNeeds:'Development needs', developmentNeedsOther:'Other development needs', successMeasure:'What success looks like', weeklyAvailability:'Weekly availability', birminghamAttendance:'Birmingham attendance', inPersonProjectAttendance:'In-person project attendance', packageSelection:'Programme / optional mentorship', paymentPreference:'Payment preference', howDidYouHear:'How they heard about WOW', promoCode:'Promotion code',
 confirmationCallDate:'Requested call date', confirmationCallTime:'Requested call time', confirmationCallTimeZone:'Requested call time zone', confirmationCallAlternative:'Alternative availability',
 privacyAcknowledged:'Privacy acknowledgement', marketingConsent:'Marketing consent', declaration1:'Declaration 1: active participation', declaration2:'Declaration 2: in-person attendance', declaration3:'Declaration 3: deposit and cancellation rights', declaration4:'Declaration 4: payment arrangements', declaration5:'Declaration 5: supervised project work', declaration6:'Declaration 6: reference reflects actual contribution', declaration7:'Declaration 7: information is accurate',
 employmentStatus:'Employment status', currentJobTitle:'Current job title', currentCompany:'Current company', experienceLevel:'Experience level', linkedInUrl:'LinkedIn URL', careerGoals:'Career goals', programTitle:'Programme', cohortDate:'Cohort', learningMode:'Learning mode', emergencyContactName:'Emergency contact', emergencyContactRelationship:'Emergency relationship', emergencyContactPhone:'Emergency phone', specialRequirements:'Additional requirements'
};
export type EmailState = { sent: boolean; method: string; timestamp: string } | null;
export type Application = { reference: string; name: string; email: string; submittedAt: string; answers: Record<string, string | boolean | string[]>; review: Review; emails: { staff: EmailState; applicant: EmailState }; paid: number; sheetsSynced: boolean };
export interface AdmissionsAPI {
 session(): Promise<{ user: string | null }>;
 login(email: string, password: string): Promise<{ user: string }>;
 logout(): Promise<void>;
 list(): Promise<Application[]>;
 save(reference: string, review: Review): Promise<Review>;
 resend(reference: string, kind: 'staff' | 'applicant'): Promise<{ sent: boolean }>;
 export(): Promise<Blob>;
}
export const displayAnswer = (value: unknown) => typeof value === 'boolean' ? (value ? 'Yes' : 'No') : Array.isArray(value) ? value.join(', ') : String(value ?? '');
export function applicationsCSV(applications: Application[]) {
 const cells = (values: unknown[]) => values.map(value => { let s = displayAnswer(value); if (/^[\s]*[=+@\-]/.test(s) || /^[\t\r\n]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }).join(',');
 return '\uFEFF' + [cells(['Reference', 'Submitted at', 'Review status', 'Confirmed call date', 'Confirmed call time', 'Confirmed call time zone', 'Internal notes', 'Live payments received (GBP)', ...Object.values(answerLabels)]), ...applications.map(a => cells([a.reference, a.submittedAt, a.review.status, a.review.callDate, a.review.callTime, a.review.callZone, a.review.notes, (a.paid / 100).toFixed(2), ...Object.keys(answerLabels).map(k => a.answers[k])]))].join('\r\n');
}
