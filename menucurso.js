/**
 *  funcion rescatarDatosCurso
 * recorre el curso para obtener los datos necesarios
 * y los devuelve en forma de un objeto javaScript (JSON)
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

//código cuando la página está lista

$(document).ready(function() {
  // obtenemos la información del curso en un objeto
  const courseData = rescatarDatosCurso();

  // ajustamos visibilidad de elementos
  $('.menuu').attr('data','0');
  $('#page').attr('style','margin-top: 0px');
  $('.card').attr('style','border: 0px');
  $('.block_html').removeClass("card");
  $('.block_html').removeClass("mb-3");
  $('.block_html').removeClass("block");
  $('#region-main').removeClass("has-blocks");
  $('.menu-button').attr('data','0');

  // evento pulsar el botón superior derecho
  $('.menu-toggle').click(function() {

    $("body").css({'overflow':'auto'});
    $(".no-overflow").css({'text-align':'left'});
    $('.no-overflow').css({'overflow':'inherit'});
    $('.menusection').addClass('hide');
    $('#inst187').toggleClass('move');
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
    $('.course-content').toggleClass('move');

    // si no está generado el menú lo generamos
    if ($('.menuu').attr('data') == '0' ) {
      // capturamos la capa del menú y ajustamos data=1
      const menuList = document.getElementById('menuu');
      menuList.setAttribute('data', '1');

      const fragment = document.createDocumentFragment();
      var k = 0;
      for (const section of courseData) {
        // crear capa sección
        const divSection = document.createElement('DIV');
        divSection.classList.add('maiin-menu');
        // crear capa item para mostrar la imagen
        const divItems = document.createElement('DIV');
        divItems.classList.add('items');
        divItems.style = `cursor: pointer; background-image: url('${section.imageUrl}')`;
        // añadir la capa item a la capa sección
        divSection.appendChild(divItems);
        // crear capa content para incluir el enlace
        const divContent = document.createElement('DIV');
        divContent.classList.add('content');
        // crear el enlace
        const linkBtn = document.createElement('A');
        linkBtn.classList.add('btn-link');
        linkBtn.setAttribute('id', k);
        linkBtn.style = 'cursor: pointer;';
        linkBtn.textContent = section.title;
        // añadir enlace a capa content
        divContent.appendChild(linkBtn);
        // añadir capa content a capa sección
        divSection.appendChild(divContent);
        // añadir capa sección al fragmento
        fragment.appendChild(divSection);
        k++;
      }
      // añadir el fragmento a la capa del menú
      menuList.appendChild(fragment);
   }
  });


});

