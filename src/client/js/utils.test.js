import {formatDate, capitalizeFirstLetter} from './utils.js'


describe('capitalizeFirstLetter Test case', () => {

    test('Function should set first letter with upper letter of single word ', () => {
      const result = capitalizeFirstLetter('hello');
      expect(result).toBe('Hello');
    });
  
    test('Function should return same string in case first character already capitalized', () => {
      const result = capitalizeFirstLetter('Hello');
      expect(result).toBe('Hello');
    });

    test('Function should return empty string when pass empty string', () => {
      const result = capitalizeFirstLetter('');
      expect(result).toBe('');
    });

    
    test('Function should return same string when pass first char is special char', () => {
      const result = capitalizeFirstLetter('-');
      expect(result).toBe('-');
    });
  
  });

describe('Format date function', () => {

    test('Format data should return error in case send invalid date', () => {
      let travelDateInput ="invalid..date" 
      const result = formatDate(travelDateInput);
      expect(result).toBe(`Invalid date format: ${travelDateInput}`);
    });
    
})


  