 // This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([40.832, -73.934], 10);
// Add base layer
L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
  maxZoom: 15
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'hajoc903'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM food_scrap_drop_off_locations_in_nyc');

// Create style for the data
var style = new carto.style.CartoCSS(`
 #layer {
  marker-width: 10;
  marker-fill: #1f8600;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/marker-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

// Add style to the data
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style, {
  featureClickColumns: ['dropsite', 'serviced_by', 'hours_from', 'hours_to']
});

var sidebar = document.querySelector('.sidebar-feature-content');
layer.on('featureClicked', function (event) {
  // Create the HTML that will go in the sidebar. event.data has all the data for 
  // the clicked feature
  //
  // This is exactly like the way we do it in the popups example:
  //
  //   https://glitch.com/edit/#!/carto-popups
  var content = '<strong>Drop Site: </strong>' +  event.data['dropsite'] + '<br><br>'
  content += '<strong>Service Provider: </strong>'  + event.data['serviced_by'] + '<br><br>'
  content += '<strong>Hours: </strong>' + event.data['hours_from'] + '-' + event.data['hours_to'] ;
  
  // Then put the HTML inside the sidebar. Once you click on a feature, the HTML
  // for the sidebar will change.
  sidebar.innerHTML = content;
});

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

// Make SQL to get the summary data you want
var countSql = 'SELECT COUNT(*) FROM food_scrap_drop_off_locations_in_nyc';

// Request the data from Carto using fetch.
// You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
fetch('https://hajoc903.carto.com/api/v2/sql/?q=' + countSql)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // All of the data returned is in the response variable
    console.log(data);

    // The sum is in the first row's sum variable
    var count = data.rows[0].count;

    // Get the sidebar container element
    var sidebarContainer = document.querySelector('.sidebar-feature-content');

    // Add the text including the sum to the sidebar
    sidebarContainer.innerHTML = '<div>There are ' + count + ' drop sites on this map</div>';
  });



/*
 * A function that is called any time a checkbox changes
 */
function handleCheckboxChange() {
  // First we find every checkbox and store them in separate variables
  var brooklynCheckbox = document.querySelector('.brooklyn-checkbox');
  var queensCheckbox = document.querySelector('.queens-checkbox');
  var statenIslandCheckbox = document.querySelector('.statenIsland-checkbox');
  var bronxCheckbox = document.querySelector('.bronx-checkbox');
  var manhattanCheckbox = document.querySelector('.manhattan-checkbox');
  
    // Logging out to make sure we get the checkboxes correctly
    console.log('brooklyn:', brooklynCheckbox.checked);
    console.log('queens:', queensCheckbox.checked);
    console.log('statenIsland:', statenIslandCheckbox.checked);
    console.log('bronx:', bronxCheckbox.checked);
    console.log('manhattan:', manhattanCheckbox.checked);
  
   // Create an array of all of the values corresponding to checked boxes.
  // If a checkbox is checked, add that filter value to our array.
  var borough = [];
    if (brooklynCheckbox.checked) {

      borough.push("'Brooklyn'");
    }
    if (queensCheckbox.checked) {
      borough.push("'Queens'");
    }
    if (statenIslandCheckbox.checked) {
      borough.push("'Staten Island'");
    }
     if (bronxCheckbox.checked) {
      borough.push("'Bronx'");
    }
     if (manhattanCheckbox.checked) {
      borough.push("'Manhattan'");
    }
// console.log(borough)
  
     // If there are any values to filter on, do an SQL IN condition on those values,
  // otherwise select all features
  if (borough.length) {
       var sql = "SELECT * FROM food_scrap_drop_off_locations_in_nyc WHERE borough IN (" + borough.join(',') + ")";
    console.log(sql);
    source.setQuery(sql);
  }
  else {
    source.setQuery("SELECT * FROM food_scrap_drop_off_locations_in_nyc");
  }
}

var zoomToDataButton = document.querySelector('.zoom-to-data-button');
  console.log(zoomToDataButton);
zoomToDataButton.addEventListener('click', function () {
  console.log('the button was clicked')
  map.setView([40.832, -73.934], 11.5);
});

var resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', function () {
  map.setView([40.832, -73.934], 10);
})

/*
 * Listen for changes on any checkbox
 */
var brooklynCheckbox = document.querySelector('.brooklyn-checkbox');
brooklynCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var queensCheckbox = document.querySelector('.queens-checkbox');
queensCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var statenIslandCheckbox = document.querySelector('.statenIsland-checkbox');
statenIslandCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var bronxCheckbox = document.querySelector('.bronx-checkbox');
bronxCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var manhattanCheckbox = document.querySelector('.manhattan-checkbox');
manhattanCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
 
