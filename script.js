function make_left_page(){
    let myDiv = document.getElementsByClassName('left-page')[0]
    
    // Build Button Panel
    let buttonDiv = document.createElement('div')
    buttonDiv.name = 'button-panel'
    buttonDiv.style.height = '7%'
    myDiv.appendChild(buttonDiv)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Rain';
    button.className = 'DisplayButton leftButton'
    buttonDiv.appendChild(button)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Temperature';
    button.className = 'DisplayButton rightButton'
    buttonDiv.appendChild(button)


    // Build Chart
    let mapDiv = document.createElement('div')
    mapDiv.id = 'mapDiv'
    mapDiv.height = '50%'
    mapDiv.width = '100%'
    myDiv.appendChild(mapDiv)
    var data = [
        {
            type: "scattermapbox",
            fill: "toself",
            lon: [121, 121, 120, 120],
            lat: [23, 22.5, 23, 22.5],
            marker: { size: 10, color: "orange" }
        }
    ];
    
    var layout = {
        mapbox: {
            style: "stamen-terrain",
            center: { lon: 120.9738819, lat: 23.97565 },
            zoom: 6.5
        },
        showlegend: false,
        height: 800,
        width: 600
    };
    
    Plotly.newPlot("mapDiv", data, layout);
    
    
}


make_left_page()