/** DELTA ADMIN **/

function initDashboard() {

  // === Prepare peity charts === //
  unicorn.peity();

  // === Prepare the chart data ===/
  var sin = [],
    cos = [];
  for (var i = 0; i < 14; i += 0.5) {
    sin.push([i, Math.sin(i)]);
    cos.push([i, Math.cos(i)]);
  }

  // === Make chart === //
  var plot = $.plot($(".chart"), [{
      data: sin,
      label: "sin(x)",
      color: "#BA1E20"
    }, {
      data: cos,
      label: "cos(x)",
      color: "#459D1C"
    }
  ], {
    series: {
      lines: {
        show: true
      },
      points: {
        show: true
      }
    },
    grid: {
      hoverable: true,
      clickable: true
    },
    yaxis: {
      min: -1.6,
      max: 1.6
    }
  });

  // === Point hover in chart === //
  var previousPoint = null;
  $(".chart").bind("plothover", function(event, pos, item) {

    if (item) {
      if (previousPoint != item.dataIndex) {
        previousPoint = item.dataIndex;

        $('#tooltip').fadeOut(200, function() {
          $(this).remove();
        });
        var x = item.datapoint[0].toFixed(2),
          y = item.datapoint[1].toFixed(2);

        unicorn.flot_tooltip(item.pageX, item.pageY, item.series.label + " of " + x + " = " + y);
      }

    } else {
      $('#tooltip').fadeOut(200, function() {
        $(this).remove();
      });
      previousPoint = null;
    }
  });

  // === Popovers === //
  var placement = 'bottom';
  var trigger = 'hover';
  var html = true;

  $('.popover-visits').popover({
    placement: placement,
    content: '<span class="content-big">36094</span> <span class="content-small">Total Visits</span><br /><span class="content-big">220</span> <span class="content-small">Visits Today</span><br /><span class="content-big">200</span> <span class="content-small">Visits Yesterday</span><br /><span class="content-big">5677</span> <span class="content-small">Visits in This Month</span>',
    trigger: trigger,
    html: html
  });
  $('.popover-users').popover({
    placement: placement,
    content: '<span class="content-big">1433</span> <span class="content-small">Total Users</span><br /><span class="content-big">0</span> <span class="content-small">Registered Today</span><br /><span class="content-big">0</span> <span class="content-small">Registered Yesterday</span><br /><span class="content-big">16</span> <span class="content-small">Registered Last Week</span>',
    trigger: trigger,
    html: html
  });
  $('.popover-orders').popover({
    placement: placement,
    content: '<span class="content-big">8650</span> <span class="content-small">Total Orders</span><br /><span class="content-big">29</span> <span class="content-small">Pending Orders</span><br /><span class="content-big">32</span> <span class="content-small">Orders Today</span><br /><span class="content-big">64</span> <span class="content-small">Orders Yesterday</span>',
    trigger: trigger,
    html: html
  });
  $('.popover-tickets').popover({
    placement: placement,
    content: '<span class="content-big">2968</span> <span class="content-small">All Tickets</span><br /><span class="content-big">48</span> <span class="content-small">New Tickets</span><br /><span class="content-big">495</span> <span class="content-small">Solved</span>',
    trigger: trigger,
    html: html
  });
}

var unicorn = {
  // === Peity charts === //
  peity: function() {
    $.fn.peity.defaults.line = {
      strokeWidth: 1,
      delimeter: ",",
      height: 24,
      max: null,
      min: 0,
      width: 50
    };
    $.fn.peity.defaults.bar = {
      delimeter: ",",
      height: 24,
      max: null,
      min: 0,
      width: 50
    };
    $(".peity_line_good span").peity("line", {
      colour: "#B1FFA9",
      strokeColour: "#459D1C"
    });
    $(".peity_line_bad span").peity("line", {
      colour: "#FFC4C7",
      strokeColour: "#BA1E20"
    });
    $(".peity_line_neutral span").peity("line", {
      colour: "#CCCCCC",
      strokeColour: "#757575"
    });
    $(".peity_bar_good span").peity("bar", {
      colour: "#459D1C"
    });
    $(".peity_bar_bad span").peity("bar", {
      colour: "#BA1E20"
    });
    $(".peity_bar_neutral span").peity("bar", {
      colour: "#757575"
    });
  },

  // === Tooltip for flot charts === //
  flot_tooltip: function(x, y, contents) {

    $('<div id="tooltip">' + contents + '</div>').css({
      top: y + 5,
      left: x + 5
    }).appendTo("body").fadeIn(200);
  }
}

setTimeout(initDashboard, 0);
