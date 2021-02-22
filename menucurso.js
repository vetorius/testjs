/* 
  funcion rescatarDatosCurso
  recorre el curso para obtener los datos necesarios
  y los devuelve en forma de un objeto javaScript (JSON)
*/

function rescatarDatosCurso(){

  var courseContent = [];

  // recorremos cada sección
  $("li[id^='section-']").each(function(){
    var section = $(this).attr("id");
    if(section.split("-")[1] !== "0"){ //eliminamos la sección 0
      let imageSelector = `li[id='${section}'] div.content div.summary img`;
      // rescatamos la URL de la imagen de la sección y el nombre de su texto alternativo
      var sectionObject = {
        title: $(imageSelector).attr("alt"),
        imageUrl: $(imageSelector).attr("src"),
        activities: []
      };
      let contentSelector = `li[id='${section}'] div.content li.activity`;
      // recorremos las actividades
      $(contentSelector).each(function(){
        var content = $(this).attr("id")
        var contentName = $(`li[id=${content}] span.instancename`).text();
        contentName = contentName.slice(0, contentName.lastIndexOf(" "));
        // rescatamos el nombre, la URL y la imagen de la descripción
        var contentObject = {
          name: contentName,
          link: $(`li[id=${content}] div.activityinstance a:first`).attr("href"),
          imageUrl: $(`li[id=${content}] div.contentafterlink img`).attr("src")
        };
        sectionObject.activities.push(contentObject); // guardamos actividad
      });
      courseContent.push(sectionObject); // guardamos sección
    };
  });
  // devolvemos el objeto con los datos
  return courseContent;
}

$(document).ready(function() {

  const courseData = rescatarDatosCurso();
  $('.menuu').attr('data','0');
  $('#page').attr('style','margin-top: 0px');
  $('.card').attr('style','border: 0px');
  $('.block_html').removeClass("card");
  $('.block_html').removeClass("mb-3");
  $('.block_html').removeClass("block");
  $('#region-main').removeClass("has-blocks");
  $('.menu-button').attr('data','0');

  // **********************************
  // *   comenzamos a refactorizar   *
  // *********************************
  $('.menu-toggle').click(function() {

    $("body").css({'overflow':'auto'});
    $(".no-overflow").css({'text-align':'left'});
    $('.no-overflow').css({'overflow':'inherit'});
    //$('.menuu').css({'top':'-50px','left':'-170px'});
    //$('.menuu2').css({'top':'-50px','left':'-170px'});
    $('.menusection').addClass('hide');
    $('#inst187').toggleClass('move');
    //$('.card').toggleClass('hide');
    $('.card').hide();
    $("#region-main-settings-menu .dropdown-toggle>.icon").toggleClass('hide');
    $(this).toggleClass('toggle-switch-menu-open');
    $('.main-menu-switch').toggleClass('toggle-switch');
    if(!$('.menuu2').hasClass('hide')){
        $('.menuu2').toggleClass('hide');
    }
    if($('.menu-button').attr('data') == '0'){
          $('.menu-button').attr('data','1');
    } else  if($('.menu-button').attr('data') == '1') {
          $('.menu-button').attr('data','0');
          $('.card').show();
    }  else if($('.menu-button').attr('data') == '2') {
          $('.menu-button').attr('data','1');
    }
      
    $('.menuu').toggleClass('hide');
    //$('.menuu2').toggleClass('hide');
    $('.course-content').toggleClass('move');

    //if (localStorage.getItem('menuItems') === null) {
    //  saveMenuItems();
    //}
    if ($('.menuu').attr('data') == '0' ) {
//    var menuItemsArray = localStorage.getItem('menuItems');
//    menuItemsArray= JSON.parse(menuItemsArray);
    var menuList = $('.menuu');
    $('.menuu').attr('data','1');
/****************************
 * 
 *  mi código aquí
 * 
 */
    const fragment = document.createDocumentFragment();
    var k = 1;
    for (const section of courseData) {
      const divSection = document.createElement('DIV');
      divSection.classList.add('maiin-menu');
      const divItems = document.createElement('DIV');
      divItems.classList.add('items');
//      divItems.setAttribute('style', `cursor: pointer; background-image: url('${section.imageUrl}')`);
      divItems.style = `cursor: pointer; background-image: url('${section.imageUrl}')`;
      divSection.appendChild(divItems);
      const divContent = document.createElement('DIV');
      divContent.classList.add('content');
      const linkBtn = document.createElement('A');
      linkBtn.classList.add('btn-link');
      linkBtn.setAttribute('id', k);
//      linkBtn.setAttribute('onclick', 'menuu2open(this)');
//      linkBtn.setAttribute('style', 'cursor: pointer;');
      linkBtn.style = 'cursor: pointer;';
      linkBtn.textContent = section.title;
      divContent.appendChild(linkBtn);
      divSection.appendChild(divContent);
      fragment.appendChild(divSection);
      k++;
    }
    menuList.appendChild(fragment);
/**
 * final
 */
/*     for (var j=0, k=1; j<menuItemsArray.length; j+=2, k++){
      var div1 = $('<div/>')
        .addClass('maiin-menu')
        .appendTo(menuList);
      var div2 = $('<div/>')
        .css('cursor', 'pointer')
        .addClass('items')
        .css('background-image', 'url(' + menuItemsArray[j] + ')')
        .appendTo(div1);
      var div3 = $('<div/>')
        .addClass('content')
        .appendTo(div1);
      var a = $('<a/>')
        .addClass('btn-link')
        .attr('id', k)
        .css('cursor', 'pointer')
        .html(menuItemsArray[j+1])
        .attr('onclick', 'menuu2open(this)')
        .appendTo(div3);
      } */
    }

  });
  // *********************************
  // *   fin de la refactorización   *
  // *********************************

});

