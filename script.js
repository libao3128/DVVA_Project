
function make_left_page(){
    let myDiv = document.getElementsByClassName('left-page')[0]
    
    // Build Button Panel
    // let buttonDiv = document.createElement('div')
    // buttonDiv.name = 'button-panel'
    // buttonDiv.style.height = '7%'
    // buttonDiv.className = 'sub-sub-page'
    // myDiv.appendChild(buttonDiv)

    // var button = document.createElement("BUTTON");
    // button.innerHTML = 'Rain';
    // button.className = 'DisplayButton leftButton'
    // button.id = 'rain_button'
    // button.onclick = button_onclick
    // button.style.backgroundColor = 'rgba(1, 131, 186, 0.18)'
    // buttonDiv.appendChild(button)

    // var button = document.createElement("BUTTON");
    // button.innerHTML = 'Temperature';
    // button.className = 'DisplayButton rightButton'
    // button.id = 'temp_button'
    // button.onclick = button_onclick
    // buttonDiv.appendChild(button)


    // Build Chart
    let mapDiv = document.createElement('div')
    mapDiv.id = 'mapDiv'
    mapDiv.style.height = '80%'
    myDiv.appendChild(mapDiv)
    make_map(mapDiv)
    //make_animation_map()
    


    //Build Input Bar
    let barDiv = document.createElement('div')
    barDiv.id = 'barDiv'
    barDiv.style.width = '100%'
    barDiv.style.height = '10%'
    myDiv.appendChild(barDiv)

    var month_bar = document.getElementById('month_bar')
    month_bar.min = 1
    month_bar.max = 12
    month_bar.step = 1
    month_bar.value = String(month)
    month_bar.style.paddingRight = '25px'
    month_bar.style.paddingLeft = '25px'
    month_bar.oninput = input_onchange
    month_bar.onchange = update_map

    var month_labelDiv = document.getElementById('month_bar_label')
    var month_label = document.createTextNode(getMonthName(month))
    month_labelDiv.appendChild(month_label)

    var year_bar = document.getElementById('year_bar')
    year_bar.min = 1960
    year_bar.max = 2020
    year_bar.step = 1
    year_bar.value = String(year)
    year_bar.style.paddingRight = '25px'
    year_bar.style.paddingLeft = '25px'
    year_bar.oninput = input_onchange
    year_bar.onchange = update_map

    var year_labelDiv = document.getElementById('year_bar_label')
    var year_label = document.createTextNode(year)
    year_labelDiv.appendChild(year_label)
}
async function make_map(){
    document.getElementById('map_load').hidden = false;
    let mapDiv = document.getElementById('mapDiv')


    var layout = {
        mapbox: {
            style: "stamen-terrain",
            center: { lon: 120.9738819, lat: 23.97565 },
            zoom: 6
        },
        showlegend: false,
        autosize:true,
        height: 565,
        width: 640,
        margin:{
            b: 25,
            t: 25,
        },
        colorbar: true
        
    };
    cur_mapdata = await this.getMapData(year, month, display_type)

    Plotly.newPlot("mapDiv", cur_mapdata, layout);
    // new add
    mapDiv.on('plotly_click', function(data){
        // console.log(data)
        // console.log('hehe', data.points[0]['marker.color'])
        selected_location = [data.points[0].lon, data.points[0].lat]
        var data = [
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {color: ['#0A0A0A'], size: 24
                },
                name:'selected location'
            },
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {color: [data.points[0]['marker.color']], colorscale: scl[display_type], size: 20, 
                    cmin:cmin[display_type], cmax:cmax[display_type]
                },
                name:'selected location'
            }
        ]
        Plotly.animate('mapDiv', {
            data: data,
            traces: [1, 2],
            layout: {}
        }, {
            transition: {
              duration: 500,
              easing: 'cubic-in-out'
            },
            frame: {
              duration: 500
            }
        })
       
        //make_map()
        update_line_chart()
        update_bar_chart()
        update_heat_map()
        
    });
    //console.log('data',data)
   
  
    /*
    var data = [
        {
            type: "scattermapbox",
            fill: "toself",
            lon: [121, 121, 120, 120],
            lat: [23, 22.5, 23, 22.5],
            marker: { size: 10, color: "orange" }
        }
    ];*/
    
    document.getElementById('map_load').hidden = true;
}

function make_right_page1(){
    let rightDiv = document.getElementsByClassName('right-page1')[0]
    
    var heatmapDiv = document.createElement('div')
    heatmapDiv.className = 'sub-sub-page'
    heatmapDiv.id = 'heatDiv'
    heatmapDiv.style.height = '50%'
    heatmapDiv.style.width = '100%'
    rightDiv.appendChild(heatmapDiv)
    make_heat_map()
}

function make_right_page2(){
    let rightDiv = document.getElementsByClassName('right-page2')[0]

    var barchartDiv = document.createElement('div')
    barchartDiv.className = 'sub-sub-page'
    barchartDiv.id = 'barchartDiv'
    barchartDiv.style.height = '25%'
    rightDiv.appendChild(barchartDiv)
    make_bar_chart()
}

function make_right_page3(){
    let rightDiv = document.getElementsByClassName('right-page3')[0]

    var linechartDiv = document.createElement('div')
    linechartDiv.className = 'sub-sub-page'
    linechartDiv.id = 'linechartDiv'
    linechartDiv.style.height = '25%'
    rightDiv.appendChild(linechartDiv)
    make_line_chart()
}

var prev_heatdata, cur_heatdata;
async function make_heat_map(){
    document.getElementById('heap_load').hidden = false;
    cur_heatdata = JSON.parse(JSON.stringify( await this.getHeatData()));
    var layout = {
        autosize:true,
        width: 660,
        height: 250,
        margin: {
            l: 70,
            b: 25,
            t: 25,
            pad: 4
        },
       
    };

    Plotly.newPlot('heatDiv', cur_heatdata, layout);
    document.getElementById('heap_load').hidden = true;
}
async function update_heat_map() {
    document.getElementById('heap_load').hidden = false;
    prev_heatdata = JSON.parse(JSON.stringify(cur_heatdata));
    cur_heatdata = JSON.parse(JSON.stringify(await this.getHeatData()));
    
    let pnum = 15;
    for (var i = 0; i <= pnum; i++) {
        var cal = prev_heatdata[0].z.map((a, idx) => a.map((b,idx2) =>  b*(pnum-i)/pnum + cur_heatdata[0].z[idx][idx2]*i/pnum));
        // console.log(cal);
        var new_heatdata = JSON.parse(JSON.stringify(cur_heatdata));
        new_heatdata[0].z = cal;
        Plotly.animate('heatDiv', {
            data: new_heatdata,
            traces: [0],
            layout: {}
          }, {
            transition: {
              duration: 30,
              easing: 'cubic-in-out'
            },
            frame: {
              duration: 30
            }
          })
    }
    document.getElementById('heap_load').hidden = true;
}

async function make_bar_chart(){
    document.getElementById('bar_load').hidden = false;
    var data = await this.getYearData('Rain');
    
    var layout = {
        yaxis: {
            range: [0, Math.max(...data[0].y)+100],
            title: {
                text: 'mm'
            }
        },
        barmode: 'group',
        width: 660,
        height: 160,
        margin: {
            //l: 50,
            //r: 50,
            b: 25,
            t: 0,
            pad: 4
        }
    
    };
    
    Plotly.newPlot('barchartDiv', data, layout);
    document.getElementById('bar_load').hidden = true;
}

async function update_bar_chart() {
    document.getElementById('bar_load').hidden = false;
    var data = await this.getYearData('Rain');
    await Plotly.animate('barchartDiv', {
        data: data,
        traces: [0],
        layout: {}
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    })
    await Plotly.animate('barchartDiv', {
        data: [],
        traces: [],
        layout: {
            yaxis: {range: [0, Math.max(...data[0].y)*1.1]}
        }
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    })
    document.getElementById('bar_load').hidden = true;
}

async function make_line_chart(){
    document.getElementById('line_load').hidden = false;
    var data = await this.getYearData('Temperature');

    var layout = {
        yaxis: {
            range: [Math.min(...data[2].y)-2, Math.max(...data[0].y)+2],
            title: {
                text: '\xB0C'
            }
        },
        barmode: 'group',
        width: 660,
        height: 160,
        margin: {
            //l: 50,
            //r: 50,
            b: 25,
            t: 10,
            pad: 4
        },
       
    };
      
    Plotly.newPlot('linechartDiv', data, layout);
    document.getElementById('line_load').hidden = true;
}

async function update_line_chart() {
    document.getElementById('line_load').hidden = false;
    var data = await this.getYearData('Temperature');
    await Plotly.animate('linechartDiv', {
        data: data,
        traces: [0, 1, 2],
        layout: {}
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    });
    await Plotly.animate('linechartDiv', {
        data: [],
        traces: [],
        layout: {
            yaxis: {range: [Math.min(...data[2].y)-2, Math.max(...data[0].y)+2]}
        }
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    });
    document.getElementById('line_load').hidden = true;
}

function input_onchange(element){
    let name = element.target.id
    let val = element.target.value
    
    var label = document.getElementById(name+'_label')
    if (name.includes('year')){
        label.textContent = String(val)
        year = val
    }
    else{
        label.textContent = String(getMonthName(val))
        month = val
    }
}
var prev_mapdata, cur_mapdata;
async function update_map(){
    document.getElementById('map_load').hidden = false;
    // console.log('123')
    /*
    var data = await getMapData(year, month, display_type)
    Plotly.animate('mapDiv', {
        data: data,
        traces: [0],
        layout: {}
      }, {
        transition: {
          duration: 500,
          easing: 'cubic-in-out'
        },
        frame: {
          duration: 500
        }
      })
*/

      prev_mapdata = JSON.parse(JSON.stringify(cur_mapdata));
      cur_mapdata = JSON.parse(JSON.stringify(await getMapData(year, month, display_type)));
    //   console.log(cur_mapdata)
      for(i=0;i<cur_mapdata[0].lat.length;i++){
        if (cur_mapdata[0].lon[i]==selected_location[1]&&cur_mapdata[0].lat[i]==selected_location[0]){
            cur_mapdata[2].marker.color = cur_mapdata[0].marker.color[i]
        }
      }
      
      
      
      //console.log(prev_mapdata[0].marker.color);
      // console.log(cur_heatdata);
      let pnum = 5;
      for (var i = 0; i <= pnum; i++) {
          var cal = prev_mapdata[0].marker.color.map((b,idx2) =>  b*(pnum-i)/pnum + cur_mapdata[0].marker.color[idx2]*i/pnum);
          //console.log(cal);
          var new_mapdata = JSON.parse(JSON.stringify(cur_mapdata));
          new_mapdata[0].marker.color = cal;
          cal = prev_mapdata[2].marker.color.map((b,idx2) =>  b*(pnum-i)/pnum + cur_mapdata[2].marker.color[idx2]*i/pnum);
          new_mapdata[2].marker.color = cal;
          //console.log([new_mapdata[0], cur_mapdata[1]])
          Plotly.animate('mapDiv', {
              data: [new_mapdata[0], new_mapdata[2]],
              traces: [0, 2],
              layout: {}
            }, {
              transition: {
                duration: 120,
                easing: 'cubic-in-out'
              },
              frame: {
                duration: 120
              }
            })
      }
    
    
    document.getElementById('map_load').hidden = true;
}
function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}


async function getMapData(){
    /*
    fetch('https://exodus.tw/api/getDataByMonth.php',headers={
        'year':String(year),
        'month':String(month),
       'type':type,
        'apikey':'sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6'
    })
    */
    return await fetch(`https://exodus.tw/api/getDataByMonth.php?year=${year}&month=${month}&type=${display_type}&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6`)
    .then(function(response){return response.json()} )
    .then(function(data) {
        // console.log(data['Result'])
        //var processed_data = []
        /*
        data['Result'].forEach(element => {
            let new_data_point = {
                type: "scattermapbox",
                fill: "toself",
                lon: [element.Lon-0.25, element.Lon-0.25, element.Lon+0.25, element.Lon+0.25],
                lat: [element.Lat-0.25, element.Lat+0.25, element.Lat+0.25, element.Lat-0.25],
                marker: { size: 10, color: element.TempValue}
            }
            processed_data.push(new_data_point)
            
        })
        */
        var pinvalue = data['Result'].find(ele => ele.Lon == selected_location[0] && ele.Lat == selected_location[1]).Value;
        var processed_data = [{
                type: 'scattermapbox',
                lon: data['Result'].map(a=>a.Lon), lat: data['Result'].map(a=>a.Lat),
                marker: {
                    color: data['Result'].map(a=>a.Value),
                    size: 10,
                    colorscale: scl[display_type],
                    cmin:cmin[display_type],
                    cmax:cmax[display_type],
                    colorbar: {
                        title: display_type
                    },
                    opacity:0.8
                },
                text:  data['Result'].map(a=>a.Value),
                name:display_type,
                
            },
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {
                    color: ['#0A0A0A'],
                    size: 24, 
                },
            },
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {
                    color: [pinvalue],
                    colorscale: scl[display_type],
                    size: 20, 
                    cmin:cmin[display_type],
                    cmax:cmax[display_type]
                },
            }

    
        ];
        
        // console.log(pinvalue);

        // console.log(processed_data)
        return processed_data
    })
    .catch((error)=>{
        console.log('fetch error', error)
        // alert('fetch error')
        return []

    })
    
    //http://exodus.tw/api/getDataByMonth.php?year=2015&month=3&type=Temperature&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6
    // year: int, month: int
    // type= 'Rain' or 'Temperature'
    // retrun the data of ['type' value] and its ['WGS84_Lon'] and ['WGS84_Lat']
}
async function getHeatData(){
    // lon: WGS84_Lon, lat: WGS84_Lat
    // type= 'Rain' or 'Temperature'
    // return [Year, Month, value]
    return await fetch('https://exodus.tw/api/getDataByLoc.php?lon='+String(selected_location[0])+'&lat='+String(selected_location[1])+'&type='+display_type+'&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6')
    .then(function(response){return response.json()} )
    .then(function(data) {
        var cmin = {
            'Rain':0,
            'Temperature':0
        }
        var cmax = {
            'Rain':30,
            'Temperature':30
        }
        let heat_unit = "";
        if (display_type == "Rain") {
            heat_unit = "(unit:mm)";
        } else {
            heat_unit = "(unit:\xB0C)";
        }
        var processed_data = {
            z: [],
            x: [],
            y: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            colorscale: scl[display_type],
            colorbar: {title: heat_unit},
            type: 'heatmap',
            hoverongaps: false
        };
        let cnt = 0, first = 1;
        data['Result'].forEach(element => {
            
            if (!processed_data.x.includes(element.Year)) {
                processed_data.x.push(element.Year);
            }
            cnt += 1;
            if (cnt > 12) {
                cnt = 1;
                first = 0;
                processed_data.z[cnt-1].push(parseInt(element.Value, 10));
            } else if (first == 1) {
                processed_data.z.push([parseInt(element.Value, 10)]);
            } else {
                processed_data.z[cnt-1].push(parseInt(element.Value, 10));
            }
        })
        return [processed_data]
    })
    .catch((error)=>{
        console.log(error)
        alert('fetch error')
        return []
    })
}
async function getYearData(type){
    // lon: WGS84_Lon, lat: WGS84_Lat
    // year: if year is -1, return the average of all history data
    // type= 'Rain' or 'Temperature'
    // return [Month, value]
    return await fetch('https://exodus.tw/api/getYearDataByLoc.php?lon='+selected_location[0]+'&lat='+selected_location[1]+'&type='+type+'&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6')
    .then(function(response){return response.json()} )
    .then(function(data) {
        // console.log(data['Result'])
        
        if(type == 'Rain'){
            var bar1 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.Value),
                name: 'Rain',
                type: 'bar',
                marker: {
                    color: 'rgb(0,100,156)'
                }
            };
            var processed_data = [bar1];
        }else if(type == 'Temperature'){
            var line1 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.MaxValue),
                type: 'scatter',
                name:'highest',
                marker: {
                    color: 'rgb(253,33,2)'
                }
            };
            
            var line2 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.Value),
                type: 'scatter',
                name: 'average',
                marker: {
                    color: 'rgb(0,0,0)'
                }
            };
            
            var line3 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.MinValue),
                type: 'scatter',
                name: 'lowest',
                marker: {
                    color: 'rgb(119, 207, 252)'
                }
            };
            var processed_data = [line1, line2, line3];
        }
        
        // console.log(processed_data)
        return processed_data
    })
    .catch((error)=>{
        console.log(error)
        return []
    })
}

  
var display_type = 'Rain'
var month = 6
var year = 2020
var selected_location = [120.4, 23.5]
var scl = {
    'Rain':[ [0,'rgb(255, 255, 255)'], [1/3,'rgb(0,100,156)'], [1,'rgb(0,0,0)']],
    'Temperature':[[0,'rgb(119, 207, 252)'], [2/3, 'rgb(255,243,103)'], [1,'rgb(253,33,2)'],]
}
var cmin = {
    'Rain':0,
    'Temperature':0
}
var cmax = {
    'Rain':30,
    'Temperature':30
}

make_left_page()
make_right_page1()
make_right_page2()
make_right_page3()

var rad = document.settings.type;
var prev = null;
var val = 'Rain';
for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function() {
        if (this !== prev) {
            prev = this;
            val = this.value;
        }
        document.getElementById('heat_title').innerHTML = 'Selected Location '+val+' Heat Map';
        display_type = val;
        update_map();
        update_heat_map();
    });
}