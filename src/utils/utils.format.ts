import moment from 'moment';

export class Format {
  static normalizedString(value: string) {
    return value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/ + /g, ' ')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  static searchString(value?: string) {
    if (!value) return '';
    return this.normalizedString(value).replace(/[^a-zA-Z0-9 ]/g, '');
  }

  static toDate(value: string | Date) {
    return moment(value, 'DD/MM/YYYY').utc(true).toDate();
  }
}
