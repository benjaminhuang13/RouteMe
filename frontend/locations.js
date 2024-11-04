//const BACKEND_API = "http://localhost:8000/api/v1/customer_data/"; // used for testing locally
//const BACKEND_API = "http://50.17.3.254/api/v1/customer_data/"; // used for deploying to EC2 in proj1
//const BACKEND_API = "http://localhost:8800/api/v1/customer_data/"; // used for testing containerized app
// const BACKEND_API = "https://routemeback.benyellow.com/api/v1/customer_data/";
// const BACKEND_API = "routeme-alb-1630067429.us-east-1.elb.amazonaws.com/routeme-back/api/v1/customer_data/";
// const BACKEND_API = "http://localhost:80/api/v1/customer_data/"; // used for testing local containerized app
//const BACKEND_API = "routeme-back/api/v1/customer_data/"; // this works with ECS deployment
const BACKEND_API = "http://backend.routeme3/api/v1/customer_data/"; // testing for Service Connect
const main = document.getElementById("customer_list_section");
const form = document.getElementById("form");
const checklist_buttons = document.getElementById("checklist_buttons");
const search = document.getElementById("query");
const saved_customers_list = document.getElementById("saved_customers_list");
const submit_new_customer_response = document.getElementById(
  "submit_new_customer_response"
);
const google_map = document.getElementById("google_map");

//const submit_new_customer_data = document.getElementById("submit_new_customer_data");
let saved_route = [];

let map;
let geocoder;
let marker;
let geocode_results;
const start_location_lat = 40.758116;
const start_location_long = -73.831308;
let lat_;
let lng_;
// Main Code
returnCustomerData(BACKEND_API);

async function returnCustomerData(url) {
  const div_checklist = document.createElement("div"); //creates div that holds the whoel checklist item
  div_checklist.setAttribute("class", "div_checklist");

  const response = await fetch(url + "all")
    .then((res) => res.json())
    .then(function (data) {
      data.forEach((customer) => {
        const div_card = document.createElement("div");
        div_card.innerHTML = `
            <div class="div_checklist_item" id="checkbox-${customer._id}">
              <input class="customer_list_checkbox" type="checkbox" name="${customer.name}" id="${customer._id}">
                <p class="customer_list_addr"><strong>Name: </strong>${customer.name}</p>
                <p class="customer_list_addr"><strong>Address: </strong>${customer.street_addr}</p>
                <p class="customer_list_addr"><strong></strong>${customer.city}, ${customer.state} ${customer.zip}</p>
                <p class="customer_list_addr"><a href="#" onclick="editCustomer('${customer._id}', '${customer.name}','${customer.street_addr}','${customer.city}','${customer.state}','${customer.zip}')"> <strong>Edit</strong></a> 
                <p class="customer_list_addr"><a href="#" onclick="deleteCustomer('${customer._id}')"> <strong>Delete</strong></a></p>
          </div>
        `;
        div_checklist.appendChild(div_card);
      });
    });

  const route_button_div = document.createElement("div");
  route_button_div.setAttribute("class", "route_button_div");

  const add_to_route = document.createElement("button");
  add_to_route.innerHTML = "Add to Route";
  add_to_route.setAttribute("class", "add_to_route_button");
  add_to_route.onclick = function () {
    checked_customers = getCheckedBoxes();
    returnSavedCustomers(checked_customers);
  };

  const clear_route = document.createElement("button");
  clear_route.innerHTML = "Clear Route";
  clear_route.setAttribute("class", "clear_route_button");
  clear_route.onclick = function () {
    saved_route = [];
    returnSavedCustomers([]);
    console.log("Saved Route has been cleared: " + saved_route);
  };

  const gen_route_button = document.createElement("button");

  gen_route_button.innerHTML = "Generate Route";
  gen_route_button.setAttribute("class", "gen_route_button");
  gen_route_button.onclick = function () {
    generate_route(saved_route);
  };

  const save_customer_data_btn = document.getElementById(
    "save_customer_data_btn"
  );
  const input_customer_name = document.getElementById("input_customer_name");
  const input_street_addr = document.getElementById("input_street_address");
  const input_city = document.getElementById("input_city");
  const input_state = document.getElementById("input_state");
  const input_zip = document.getElementById("input_zip");
  const input_country = document.getElementById("input_country");

  save_customer_data_btn.addEventListener("click", (e) => {
    e.preventDefault(); //stops the form from submitting in the traditional way, which would refresh the page.
    submit_new_customer(
      input_customer_name.value,
      input_street_addr.value,
      input_city.value,
      input_state.value,
      parseInt(input_zip.value),
      input_country.value
    );
  });

  main.appendChild(div_checklist);
  checklist_buttons.appendChild(add_to_route);
  checklist_buttons.appendChild(clear_route);
  checklist_buttons.appendChild(gen_route_button);
}

async function initMap() {
  //https://jsfiddle.net/gh/get/library/pure/googlemaps/js-samples/tree/master/dist/samples/geocoding-simple/jsfiddle
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("google_map"), {
    center: { lat: 40.7647, lng: -73.8307 },
    zoom: 14,
  });
  geocoder = new google.maps.Geocoder();
  marker = new google.maps.Marker({
    map,
  });
}

async function submit_new_customer(
  name,
  street_addr,
  city,
  state,
  zip,
  country
) {
  await geocode({
    address: street_addr + ", " + city + " ," + state + " " + zip,
  });
  const test = String(geocode_results.geometry.location);

  const regex = /\(([^,]+), ([^,]+)\)/;
  const match = test.match(regex);

  if (match) {
    lat_ = parseFloat(match[1]);
    lng_ = parseFloat(match[2]);
    console.log(test + ` =>  Latitude: ${lat_}, Longitude: ${lng_}`);
  }
  console.log("After Geocode " + lat_ + "" + lng_);
  console.log(BACKEND_API + "new");
  const response = await fetch(BACKEND_API + "new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${name}`,
      street_addr: `${street_addr}`,
      city: `${city}`,
      state: `${state}`,
      zip: parseInt(zip),
      country: `${country}`,
      lat: parseFloat(lat_),
      long: parseFloat(lng_),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      submit_new_customer_response.innerHTML = `<p>Successfully added ${name}</p>`;
      location.reload();
    });
}

function returnSavedCustomers(checked_customers_list) {
  saved_customers_list.innerHTML = `<div>List of Saved Customers</div>`; //removes old rendered list
  saved_route = saved_route.concat(checked_customers_list);
  saved_route = [...new Set(saved_route)]; // delete duplicates
  const div_saved_checklist = document.createElement("div"); //creates div that holds the whoel checklist item
  div_saved_checklist.setAttribute("class", "div_checklist");
  console.log("Return Saved Customers");
  console.log(saved_route);

  saved_route.forEach((id) => {
    console.log("Fetching " + BACKEND_API + "customer/" + id);
    fetch(BACKEND_API + "customer/" + id)
      .then((res) => res.json())
      .then(function (data) {
        data.forEach((customer) => {
          const div_card = document.createElement("div");
          div_card.innerHTML = `
                <div class="div_checklist_item">
                    <p class="customer_list_addr"><strong>Name: </strong>${customer.name}</p>
                    <p class="customer_list_addr"><strong>Address: </strong>${customer.street_addr}</p>
                    <p class="customer_list_addr"><strong></strong>${customer.city}, ${customer.state} ${customer.zip}</p>
              </div>
            `;
          div_saved_checklist.appendChild(div_card);
        });
      });
    saved_customers_list.appendChild(div_saved_checklist);
  });
}

// TODO: add search bar back by uncommenting in the index.HTML file
// form.addEventListener("submit", (e) => {
//   e.preventDefault(); //stops the form from submitting in the traditional way, which would refresh the page.
//   main.innerHTML = ""; //clears any existing content in the main element.

//   const searchItem = search.value; //retrieves the value from the search input field.

//   if (searchItem) {
//     //If searchItem is not empty, it proceeds to call the returnMovies function with a URL constructed from a base SEARCHAPI and the search term.

//     let results = search_customer_db(searchItem);
//     results = customer_data2;
//     returnCustomerData(results);
//     search.value = ""; // resets search field
//   } else {
//     returnCustomerData(customer_data);
//     console.log("Nothing inputted in search");
//   }
// });

function getCheckedBoxes() {
  let checkboxes = document.getElementsByClassName("customer_list_checkbox");
  let checked_customer_obj_id_list = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      console.log("Found checked customer: " + checkboxes[i].id);
      checked_customer_obj_id_list.push(checkboxes[i].id);
    }
  }
  console.log(
    "Returning customer_obj_Id of checked customers: " +
      checked_customer_obj_id_list
  );
  return checked_customer_obj_id_list;
}

// TODO: make it search database for customers with keyword
function search_customer_db(searchItem) {
  console.log("Searching customer datatbase");
  return customer_data;
}

async function generate_route(list_of_customers) {
  console.log(
    "generating route for " +
      list_of_customers +
      ". length: " +
      list_of_customers.length
  );
  if (list_of_customers.length === 0) {
    console.log("list of customers is empty");
    return;
  }
  let list_of_locations = [];
  let list_of_coords = [];
  for (var i = 0; i < list_of_customers.length; i++) {
    let temp_location = {
      location: {
        latLng: {
          latitude: 0,
          longitude: 0,
        },
      },
    };
    // GETS lat and long from MongoDB for each customer in the list_of_customers
    await fetch(BACKEND_API + "customer/" + list_of_customers[i], {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(function (data) {
        console.log(
          "customer obj Id: " +
            list_of_customers[i] +
            " got lat: " +
            data[0].lat
        );
        console.log(
          "customer obj Id: " +
            list_of_customers[i] +
            " got long: " +
            data[0].long
        );
        temp_location.location.latLng.latitude = data[0].lat;
        temp_location.location.latLng.longitude = data[0].long;
        list_of_coords.push({ lat: data[0].lat, long: data[0].long });
      });
    list_of_locations.push(temp_location);
  }
  console.log("list_of_locations: " + JSON.stringify(list_of_locations));
  console.log("list_of_coords: " + JSON.stringify(list_of_coords));

  // GETS route for the list_of_customers from Google Route API
  await fetch(BACKEND_API + "gen_route", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(list_of_locations),
  })
    .then((res) => res.json())
    .then(function (route_data) {
      console.log(
        "Response for gen route api: " + JSON.stringify(route_data.length)
      );
      console.log(JSON.stringify(route_data));
      if (route_data.length > 0) {
        const encoded_polyline =
          route_data[0].routes[0].polyline.encodedPolyline;
        const totalDistanceMeters = JSON.stringify(
          route_data[0].routes[0].distanceMeters
        );
        const totalDurationSeconds = parseInt(
          route_data[0].routes[0].duration.seconds
        );
        const warnings_list = JSON.stringify(route_data[0].routes[0].warnings);
        const travelAdvisory = JSON.stringify(
          route_data[0].routes[0].travelAdvisory
        );
        const locallizedValues_dist = JSON.stringify(
          route_data[0].routes[0].localizedValues.distance.text
        );
        const locallizedValues_duration = JSON.stringify(
          route_data[0].routes[0].localizedValues.duration.text
        );

        const legs = route_data[0].routes[0].legs;

        console.log(legs);

        console.log(encoded_polyline);
        console.log(
          "ENCODED POLYLINE:\n" +
            JSON.stringify(decodePolyline(encoded_polyline))
        );

        //map.addPolyline();
        updateMap(decodePolyline(encoded_polyline));
      }
    });
}

function updateMap(decoded_polyline) {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < decoded_polyline.length; i++) {
    bounds.extend(decoded_polyline[i]);
  }
  map = new google.maps.Map(document.getElementById("google_map"), {
    zoom: 14,
    center: bounds.getCenter(),
  });
  console.log(typeof decoded_polyline);
  const polyline = new google.maps.Polyline({
    path: decoded_polyline,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });
  polyline.setMap(map);
}

function decodePolyline(encoded) {
  if (!encoded) {
    return [];
  }
  var poly = [];
  var index = 0,
    len = encoded.length;
  var lat = 0,
    lng = 0;

  while (index < len) {
    var b,
      shift = 0,
      result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result = result | ((b & 0x1f) << shift);
      shift += 5;
    } while (b >= 0x20);

    var dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result = result | ((b & 0x1f) << shift);
      shift += 5;
    } while (b >= 0x20);

    var dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    var p = {
      lat: lat / 1e5,
      lng: lng / 1e5,
    };
    poly.push(p);
  }
  return poly;
}

async function geocode(request) {
  clear();
  await geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
      //map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      // responseDiv.style.display = "block";
      // response.innerText = JSON.stringify(result, null, 2);
      console.log(
        "Geocoded " +
          request.address +
          " => " +
          JSON.stringify(results[0].geometry.location, null, 2)
      );
      // geocode_results = results;
      // console.log("results" + JSON.stringify(results[0]));
      //console.log("geometry " + JSON.stringify(results[0].geometry));
      // console.log("location " + geocode_results[0].geometry.location);
      geocode_results = results[0];
      return results[0];
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

function clear() {
  marker.setMap(null);
  //responseDiv.style.display = "none";
}

function deleteCustomer(customerObjId) {
  console.log("deleteCustomer function called for Id:" + customerObjId);
  fetch(BACKEND_API + "customer/" + customerObjId, {
    method: "DELETE",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
}

function editCustomer(customerObjId, name, st_addr, city, state, zip) {
  console.log(
    "editCustomer function called for " + name + " Id:" + customerObjId
  );
  const element = document.getElementById("checkbox-" + customerObjId);
  const inputNameId = "input_name" + name;
  const inputSt_addrId = "input_staddr" + st_addr;
  const inputCityId = "input_city" + city;
  const inputStateId = "input_state" + state;
  const input_ZipId = "input_zip" + zip;

  element.innerHTML = `
  <div class='edit_div'>
    <p class='edit_p'> <strong>Editing</strong></p>
    <p> <strong>Customer Name</strong> <input class='edit_input' type='text' id='${inputNameId}' value='${name}'> </input> </p>
    <p> <strong>Street Address</strong> <input class='edit_input' type='text' id='${inputSt_addrId}' value='${st_addr}'> </input> </p>
    <p> <strong>City</strong> <input class='edit_input' type='text' id='${inputCityId}' value='${city}'> </input> </p>
    <p> <strong>State</strong> <input class='edit_input' type='text' id='${inputStateId}' value='${state}'> </input> </p>
    <p> <strong>Zip</strong> <input class='edit_input' type='text' id='${input_ZipId}' value='${zip}'> </input> </p>
    <p class='edit_p'> <a href="#" class='edit_save_btn' onclick="saveCustomer('${customerObjId}', '${inputNameId}', '${inputSt_addrId}', '${inputCityId}', '${inputStateId}', '${input_ZipId}')"> <strong>Save</strong></$></p>
    <div>
  `;
}

function saveCustomer(
  customerObjId,
  inputNameId,
  inputSt_addrId,
  inputCityId,
  inputStateId,
  input_ZipId
) {
  console.log("saveCustomer function called");
  const name = document.getElementById(inputNameId).value;
  const street_addr = document.getElementById(inputSt_addrId).value;
  const city = document.getElementById(inputCityId).value;
  const state = document.getElementById(inputStateId).value;
  const zip = document.getElementById(input_ZipId).value;

  fetch(BACKEND_API + "customer/" + customerObjId, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerObjId: customerObjId,
      name: name,
      street_addr: street_addr,
      city: city,
      state: state,
      zip: zip,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
}
