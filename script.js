const margin = {t: 50, r:50, b: 50, l: 50};
const size = {w: 800, h: 800};
const svg = d3.select('svg');

svg.attr('width', size.w)
    .attr('height', size.h);

/**
 * d3.json('data/maps/world.geo.json')
 * d3.json('data/life-expectancy.json')
 */

Promise.all([
    d3.json('data/maps/world.geo.json'),
    d3.json('data/life-expectancy.json')
]).then(function (datasets) {
    const mapData = datasets[0];
    const lifeExpData = datasets[1];

    let mapG = svg.append('g').classed('map', true);
    drawMap(mapG, mapData, lifeExpData);
});

function drawMap(mapG, mapData, lifeExpData) {
    let projection = d3.geoEqualEarth()
        .fitSize([size.w, size.h], mapData);

    let path = d3.geoPath(projection);

    let pathSel = mapG.selectAll('path')
        .data(mapData.features)
        .enter()
        .append('path')
        // .attr('id', function(d){ return d.properties.brk_a3; })
        .attr('id', d => d.properties.brk_a3)
        .attr('d', function(d) {
            return path(d);
        });

    let extent = d3.extent(lifeExpData, d => d.lifeExpectancy);
    let colorScale = d3.scaleSequential()
        .domain(extent)
        .interpolator(d3.interpolateYlGnBu);

    pathSel.style('fill', (d) => {
        let countryCode = d.properties.brk_a3;
        let country = lifeExpData.filter(e => e.countryCode === countryCode);
        if (country.length > 0) {
            country = country[0];
            return colorScale(country.lifeExpectancy);
        }
        return "#aaa";
    })
    
}

// function choroplethizeMap(paths, lifeExpData) {
//     mapG.selectAll('path')
// }
