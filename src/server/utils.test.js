const { getCityImage, getWeatherForTarget, getCityGeoInfo }  = require('./utils.js');

//const { getCityImage, getWeatherForTarget, getCityGeoInfo } = require('./utils.js');


describe('Get city geo info ', () => {
    test('Function should return null in case the city not exist', async () => {
      const result = await getCityGeoInfo('555555555555555555555555555555555');
      expect(result).toEqual(null);
    });
    
})