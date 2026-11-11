import { SITE } from '@/consts';

const dateFmt = new Intl.DateTimeFormat(SITE.locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const formatDate = (d: Date) => dateFmt.format(d);
