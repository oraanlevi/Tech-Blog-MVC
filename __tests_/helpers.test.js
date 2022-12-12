const {format_date, format_plural} = require('../utils/helpers')

// creating test to that format_date() takes Date() objects and returns dates in MM/DD/YYYY
test('format_date() returns a date string', () => {
    const date = new Date('2022-12-04 12:23:19');
    
    expect(format_date(date)).toBe('12/04/2022');
});

// plural point and comments
test('format_plural() returns a pluralized word', () => {
    const plural = format_plural('tiger', 2);
    const single = format_plural('lion', 1);
    
    expect(plural).toBe('tigers');
    expect(single).toBe('lion');
});