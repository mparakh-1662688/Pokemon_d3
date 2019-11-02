"use strict";
(function(){
    let data = "";
    let svgContainer = "";
    let div = "";

    const measurements = {
        width: 1000,
        height: 500,
        marginAll: 50
    }

    const colors = {

        "Bug": "#4E79A7",
    
        "Dark": "#A0CBE8",
    
        "Electric": "#F28E2B",
    
        "Fairy": "#FFBE&D",
    
        "Fighting": "#59A14F",
    
        "Fire": "#8CD17D",
    
        "Ghost": "#B6992D",
    
        "Grass": "#499894",
    
        "Ground": "#86BCB6",
    
        "Ice": "#86BCB6",
    
        "Normal": "#E15759",
    
        "Poison": "#FF9D9A",
    
        "Psychic": "#79706E",
    
        "Steel": "#BAB0AC",
    
        "Water": "#D37295",

        "Dragon": "#800080",

        "Fairy": "#FFC0CB",

        "Flying": "#00FFFF"
    
    }

    window.onload = function() {
        svgContainer = d3.select('body').append("svg")
            .attr('width', measurements.width)
            .attr('height', measurements.height);
        d3.csv("pokemon.csv")
            .then((csvData) => data = csvData)
            .then(() => makeScatterPlot());
    }


    function makeScatterPlot() {
        let Generation = data.map((row) => parseInt(row["Generation"]))
        let temp = ["(all)"]
        Generation = temp.concat(Generation.filter( onlyUnique )); 
        const eachYear = function(d) {return d};

        let Legendary =  data.map((row) => (row["Legendary"]))
        Legendary = temp.concat(Legendary.filter( onlyUnique )); 
        const gen = function(d) {return d};

        div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(Generation)
            .enter()
            .append('option')
            .attr('value',eachYear)
            .text(eachYear)

        d3.select("#selectButton2")
            .selectAll('myOptions')
            .data(Legendary)
            .enter()
            .append('option')
            .attr('value',gen)
            .text(gen)

        d3.select("#selectButton").on("change", function(d) {
            let selectedOption = d3.select(this).property("value")
            let selectedOption2 = d3.select("#selectButton2").property("value")
            update(selectedOption, selectedOption2 , data)
        })

        d3.select("#selectButton2").on("change", function(d) {
            let selectedOption2 = d3.select(this).property("value")
            let selectedOption = d3.select("#selectButton").property("value")
            update(selectedOption, selectedOption2 , data)
        })

        let Sp_def = data.map((row) => parseInt(row["Sp. Def"]))
        let Total = data.map((row) =>  parseFloat(row["Total"]))
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }
        
            
        const limits = findMinMax(Sp_def, Total)              

        let scaleX = d3.scaleLinear()
            .domain([10, 250])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])

        let scaleY = d3.scaleLinear()
            .range([measurements.height, 0])
            .domain([0, 850]); 
        drawAxes(scaleX, scaleY)
        update("(all)", "(all)", data);
        function update(selectedGroup, selectedGroup2, data) {
            let dataFilter;
            if (selectedGroup === "(all)") {
                dataFilter = data;
            } else {
                dataFilter = data.filter(function(d){return d.Generation==selectedGroup});
            }
            if (selectedGroup2 === "(all)") {
                dataFilter = dataFilter;
            } else {
                dataFilter = dataFilter.filter(function(d){return d.Legendary==selectedGroup2});
            }
            Sp_def = dataFilter.map((row) => parseInt(row["Sp. Def"]))
            Total = dataFilter.map((row) =>  parseFloat(row["Total"]))
            plotData(scaleX, scaleY, dataFilter)
        }

        
        makeLabels();
    }

    function findMinMax(fertility_rate, life_expectancy) {
        return {
            greMin: d3.min(fertility_rate),
            greMax: d3.max(fertility_rate),
            admitMin: d3.min(life_expectancy),
            admitMax: d3.max(life_expectancy)
        }
    }

    function drawAxes(scaleX, scaleY) {
        let xAxis = d3.axisBottom()
            .scale(scaleX)
            .tickValues(d3.range(10, 250, 10))

        let yAxis = d3.axisLeft()
            .scale(scaleY)
            .tickValues(d3.range(100, 850, 50))
            
        svgContainer.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)
    }

    function plotData(scaleX, scaleY, dataFilter) {
        const xMap = function(d) { return scaleX(+d["Sp. Def"]) }
        const yMap = function(d) { return scaleY(+d["Total"]) }
        const currColor = function(d) { let a = d["Type 1"];
                                let res = colors[a];
                                return res; }

        d3.selectAll("svg").selectAll("circle").remove()
        const circles = svgContainer.selectAll(".dot")
            .data(dataFilter)
            .enter()
            .append('circle')
                .attr('cx', xMap)
                .attr('cy', yMap)
                .attr('r', 5)
                .attr('fill', currColor)
                .on("mouseover", (d) => {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(d["Name"] + "<br/>" + 
                             d["Type 1"] + "<br/>" +
                             d["Type 2"] + "<br/>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                    })
                    .on("mouseout", (d) => {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                    });

    }

    function makeLabels() {
        d3.selectAll("svg").selectAll("text.label").remove();
        svgContainer.append('text')
          .attr('x', 450)
          .attr('y', 490)
          .style('font-size', '14pt')
          .text('Sp. Def')
          .attr('class', "label");
    
        svgContainer.append('text')
          .attr('transform', 'translate(15, 300)rotate(-90)')
          .style('font-size', '14pt')
          .text('Total')
          .attr('class', "label");
      }






})()