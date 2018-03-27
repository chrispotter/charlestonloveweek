$(document).on('click', '.trigger', function (event) {
  event.preventDefault();
  $('#modal').iziModal('open');
});

$(function(){
  // Append an iFrame to the page.
  var iframe = $('<iframe src=\"https://awakencharleston.SecureGive.com/SG/WebOnline/Transaction/Instant?transactionType=Donation&campus=5064&lockCampus=true\" frameborder=\"0" scrolling="no" onload="iFrameResize()"></iframe>').append('.');
  
  // Called once the Iframe's content is loaded.
  iframe.load(function(){
    // The Iframe's child page BODY element.
    var iframe_content = iframe.contents().find('body');
    
    // Bind the resize event. When the iframe's size changes, update its height as
    // well as the corresponding info div.
    iframe_content.resize(function(){
      var elem = $(this);
      
      // Resize the IFrame.
      iframe.css({ height: elem.outerHeight( true ) });
      
      // Update the info div width and height.
      $('#iframe-info').text( 'IFRAME width: ' + elem.width() + ', height: ' + elem.height() );
    });
    
    // Resize the Iframe and update the info div immediately.
    iframe_content.resize();
  });
});