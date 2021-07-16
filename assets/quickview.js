$(document).ready(function () {
  $.getScript("//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js").done(function() {
    quickView();
  });
});

    
$("a").addClass('quve');
$(document).find("a.quve").parent('div').css('position','relative');
$(document).find("a.quve").parent('div').addClass('quve_div');

function quickView() {
  $(".quick-view").click(function () {
    var tot = $(".quick-view").size();
    var idx = $(".quick-view").index(this);
    
    $("body").prepend('<div class="loader"></div>');
    if ($('#quick-view').length == 0){$("body").append('<div id="quick-view"></div>');}
    $('#quick-view').hide();   
    $('.loader').show();
    var product_handle = $(this).data('handle');
    $('#quick-view').addClass(product_handle);
    jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
      var title = product.title;
      var type = product.type;
      var price = 0;
      var original_price = 0;
      var desc = product.description;
      var images = product.images;
      var variants = product.variants;
      var options = product.options;
      var url = '/products/' + product_handle;
      var vendor=product.vendor;
   
      
      if(idx < tot-1){
        $("#qv-add-button_next").show();
      }else{
        $("#qv-add-button_next").hide();
      }
      
      
      if(idx > 0){
        $(".qv-add-button_prev").show();
      }else{
        $(".qv-add-button_prev").hide();
      }
      
      
       $(".qv-add-button_prev").click(function() {         
         var nextIndex = idx;
         $(".fancybox-close").click();
         $(".quick-view").eq(parseInt(nextIndex)-1).trigger("click");
       });

      $(".qv-add-button_next").click(function() {         
         var nextIndex = idx;
         $(".fancybox-close").click();
         $(".quick-view").eq(parseInt(nextIndex)+1).trigger("click");
       });
      
      
      //Announcement Bar
      $('.qe_announcement').text($ab_text);
      $('.qe_announcement').append('<a class="ab_button_text_name" href="'+$ab_button_link+'" target="_blank">'+$ab_button_text_name+'</a>');
      $('.qe_announcement').addClass($ab_icon_name);
      
      $('.qv-product-title').text(title);
      $('.qv-product-vendor').append('<strong>Vendor:</strong>'+vendor);
      $('.qv-product-type').append('<strong>Product Type:</strong>'+type);
      $('.qv-product-description').html(desc);
      $('.view-product').attr('href', url);
     
    
    imageCount = $(images).length;
      $(images).each(function (i, image) {
      if (i == imageCount - 1) {
          var image_embed = '<div><img src="' + image + '" data-zoom-image="' + image + '"></a></div>';
          image_embed = image_embed.replace('.jpg', '_250x.jpg').replace('.png', '_250x.png').replace('.gif', '_250x.gif');                
          $('.qv-product-images').append(image_embed);
        
          var image_embed = '<div><img src="' + image + '" data-zoom-image="' + image + '"></div>';
          image_embed = image_embed.replace('.jpg', '.jpg').replace('.png', '.png');                
          $('.qv-product-images-nav').append(image_embed);
        
        
        } else {
          image_embed = '<div><img src="' + image + '" data-zoom-image="' + image + '"></a></div>';
          image_embed = image_embed.replace('.jpg', '.jpg').replace('.png');
          $('.qv-product-images').append(image_embed);
          
          image_embed = '<div><img  src="' + image + '" data-zoom-image="' + image + '"></div>';
          image_embed = image_embed.replace('.jpg', '.jpg').replace('.png');
          $('.qv-product-images-nav').append(image_embed);
        }
     
      });
      
      
      $(options).each(function (i, option) {
        var opt = option.name;
        var selectClass = '.option.' + opt.toLowerCase();
        //console.log(opt);
        $('.qv-product-options').append('<div class="option-selection-' + opt.toLowerCase() + '"><span class="option1">' + opt + '</span><select class="option-' + i + ' option ' + opt.toLowerCase().split(' ').join('_') + '"></select></div>');
        $(option.values).each(function (i, value) {
          $('.qv-product-options').find('.option.' + opt.toLowerCase().split(' ').join('_')).append('<option value="' + value + '">' + value + '</option>');
        });
        });
       $(product.variants).each(function (i, v) {
         if (v.inventory_quantity == 0) {
          $('.qv-add-button').prop('disabled', true).val('Sold Out');
          $('.qv-add-to-cart').hide();
          $('.qv-product-price').html('Sold Out').show();
          return true
        } else {
          price = parseFloat(v.price / 100).toFixed(2);
          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
          
          $('.qv-product-price').html(qecurrency + price);
          if (original_price > 0) {
            $('.qv-product-original-price').html(qecurrency + original_price).show();
           $('.savingprice').html('Savings:'+qecurrency+(original_price - price).toFixed(2));
          
          } else {
            $('.qv-product-original-price').hide();
            $('.savingprice').hide();
          }
          $('select.option-0').val(v.option1);
          $('select.option-1').val(v.option2);
          $('select.option-2').val(v.option3);
          return false
        }
      });
      
    });

    $(document).on("change", "#quick-view select", function () {
      var selectedOptions = '';
      $('#quick-view select').each(function (i) {
        if (selectedOptions == '') {
          selectedOptions = $(this).val();
        } else {
          selectedOptions = selectedOptions + ' / ' + $(this).val();
        }
      });
      jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
        $(product.variants).each(function (i, v) {
          if (v.title == selectedOptions) {
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            var v_qty = v.inventory_quantity;
            var v_inv = v.inventory_management;
            
            $('.qv-product-price').html(qecurrency + price);
            $('.qv-product-original-price').html(qecurrency + original_price);
            if(original_price > 0)
            {
              $('.savingprice').show();
              $('.savingprice').html('Savings:'+qecurrency+(original_price-price).toFixed(2));  }
            else{$('.savingprice').hide();}
                          
            
            if (v_inv == null) {
              $('.qv-add-button').prop('disabled', false).val('Add to Cart');
            } else {
              if (v.inventory_quantity < 1) {
                $('.qv-add-button').prop('disabled', true).val('Sold Out');
              } else {
                $('.qv-add-button').prop('disabled', false).val('Add to Cart');
              }
            }
          }
        });
      });
    });
    $('#quick-view').hide().html(content).css('opacity', '1').fadeIn(function () {
            $('.qv-product-images').addClass('loaded');
          });        
    
    setTimeout(function(){
      
      $.fancybox({
        href: '#quick-view',
        maxWidth: 1040,
        maxHeight: 600,
        fitToView: true,
        width: '75%',
        height: '70%',
        autoSize: false,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        'beforeLoad': function () {
          
          var product_handle = $('#quick-view').attr('class');
          $(document).on("click", ".qv-add-button", function () {
            var qty = $('.qv-quantity').val();
            var selectedOptions = '';
            var var_id = '';
            $('#quick-view select').each(function (i) {
              if (selectedOptions == '') {
                selectedOptions = $(this).val();
              } else {
                selectedOptions = selectedOptions + ' / ' + $(this).val();
              }
            });
            jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
              $(product.variants).each(function (i, v) {
                if (v.title == selectedOptions) {
                  var_id = v.id;
                  processCart();
                }
              });
            });
            function processCart() {
              jQuery.post('/cart/add.js', {
                quantity: qty,
                id: var_id
              },
                          null,
                          "json"
                         ).done(function () {
                $('.qv-add-to-cart-response').addClass('success').html('<span class="success">' + $('.qv-product-title').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');
              })
              .fail(function ($xhr) {
                var data = $xhr.responseJSON;
                $('.qv-add-to-cart-response').addClass('error').html('<span>' + data.description);
              });
            }
          });
          $('.fancybox-wrap').css('overflow', 'hidden !important');
        },
        'afterShow': function () {
          $('.loader').remove();
          
        },
        'afterClose': function () {
          $('#quick-view').removeClass().empty();
        }
      });
        $('.qv-product-images').slick({
            'dots': false,
            'arrows': false,
            'respondTo': 'min',
            'useTransform': false,
            slidesToShow: 1,
           infinite: false,
          centerMode: true,
        slidesToScroll: 1,
          }).css('opacity', '1');
        $('.qv-product-images-nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.qv-product-images',
            dots: true,
            infinite: false,
            focusOnSelect: true,
            
          }).css('opacity', '1');
    }, 1000);
    
  });
};
$(window).resize(function () {
  if ($('#quick-view').is(':visible')) {
    $('.qv-product-images').slick('setPosition');
  
  }
});

