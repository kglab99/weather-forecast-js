# Vanilla JS geolocation weather app
## [Live preview](https://kglab99.github.io/weather-app-js/)


### Solved problems
- **Weather API geolocation inaccuracy**

API rounds up longitude and latitude to .00 values, which creates great inaccuracy.
To solve it **Locationiq API** was implemented. It takes coordinates and gives the location more accurately, with city name and approximate adress.


- **Locationiq API native language signs**

The adresses fetched from API contain local signs, which are not accepted by Weather API. To make it work, the output has to be normalised first.
However, normalize() still leaves some charcs unaccepted by WeatherAPI, such as 'Ł'. A function normalizeString was implemented to make it work.

