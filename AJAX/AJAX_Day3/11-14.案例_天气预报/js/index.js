/**
 * 目标1：默认显示-北京市天气
 *  1.1 获取北京市天气数据
 *  1.2 数据展示到页面
 */
function getWeather(cityCode) {
  myAxios({
    // 1.1获取北京天气数据
    url: 'http://hmajax.itheima.net/api/weather',
    params: {
      city: cityCode
    }
  }).then(result => {
    console.log(result)
    const weatherObj = result.data
    // 1.2数据展示到页面
    // 一般顺序是从上到下、tle从左往右

    // 1.2.1左上角日期
    document.querySelector('.top-box .title').innerHTML =
      `<span class="dateShort">${weatherObj.dateShort}</span>
        <span class="calendar">农历&nbsp;
          <span class="dateLunar">${weatherObj.dateLunar}</span>
        </span> `
    // 1.2.2右上角城市名
    document.querySelector('.search-box .area').innerHTML =
      `<span class="area">${weatherObj.area}</span>`

    // 1.2.3当前天气
    document.querySelector('.weather-box').innerHTML =
      `<div class="tem-box">
        <span class="temp">
          <span class="temperature">${weatherObj.temperature}</span>
          <span>°</span>
        </span>
      </div>
      <div class="climate-box">
        <div class="air">
          <span class="psPm25">${weatherObj.psPm25}</span>
          <span class="psPm25Level">${weatherObj.psPm25Level}</span>
        </div>
        <ul class="weather-list">
          <li>
            <img src="${weatherObj.weatherImg}" class="weatherImg" alt="">
            <span class="weather">${weatherObj.weather}</span>
          </li>
          <li class="windDirection">${weatherObj.windDirection}</li>
          <li class="windPower">${weatherObj.windPower}</li>
        </ul>
      </div>`

    // 1.2.4今日天气
    const todayWObj = weatherObj.todayWeather
    document.querySelector('.today-weather').innerHTML =
      `      <div class="range-box">
        <span>今天：</span>
        <span class="range">
          <span class="weather">${todayWObj.weather}</span>
          <span class="temNight">${todayWObj.temNight}</span>
          <span>-</span>
          <span class="temDay">${todayWObj.temDay}</span>
          <span>℃</span>
        </span>
      </div>
      <ul class="sun-list">
        <li>
          <span>紫外线</span>
          <span class="ultraviolet">${todayWObj.ultraviolet}</span>
        </li>
        <li>
          <span>湿度</span>
          <span class="humidity">${todayWObj.humidity}</span>%
        </li>
        <li>
          <span>日出</span>
          <span class="sunriseTime">${todayWObj.sunriseTime}</span>
        </li>
        <li>
          <span>日落</span>
          <span class="sunsetTime">${todayWObj.sunsetTime}</span>
        </li>
      </ul>`

    // 1.2.5 七日天气
    const weekArray = weatherObj.dayForecast
    // console.log(weekArray)
    const weekHtml = weekArray.map(item => {
      return `<li class="item">
          <div class="date-box">
            <span class="dateFormat">${item.dateFormat}</span>
            <span class="date">${item.date}</span>
          </div>
          <img src="${item.weatherImg}" alt="" class="weatherImg">
          <span class="weather">${item.weather}</span>
          <div class="temp">
            <span class="temNight">&nbsp${item.temNight}</span>-
            <span class="temDay">${item.temDay}</span>
            <span>℃</span>
          </div>
          <div class="wind">
            <span class="windDirection">${item.windDirection}</span>
            <span class="windPower">${item.windPower}</span>
          </div>
        </li>
        `
    }).join('')
    // console.log(weekHtml);
    document.querySelector('.week-wrap').innerHTML = weekHtml


  })
}
getWeather('110100')

/* 目标2：实现城市搜索
   2.1 输入关键字查询到相关城市
   2.2 显示在搜索框下方
    */
document.querySelector('.search-city').addEventListener('input', e => {
  // console.log(e.target.value)
  // 2.1 输入关键字查询到相关城市
  myAxios({
    url: 'http://hmajax.itheima.net/api/weather/city',
    params: {
      city: e.target.value
    }
  }).then(reslut => {
    // console.log(reslut.data);
    const searchCity = reslut.data
    // 2.2 显示在搜索框下方
    const searchHtml = searchCity.map(item => {
      return `
      <li class="city-item" data-code="${item.code}">${item.name}</li>
      `
    }).join('')
    document.querySelector('.search-list').innerHTML = searchHtml

  })

})

/*  目标3：实现城市更换
    3.1获取城市码
    3.2重新渲染
*/
document.querySelector('.search-list').addEventListener('click', e => {
  // console.log(e.target.tagName)
  if (e.target.tagName === 'LI') {
    // console.log(e.target.dataset.code)
    getWeather(e.target.dataset.code)
  }
})

