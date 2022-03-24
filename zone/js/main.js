$(document).ready(function(){

    var quantitiy=0;
    $('.quantity-right-plus').on('click', function(e){
        e.preventDefault();
        var quantity = parseInt($(this).parent().next().val());
        $(this).parent().next().val(quantity + 1);
    });

    $('.quantity-left-minus').on('click', function(e){
        e.preventDefault();
        var quantity = parseInt($(this).parent().prev().val());
        if(quantity>0){
            $(this).parent().prev().val(quantity - 1);
        }
    });

    $('.cart-del-item').on('click', function() {

        if ( confirm('هل أنت متاكد من حذف المنتج') )
        {
            $(this).parent().parent().parent().parent().remove();
        }

    });


    $('#btn-cart').on('click', function() {
        $('.section-cart').fadeIn(50);
    });

    $('.close-section-cart').on('click', function() {
        $('.section-cart').fadeOut(50);
    });
    

    $('.col-imgs img, .thum-imgs img').on('click', function() {
        $('.primary-img img').attr('src', $(this).attr('src'));
    });

    // //////////////////////////////////
    var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
                $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-primary').trigger('click');
    // //////////////////////////////////

    $('.pass_show').append('<span class="ptxt">Show</span>');  
    });
      

    $(document).on('click','.pass_show .ptxt', function(){ 

    $(this).text($(this).text() == "Show" ? "Hide" : "Show"); 

    $(this).prev().attr('type', function(index, attr){return attr == 'password' ? 'text' : 'password'; });


});

