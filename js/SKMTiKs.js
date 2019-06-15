// todo list
// 1. add a gear adding tool that appends the gear to another gear rather than to the map - make sure it does not rotate.


var selectedgear = ""; // variable for gear that is selected - becomes id with a # at the beginning
var linedrawn = ""; // the variable for the line that was drawn

var x = Math.sin(2 * Math.PI / 3),
  y = Math.cos(2 * Math.PI / 3);
var offset = 0,
  speed = 4,
  start = Date.now();

  var map = d3.select("#map")
    .attr("width", 1600)
    .attr("height", 1600)
    .datum({
      radius: 8000
    });

  var mapdraw = d3.select("#mapdraw")
    .attr("width", 1600)
    .attr("height", 1600)
    .datum({
      radius: 8000
    });

  var defs = map.append('svg:defs');
  defs.append('svg:pattern')
      .attr('id', 'smoke')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', '200')
      .attr('height', '200')
      .append('svg:image')
      .attr('xlink:href', './images/smoke.png')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 200);

  defs.append('svg:pattern')
      .attr('id', 'stars')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', '200')
      .attr('height', '200')
      .append('svg:image')
      .attr('xlink:href', './images/stars.png')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 200);

  defs.append('svg:pattern')
      .attr('id', 'hline')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', '200')
      .attr('height', '1000')
      .append('svg:image')
      .attr('xlink:href', './images/hline.png')
      .attr('x', 0)
      .attr('y', 500)
      .attr('width', 200)
      .attr('height', 1000);

  defs.append('svg:pattern')
      .attr('id', 'hvline')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', '100')
      .attr('height', '100')
      .append('svg:image')
      .attr('xlink:href', './images/hvline.png')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', 100);


  // save function
  function savesvg() {
      //get svg element.
      var svg = document.getElementById("map");

      //get svg source.
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(svg);

      //add name spaces.
      if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      //convert svg source to URI data scheme.
      var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

      //set url value to a element's href attribute.
      document.getElementById("link").innerHTML = "<a href='" + url + "'>DOWNLOAD</a>";
      //you can download svg file by right click menu.
      }
  // end save function


  //Create the drag and drop behavior to set for the objects crated
  var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

  function dragstarted(d) {
    d3.select(this).raise().classed("active", true);
  }

  function dragged(d) {
    x=150; // to place in drawing
    y=150; // to place in drawing
    //console.log(d.x)

    if (d3.select(this).attr("id")[0] == "g" || d3.select(this).attr("id")[0] == "a") {
      d3.select(this)
        .datum({
          teeth: d.teeth,
          radius: d.radius,// sets the radius
          annulus: d.annulus, // makes gear inside
          x: d3.event.x, // present x coord
          y: d3.event.y // present y coord
          })
        .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")scale(.30)");
      }

      if (d3.select(this).attr("id")[0] == "r" || d3.select(this).attr("id")[0] == "c") {
        d3.select(this)
          .datum({
            teeth: d.teeth,
            radius: d.radius,// sets the radius
            annulus: d.annulus, // makes gear inside
            x: d3.event.x, // present x coord
            y: d3.event.y // present y coord
            })
          .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")scale(.30)");
      }

      if (d3.select(this).attr("id")[0] == "b") {
        d3.select(this)
          .datum({
            teeth: d.teeth,
            radius: d.radius,// sets the radius
            annulus: d.annulus, // makes gear inside
            x: d3.event.x, // present x coord
            y: d3.event.y // present y coord
            })
          .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")scale(.30)");
      }

      if (d3.select(this).attr("id")[0] == "x") {
        d3.select(this)
          .datum({
            teeth: d.teeth,
            radius: d.radius,// sets the radius
            annulus: d.annulus, // makes gear inside
            x: d3.event.x, // present x coord
            y: d3.event.y // present y coord
            })
          .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")scale(-.1,-.30)");
      }

      selectedgear = "#" + d3.select(this).attr('id');
      //console.log(selectedgear);
      selectedgearD = d3.select(this).attr("d");
      //document.getElementById('message').innerHTML = this.attr;
      document.getElementById('mapdraw').innerHTML = "";
      d3.select("#mapdraw").append("path").attr("d", selectedgearD);
        //.attr("transform", "translate(" + x + "," + y + ")scale(.50)"); // draws gear in drawing canvas need to center... /handled in viewbox
    }

  function dragended(d) {
    d3.select(this).classed("active", false);
  }

// update selectedgear to variables in color fill and image fill

  function updategear(testvar) {
      if (selectedgear != "") {
        d3.select(selectedgear).attr("fill", testvar);
      }
  }

// add gear

  function addagear1(x,y,color,te,ra) {

    //console.log(te + " " + ra)
    map.append("path") //.append("g") // append a group
      .attr("class", "gear")
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra)*(-1),// sets the radius - negative 1 changes rotation
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })

      //.classed('draggable', true)
      .attr("d", gear)
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString()) // set id for specific gear at a random number
       // runs object throgh the info


  } // end add gear


  function addagear2(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("class", "gear")
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", gear)
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addagearbig(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("class", "gear")
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", biggear)
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addagear3(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("class", "gear")
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: true, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", ringgear)
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addescape(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("class", "gear")
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", escapegear)
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addescapetop(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("class", "gear")
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", escapegeartop)
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addratchet(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", ratchetgear)
      .attr("id", "r" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addclicker(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", clickergear)
      .attr("id", "c" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addclicker2(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(-.1,-.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", clickergear)
      .attr("id", "x" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear


  function addanchor(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", escapeanchor)
      .attr("id", "a" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addanchor2(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", escapeanchor2)
      .attr("id", "a" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addanchorbase(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(-.10)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", anchorbase)
      .attr("id", "b" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addstemend(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 60 v 36 h 40 v -36 h 60 v 100 h -160 v -100")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function mdspool(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 " + -ra + "A" + ra + " " + ra + " 0 0 0 0 " + ra + "A" + ra + " "
        + ra + " 0 0 0 0 " + -ra + "Z" + "M0 " + -50 + "A" + 50 + " " + 50 + " 0 0 0 0 "
        + 50 + "A" + 50 + " " + 50 + " 0 0 0 0 " + -50 + "Z"
        + " M74 -11 h 30 v 30 h -30 v -30")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function lgspool(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 " + -ra + "A" + ra + " " + ra + " 0 0 0 0 " + ra + "A" + ra + " "
        + ra + " 0 0 0 0 " + -ra + "Z" + "M0 " + -50 + "A" + 50 + " " + 50 + " 0 0 0 0 "
        + 50 + "A" + 50 + " " + 50 + " 0 0 0 0 " + -50 + "Z"
        + " M140 -11 h 30 v 30 h -30 v -30")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear


  function pendant(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 " + -ra + "A" + ra + " " + ra + " 0 0 0 0 " + ra + "A" + ra + " "
        + ra + " 0 0 0 0 " + -ra + "Z"
        + "M 0 -120 h 35 v 105 h -35 v -105"
        + "M 0 20 h 35 v 105 h -35 v -105"
        + "M 0 160 h 35 v 105 h -35 v -105")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function anchorsquare(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 140 v 2000 h -140 v -2000" // draw the box
          + "M 50 100 h 35 v 105 h -35 v -105"
          + "M 50 240 h 35 v 105 h -35 v -105"
          + "M 50 380 h 35 v 105 h -35 v -105"
          + "M 50 1500 h 35 v 105 h -35 v -105"
          + "M 50 1640 h 35 v 105 h -35 v -105"
          + "M 50 1780 h 35 v 105 h -35 v -105"
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function smspool(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 " + -ra + "A" + ra + " " + ra + " 0 0 0 0 " + ra + "A" + ra + " "
        + ra + " 0 0 0 0 " + -ra + "Z" + "M0 " + -50 + "A" + 50 + " " + 50 + " 0 0 0 0 "
        + 50 + "A" + 50 + " " + 50 + " 0 0 0 0 " + -50 + "Z")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addspool2(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 " + -ra + "A" + ra + " " + ra + " 0 0 0 0 " + ra + "A" + ra + " " + ra + " 0 0 0 0 " + -ra + "Z" + "M0 " + -25 + "A" + 25 + " " + 25 + " 0 0 0 0 " + 25 + "A" + 25 + " " + 25 + " 0 0 0 0 " + -25 + "Z")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addshortstem(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 80 v 90 h 160 v 60 h -160 v 90 h -80 v -240")
      //.attr("d", "M0 0 h 40 v 36 h 40 v -36 h 80 v 36 h 40 v -36 h 40 v 72 h -240 v -72")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear


  function addlongstem(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 80 v 90 h 320 v 60 h -320 v 90 h -80 v -240")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addanchstem(x,y,color,te,ra) { // in use as stem


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 500 h 140 v 35 h -140 v 629 h 455 v 35 h -455 v 332 h -80 v 35 h 80 h 210 v 35 h -210 v 96 h -160 v -1697")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function housestem(x,y,color,te,ra) { // in use as stem


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 500 h 140 v 35 h -140 h -80 v 35 h 80 v 594 h 385 v 35 h -385 h -80 v 35 h 80 v 297 v 35 h 210 v 35 h -210 h -80 v 35 h 80 v 261 h -160 v -828 h 105 v -150 h -35 v 50 h -70 v -969")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear


  function housesidestem(x,y,color,te,ra) { // in use as stem


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 300 h 140 v 35 h -140 h -80 v 35 h 80 v 594 h 140 v 35 h -140 h -80 v 35 h 80 v 594 h 140 v 35 h -140 h -80 v 35 h 80 v 297 v 35 h 0 v 35 h 0 h -80 v 35 h 80 v 261 h -160 v -828 h 105 v -150 h -35 v 50 h -70 v -1433")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function big2322stem(x,y,color,te,ra) { // in use as stem


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 230 h 140 v 35 h -140 h -80 v 35 h 80 v 665 h 140 v 35 h -140 h -80 v 35 h 80 v 665 h 140 v 35 h -140 h -80 v 35 h 80 v 476 v 35 h 140 v 35 h -140 h -80 v 35 h 80 v 261 h -160 v -1006 h 105 v -150 h -35 v 50 h -70 v -1505")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function big2323stem(x,y,color,te,ra) { // in use as stem


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 300 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 300 h -160 v -464 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -105")
      // longer version for motor stability .attr("d", "M0 0 h 160 v 300 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 121 h -55 v -50 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -105")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function big232stem(x,y,color,te,ra) { // in use as stem


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 100 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 300 h -160 v -464 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -256")
      // longer version for motor stability .attr("d", "M0 0 h 160 v 300 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 121 h -55 v -50 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -105")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function bigshortstem(x,y,color,te,ra) { // in use as stem


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 300 h 140 v 35 h -140 h -80 v 35 h 80 v 315 h -80 v 35 h 80 v 315 h 140 v 35 h -140 h -80 v 35 h 80 v 50 h -160 v -215 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -105")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear


    function bigmotorstem(x,y,color,te,ra) { // in use as stem


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 160 v 100 h -80 v 35 h 80 v 297.5 h 140 v 70 h -140 v 17.5 v 315 h -80 v 35 h 80 v 226.5 h 385 v 70 h -385 v 52.5 h -80 v 35 h 80 v 227 v 17.5 h 210 v 69.5 h -210 h -80 v 35 h 80 v 121 h -55 v -50 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -256")
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear


    function hookstem(x,y,color,te,ra) { // in use as stem


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 160 v 300 h 140 v 35 h -140 h -80 v 35 h 80 v 314 h -80 v 35 h 80 v 315 h 220 v 35 h 35 v -35 h 35 v 121 h -345 v -50 h -35 v 50 h -70 v -215 h 105 v -150 h -35 v 50 h -70 v -635 h 105 v -150 h -35 v 50 h -70 v -105")
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function bigmountbar(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 v -150 h 1474" //
              + " v 150 h -351 v -50 h -35 v 50 h -702 v -50 h -35 v 50 h -351" //
              + " M80 -80 h 35 v 35 h -35 v -35" //
              + " M1354 -80 h 35 v 35 h -35 v -35" //
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function motormountbar(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 v -150 h 1474" //
              + " v 150 h -351 v -50 h -35 v 50 h -684.5 v -50 h -70 v 50 h -333.5" //
              + " M80 -80 h 35 v 35 h -35 v -35" //
              + " M1354 -80 h 35 v 35 h -35 v -35" //
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function bigplate(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 1474 v 1474 h -1474 v -1474" // draw the box
              + " M351 351 h 35 v 35 h -35 v -35" // draw the top left pinhole
              + " M1088 351 h 35 v 35 h -35 v -35" // draw the top right pinhole
              + " M1088 1088 h 35 v 35 h -35 v -35" // draw the bottom right
              + " M351 1088 h 35 v 35 h -35 v -35" // draw the bottom left hole
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function bigplatepuzzle(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 318.5 v 50 h -50 v 50 h 200 v -50 h -50 v -50 h 318.5 h 318.5 v 50 h -50 v 50 h 200 v -50 h -50 v -50 h 318.5 v 318.5 h -50 v -50 h -50 v 200 h 50 v -50 h 50 v 318.5 v 318.5 h -50 v -50 h -50 v 200 h 50 v -50 h 50 v 318.5 h -318.5 v 50 h 50 v 50 h -200 v -50 h 50 v -50 h -318.5 h -318.5 v 50 h 50 v 50 h -200 v -50 h 50 v -50 h -318.5 v -318.5 h -50 v 50 h -50 v -200 h 50 v 50 h 50 v -318.5 v -318.5 h -50 v 50 h -50 v -200 h 50 v 50 h 50 v -318.5" // draw the box
              + " M351 351 h 35 v 35 h -35 v -35" // draw the top left pinhole
              + " M1088 351 h 35 v 35 h -35 v -35" // draw the top right pinhole
              + " M1088 1088 h 35 v 35 h -35 v -35" // draw the bottom right
              + " M351 1088 h 35 v 35 h -35 v -35" // draw the bottom left hole
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function smallplate(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 737 v 737 h -737 v -737" // draw the box
              + " M351 351 h 35 v 35 h -35 v -35" // draw the top left pinhole
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function smallplatepuzzle(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 318.5 v 50 h -50 v 50 h 200 v -50 h -50 v -50 h 318.5 v 318.5 h -50 v -50 h -50 v 200 h 50 v -50 h 50 v 318.5 h -318.5 v 50 h 50 v 50 h -200 v -50 h 50 v -50 h -318.5 v -318.5 h -50 v 50 h -50 v -200 h 50 v 50 h 50 v -318.5" // draw the box
              + " M351 351 h 35 v 35 h -35 v -35" // draw the top left pinhole
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function weightbox(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 737 v 737 h -737 v -737" // draw the box
              + " M351 351 h 35 v 35 h -35 v -35" // draw the top left pinhole
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

    function motorplate(x,y,color,te,ra) {


      map.append("path") //.append("g") // append a group
        .attr("fill", color) // sets fill color
        .style('stroke', 'black')
        .style('stroke-width', '1.8')
        .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .datum({
          teeth: parseFloat(te),
          radius: parseFloat(ra),// sets the radius
          annulus: false, // makes gear inside
          x: x, // present x coord
          y: y // present y coord
        })
        //.classed('draggable', true)
        .attr("d", "M0 0 h 737 v 2211 h -2211 v -1474 h 1474 v -737" // draw the box
              + " M333.5 333.5 h 70 v 70 h -70 v -70" // draw the top axel hole
              + " M333.5 997.5 h 70 v 70 h -70 v -70" // draw the middle axel hole
              + " M333.5 1399.5 h 70 v 70 h -70 v -70" // draw the bottom axel hole
              + " M-386 1088 h 35 v 35 h -35 v -35" // draw the top right square hole.
              + " M-386 1825 h 35 v 35 h -35 v -35" // draw the top right square hole.
              + " M-1123 1088 h 35 v 35 h -35 v -35" // draw the top right square hole.
              + " M-1123 1825 h 35 v 121 h -35 v -121" // draw the top right square hole.
            ) // end of the box
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

    } // end add gear

  function addplate(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 1300 v 2000 h -1300 v -2000" // draw the box
            + " M100 100 h 35 v 35 h -35 v -35" // draw the left pinhole
            + " M1165 100 h 35 v 35 h -35 v -35" // draw the right pinhole
            + " M633 518 h 35 v 35 h -35 v -35" // draw the top axel hole
            + " M633 1182 h 35 v 35 h -35 v -35" // draw the middle axel hole
            + " M633 1584 h 35 v 35 h -35 v -35" // draw the bottom axel hole
            + " M50 1542 h 200 v 44 h -200 v -44" // draw the left axel hole
            + " M1050 1542 h 200 v 44 h -200 v -44" // draw the right axel hole
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function houseplate(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 2200 v 2500 h -2200 v -2500" // draw the box
            + " M1675 554 h 35 v 35 h -35 v -35" // draw the left pinhole
            + " M1675 1218 h 35 v 35 h -35 v -35" // draw the left pinhole
            + " M1675 1882 h 35 v 35 h -35 v -35" // draw the right pinhole
            + " M776 1218 h 35 v 35 h -35 v -35" // draw the top axel hole
            + " M776 1882 h 35 v 35 h -35 v -35" // draw the middle axel hole
            + " M776 2284 h 35 v 35 h -35 v -35" // draw the bottom axel hole
            //+ " M150 2317 h 200 v 44 h -200 v -44" // draw the left axel hole
            + " M1725 2317 h 200 v 44 h -200 v -44" // draw the right axel hole
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addaxel(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 50 v -200 h 20 v -40 h -20 v-80" //
            + " h 200 v 320 h 800 v -320 h 200 v 80 h -20 v 40 h 20 v 200" //
            + " h 50 v 160 h -635 v -80 h -30 v 80 h -635" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function houseaxel(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 50" //
            + " h 200 h 893 h 482 v -320 h 200 v 80 h -20 v 40 h 20 v 200" //
            + " v 160 h -215 v -80 h -35 v 80 h -864 v -80 h -35 v 80 h -676" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function housegaxel(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 1334" //
            + "" //
            + " v 160 h -200 v -80 h -35 v 80 h -864 v -80 h -35 v 80 h -200" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function bigaxel2(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 1172" //
            + "" //
            + " v 160 h -200 v -80 h -35 v 80 h -702 v -80 h -35 v 80 h -200" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function thickaxel2(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 1172" //
            + "" //
            + " v 160 h -200 v -80 h -35 v 80 h -684.5 v -80 h -70 v 80 h -182.5" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function thickaxel3(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 1909" //
            + "" //
            + " v 160 h -200 v -80 h -35 v 80 h -702 v -80 h -35 v 80 h -684.5 v -80 h -70 v 80 h -182.5" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function bigaxel3(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 1909" //
            + "" //
            + " v 160 h -200 v -80 h -35 v 80 h -702 v -80 h -35 v 80 h -702 v -80 h -35 v 80 h -200" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function bigaxel4(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -160 h 2646" //
            + "" //
            + " v 160 h -200 v -80 h -35 v 80 h -702 v -80 h -35 v 80 h -702 v -80 h -35 v 80 h -702 v -80 h -35 v 80 h -200" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function housemountbar(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -100 h 1734" //
            + " v 100 h -400 v -50 h -35 v 50 h -864 v -50 h -35 v 50 h -400" //
            + " M80 -80 h 35 v 35 h -35 v -35" //
            + " M1614 -80 h 35 v 35 h -35 v -35" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function housemountblock(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -100 h 200 v 100 h -200" //
            + " M80 -80 h 35 v 35 h -35 v -35" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function tinystem(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 v -35 h 120 v 35 h -120" //
            //+ " M80 -80 h 35 v 35 h -35 v -35" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function anchormiddle(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 70 v -35 h 70 v 2035 h -70 v -35 h -70 v -105 h 35 v 35 h 35 v -70 h -70 v -105 h 35 v 35 h 35 v -70 h -70 v -105 h 35 v 35 h 35 v -70 v -1195 h -35 v 35 h -35 v -105 h 70 v -70 h -35 v 35 h -35 v -105 h 70 v -70 h -35 v 35 h -35 v -105" //
            //+ " M80 -80 h 35 v 35 h -35 v -35" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function fastener(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 80 v 80 h -80 v -80" //
            + " M22 22 h 34 v 35 h -34 v -35" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function tfastener(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 80 v 80 h -80 v -80" //
            + " M22 22 h 33.5 v 34 h -33.5 v -34" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function bigfastener(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 120 v 120 h -120 v -120" //
            + " M23 23 h 68 v 70 h -68 v -70" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function thicktest(x,y,color,te,ra) {


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 34 v 34 h 34 v -34 h 36 v 36 h 36 v -36 h 38 v 38 h 38 v -38" //
            + " h 50 v 70 h -266 v -70" //
          ) // end of the box
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  function addanchstem2(x,y,color,te,ra) { // not in use


    map.append("path") //.append("g") // append a group
      .attr("fill", color) // sets fill color
      .style('stroke', 'black')
      .style('stroke-width', '1.8')
      .attr("transform", "translate(" + x + "," + y + ")scale(.30)") // places gear from center
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .datum({
        teeth: parseFloat(te),
        radius: parseFloat(ra),// sets the radius
        annulus: false, // makes gear inside
        x: x, // present x coord
        y: y // present y coord
      })
      //.classed('draggable', true)
      .attr("d", "M0 0 h 160 v 90 h 320 v 60 h -320 v 610 v 60 v 145 v 80 v 145 h 320 v 60 h -320 v 90 h -160 v -630 h 80 v -80 h -80 v -630")
      .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString())

  } // end add gear

  // end gear additions


  // gear function
    function gear(d) {
      var n = d.teeth,
        r2 = Math.abs(d.radius),
        r0 = r2 - 30, //teeth depth - was at 8
        r1 = r2 + 20, //teeth depth - was at 8
        r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 25, // inside axel diameter
        da = Math.PI / n,
        a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
        i = -1,
        path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
      while (++i < n) path.push(
        "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
        "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
        "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
        "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
        "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
        "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
      path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
      return path.join("");
    }

      // gear function
      function ringgear(d) {
        var n = d.teeth,
          r2 = Math.abs(d.radius),
          r0 = r2 - 30, //teeth depth - was at 8
          r1 = r2 + 20, //teeth depth - was at 8
          r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 105) : 25, // inside axel diameter was 45) 25
          da = Math.PI / n,
          a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
          i = -1,
          path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
        while (++i < n) path.push(
          "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
          "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
          "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
          "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
          "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
          "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
        path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
        return path.join("");
      }

    function biggear(d) {
      var n = d.teeth,
        r2 = Math.abs(d.radius),
        r0 = r2 - 30, //teeth depth - was at 8
        r1 = r2 + 20, //teeth depth - was at 8
        r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 50, // inside axel diameter
        da = Math.PI / n,
        a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
        i = -1,
        path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
      while (++i < n) path.push(
        "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
        "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
        "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
        "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
        "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
        "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
      path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
      return path.join("");
    }


    // escape gear function
      function escapegear(d) {
        var n = d.teeth,
          r2 = Math.abs(d.radius),
          r0 = r2 - 50, //teeth depth - was at 8
          r1 = r2 + 25, //teeth depth - was at 8
          r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 50, // inside axel diameter
          r4 = r2 - 2,
          da = Math.PI / n,
          a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
          i = -1,
          path = ["M", r4 * Math.cos(a0), ",", r4 * Math.sin(a0)]; // beginning of path
        while (++i < n) path.push(
          "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
          //"L", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
          "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
          //"L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
          "L", r4 * Math.cos(a0 += da / 2), ",", r4 * Math.sin(a0));
        path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
        return path.join("");
      }

      // escape gear function
        function escapegeartop(d) {
          var n = d.teeth,
            r2 = Math.abs(d.radius),
            r0 = r2 - 50, //teeth depth - was at 8
            r1 = r2 + 25, //teeth depth - was at 8
            r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 170, // inside axel diameter
            r4 = r2 - 2,
            da = Math.PI / n,
            a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
            i = -1,
            path = ["M", r4 * Math.cos(a0), ",", r4 * Math.sin(a0)]; // beginning of path
          while (++i < n) path.push(
            "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
            //"L", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
            "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
            //"L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
            "L", r4 * Math.cos(a0 += da / 2), ",", r4 * Math.sin(a0));
          path.push("m 10 80", "h 35 v 35 h -35 v -35");
          path.push("m -20 404", "h 35 v 35 h -35 v -35");
          path.push("M 190 10", "h 35 v 35 h -35 v -35");
          path.push("M -220 -20", "h 35 v 35 h -35 v -35");
          path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
          return path.join("");
        }

      // escape gear function
        function escapegearbackup(d) {
          var n = d.teeth,
            r2 = Math.abs(d.radius),
            r0 = r2 - 50, //teeth depth - was at 8
            r1 = r2 + 25, //teeth depth - was at 8
            r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 25, // inside axel diameter
            r4 = r2 - 2,
            da = Math.PI / n,
            a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
            i = -1,
            path = ["M", r4 * Math.cos(a0), ",", r4 * Math.sin(a0)]; // beginning of path
          while (++i < n) path.push(
            "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
            //"L", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
            "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
            //"L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
            "L", r4 * Math.cos(a0 += da / 2), ",", r4 * Math.sin(a0));
          path.push("m 10 80","a 15 15 0 0 1 0 40", "a 15 15 0 0 1 0 -40", "Z");
          path.push("m -20 394","a 15 15 0 0 1 0 40", "a 15 15 0 0 1 0 -40", "Z");
          path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
          return path.join("");
        }

      // ratchet gear function
        function ratchetgear(d) {
          var n = d.teeth,
            r2 = Math.abs(d.radius),
            r0 = r2 - 45, //teeth depth - was at 8
            r1 = r2 + 10, //teeth depth - was at 8
            r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 25, // inside axel diameter
            r4 = r2 - 2,
            da = Math.PI / n,
            a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
            i = -1,
            path = ["M", r4 * Math.cos(a0), ",", r4 * Math.sin(a0)]; // beginning of path
          while (++i < n) path.push(
            "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
            //"L", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
            "L", r1 * Math.cos(a0), ",", r1 * Math.sin(a0),
            "A", r4, ",", r4, " 0 0,1 ", r4 * Math.cos(a0 += da), ",", r4 * Math.sin(a0));
            //"L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
            //"L", r4 * Math.cos(a0 += da), ",", r4 * Math.sin(a0));
          path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
          return path.join("");
        }

        // clicker function
          function clickergear(d) {
            var n = d.teeth,
              r2 = Math.abs(d.radius),
              r0 = r2 - 45, //teeth depth - was at 8
              r1 = r2 + 10, //teeth depth - was at 8
              r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 25, // inside axel radius
              r4 = r2 - 2,
              da = Math.PI / n,
              a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
              i = -1,
              path = ["M", r4 * Math.cos(a0), ",", r4 * Math.sin(a0)]; // beginning of path
            //while (++i < n) path.push(
              path.push("A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0));
              //"L", r1 * Math.cos(a0 += da / 2), ",", r1 * Math.sin(a0),
              path.push("L", r1 * Math.cos(a0), ",", r1 * Math.sin(a0));
              path.push("L", r1 * Math.cos(a0), ",", r1 * Math.sin(a0));
              path.push("L", (path[path.length -3]), ",", (path[path.length -1] -= 85));
              path.push("L", (path[path.length -3] -= 200), ",", (path[path.length -1]));
              path.push("L", (path[1]), ",", (path[3]));
              path.push("L", (path[1]), ",", (path[3]));
              //path.push("A", 50, ",", 50, " 0 0,0 0,", 50);
              //path.push("A", r4, ",", r4, " 0 0,1 ", r4 * Math.cos(a0 += da), ",", r4 * Math.sin(a0));
              //"L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
              //"L", r4 * Math.cos(a0 += da), ",", r4 * Math.sin(a0));
              path.push("m 10 -60","a 15 15 0 0 1 0 48", "a 15 15 0 0 1 0 -48", "Z");
              //path.push("A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
            return path.join("");
          }

  // motion stuff

  // escape anchor function
    function escapeanchor(d) {  // ancor base in use
      var n = d.teeth,
        r2 = Math.abs(d.radius),
        r0 = r2 - 50, //teeth depth - was at 8
        r1 = r2 + 50, //teeth depth - was at 8
        r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 25, // inside axel diameter
        r4 = r2 - 2,
        da = Math.PI / n,
        db = Math.PI / (n/3), // just 5 spots along the teeth
        a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
        i = -1,
        b = -1,
        path = ["M", r1 * Math.cos(a0), ",", r1 * Math.sin(a0)]; // beginning of path
      while (++i < 11) path.push(
        "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0),
        "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0));
      // draw the inside
      path.push("L", r4 * Math.cos(a0), ",", r4 * Math.sin(a0));
      path.push("L", r0 * Math.cos(a0 += (db*.85)), ",", r0 * -Math.sin(a0));
      //path.push("M", r4 * Math.cos(a0), ",", r4 * Math.sin(a0));
      // move the cursor around the circle and save the positions
      var getcoords = [];
      while (++b < 6) getcoords.push(
        "M", r0 * Math.cos(a0 += db), ",", r0 * -Math.sin(a0));
      //console.log(getcoords[getcoords.length -4])
      // push the last position to the path
      path.push("L", getcoords[getcoords.length -3], ",", getcoords[getcoords.length -1]);
      //path.push("L", r4 * Math.cos(a0 += (db*.85)), ",", r4 * -Math.sin(a0));
      path.push("L", r1 * Math.cos(a0 += (db*.85)), ",", r1 * -Math.sin(a0));
      path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
      return path.join("");
    }


    function escapeanchor2(d) {
      var n = d.teeth,
        r2 = Math.abs(d.radius),
        r0 = r2 - 50, //teeth depth - was at 8
        r1 = r2 + 50, //teeth depth - was at 8
        r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 50, // inside axel diameter
        r4 = r2 - 2,
        da = Math.PI / n,
        db = Math.PI / (n/3), // just 5 spots along the teeth
        a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
        i1 = -1,
        i2 = -1,
        i3 = -1,
        i4 = -1,
        i5 = -1,
        i6 = -1,
        // da is the tooth length - adding it to a0 moves the start...
        path = ["M", r1 * Math.cos(a0 += (da*4)), ",", r1 * Math.sin(a0)]; // beginning of path
      while (++i1 < 6) path.push(
        "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0));
      //get the middle cords
          var midcords = [];
          while (++i2 < 10) midcords.push(
            "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0));
      path.push("L", (path[path.length -3] -= 200), ",", (path[path.length -1] += 2300));
      path.push("L", (path[path.length -3] -= 200), ",", (path[path.length -1]));
      // go to the last line in midcords
      path.push("L", midcords[midcords.length -3], ",", midcords[midcords.length -1]);
      // draw the rest
      while (++i3 < 6) path.push(
        "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0));
      // draw the inside
      path.push("L", r4 * Math.cos(a0), ",", r4 * Math.sin(a0));
      path.push("L", r0 * Math.cos(a0 -= (db*1.85)), ",", r0 * -Math.sin(a0));
      //path.push("M", r4 * Math.cos(a0), ",", r4 * Math.sin(a0));
      // move the cursor around the circle and save the positions
      var getcoords = [];
      while (++i4 < 6) getcoords.push(
        "M", r0 * Math.cos(a0 += db), ",", r0 * -Math.sin(a0));
      //console.log(getcoords[getcoords.length -4])
      // push the last position to the path
      path.push("L", getcoords[getcoords.length -3], ",", getcoords[getcoords.length -1]);
      //path.push("L", r4 * Math.cos(a0 += (db*.85)), ",", r4 * -Math.sin(a0));
      path.push("L", r1 * Math.cos(a0 += (db*.85)), ",", r1 * -Math.sin(a0));
      path.push("M 0 1900", "h 35 v 105 h -35 v -105");
      path.push("M 0 2040", "h 35 v 105 h -35 v -105");
      path.push("M 0 2180", "h 35 v 105 h -35 v -105");
      path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
      return path.join("");
    }

    function anchorbase(d) { // not in use
      var n = d.teeth,
        r2 = Math.abs(d.radius),
        r0 = r2 - 50, //teeth depth - was at 8
        r1 = r2 + 50, //teeth depth - was at 8
        r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 45) : 25, // inside axel diameter
        r4 = r2 - 2,
        da = Math.PI / n,
        db = Math.PI / (n/3), // just 5 spots along the teeth
        a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
        i1 = -1,
        i2 = -1,
        i3 = -1,
        i4 = -1,
        i5 = -1,
        i6 = -1,
        // da is the tooth length - adding it to a0 moves the start...
        path = ["M", r1 * Math.cos(a0 += (da)), ",", r1 * Math.sin(a0)]; // beginning of path
      while (++i1 < 10) path.push(
        "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0));
      //get the middle cords
          var midcords = [];
          while (++i2 < 9) midcords.push(
            "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0));
      path.push("L", (path[path.length -3] -= 50), ",", (path[path.length -1] += 500));
      path.push("L", (path[path.length -3] -= 500), ",", (path[path.length -1]));
      // go to the last line in midcords
      path.push("L", midcords[midcords.length -3], ",", midcords[midcords.length -1]);
      // draw the rest
      while (++i3 < 11) path.push(
        "L", r1 * Math.cos(a0 += da), ",", r1 * Math.sin(a0));
      path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
      return path.join("");
    }


// motion stuff

// circle function




  function actionGraph1() {
    console.log(map.select("#gear2").data);
  }

// toggle for animation
var govar = 1;

  function moveit() {

      var t = d3.timer(function() {
        var angle = (Date.now() - start) * speed,
          transform = function(d) {
            //console.log(d)
          if (govar == 1) {
            return "translate(" + d.x + "," + d.y + ")scale(.30) rotate(" + angle / d.radius + ")";
          } else {
            return "translate(" + d.x + "," + d.y + ")scale(.30)";
            t.stop();
          }
          };
        map.selectAll(".gear").attr("transform", transform); // select by class with the dot


      });


  }

  function stopit() {
    govar = 0;
  }

  //function stopit() {
  //  d3.timer.stop();
  //}

  function startit() {
    govar = 1;
    moveit();
  }

  function resetall() {
    map.selectAll("path").remove();
  }

  function nocolor() {
    map.selectAll("path").attr("fill", "#FFFFFF");
    document.getElementById('map').style.backgroundColor = "#FFFFFF";
    document.getElementById('map').style.backgroundImage = "";
  }


// get color

      var canvas = document.getElementById('viewport'),
      ctx = canvas.getContext('2d');

      make_base();

      function make_base()
      {
        base_image = new Image();
        base_image.src = 'images/smoke.png';
        base_image.onload = function(){
          ctx.drawImage(base_image, 10, 10);
        }
      }

      // get color
              function getPixelColor(x, y) {
                var pxData = ctx.getImageData(x,y,1,1);
                return("rgb("+pxData.data[0]+","+pxData.data[1]+","+pxData.data[2]+")");
            }

            var eyedropperIsActive = false;

            function handleMouseMove(e) {

                if (!eyedropperIsActive) {
                    return;
                }

                mouseX = parseInt(e.offsetX);
                mouseY = parseInt(e.offsetY);

                // Put your mousemove stuff here
                var eyedropColor = getPixelColor(mouseX, mouseY);
                $("#results").css("backgroundColor", getPixelColor(mouseX, mouseY));

            }

            $("#viewport").click(function (e) {
              eyedropperIsActive = false;
            });
            $("#viewport").mousemove(function (e) {
                handleMouseMove(e);
            });
            $("#startDropper").click(function (e) {
                eyedropperIsActive = true;
            });


////// svg draw code

var line = d3.line()
    .curve(d3.curveBasis);

var svgdraw = d3.select("#mapdraw")
    .call(d3.drag()
        .container(function() { return this; })
        .subject(function() { var p = [d3.event.x, d3.event.y]; return [p, p]; })
        .on("start", drawstarted));

function drawstarted() {
  //x=150;
  //y=150;
  if (linedrawn != "") {
    d3.select(linedrawn).remove()
    }
  linedrawn = "";
  var d = d3.event.subject,
      active = svgdraw.append("path").datum(d)
        .attr("fill", "none")
        .attr("id", "g" + (Math.round(Math.random().toFixed(4)*10000)).toString()),
        //.attr("transform", "translate(" + x + "," + y + ")scale(.50)"),// handled in box on home page
      x0 = d3.event.x,
      y0 = d3.event.y;
      linedrawn = "#" + active.attr("id");

  d3.event.on("drag", function() {
    var x1 = d3.event.x,
        y1 = d3.event.y,
        dx = x1 - x0,
        dy = y1 - y0;

    if (dx * dx + dy * dy > 100) d.push([x0 = x1, y0 = y1]);
    else d[d.length - 1] = [x1, y1];
    active.attr("d", line);


    console.log(linedrawn);

  });

} // end drawstarted function

// update selectedgear to append linedrawn

  function drawongear() {
      if (selectedgear != "" && linedrawn != "") {
        var drawnline = d3.select(linedrawn)
          .attr("d"); // this gets the svg path array from the line - needs to be centered
        var geardraw = d3.select(selectedgear)
          .attr("d");
        var gearplusline = geardraw.concat(drawnline);
        console.log(drawnline);
        d3.select(selectedgear).attr("d",gearplusline); // d is the varible where the svg array is kept
      }
  }
