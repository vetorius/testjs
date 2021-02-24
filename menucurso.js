/**
 *  funcion subsectionTitle
 *  toma el código de una subsección 
 *  y devuelve una cadena con el título
 * 
 */

function subsectionTitle(code){

  const subsectionValues = {
      GUI: 'Guía didáctica', ACO: 'Acogida',
      SEM: 'Seminario', PRO: 'Proyecto',
      TRA: 'Trabajo personal o en grupo',
      ACT: 'Actividad formativa', CIE: 'Cierre'
  };
  if (code.includes('-')) {
      var splitted = code.split('-');
      return subsectionValues[splitted[0]]+' '+splitted[1];
  }
  return subsectionValues[code];
}

/**
 *  funcion rescatarDatosCurso
 *  recorre el curso para obtener los datos necesarios
 *  y los devuelve en forma de un objeto javaScript (JSON)
 * 
 */

function rescatarDatosCurso(){

  let courseContent = [];

  // recorremos cada sección
  $("li[id^='section-']").each(function(){
    const section = $(this).attr("id");
    if(section.split("-")[1] !== "0"){ //eliminamos la sección 0
      let imageSelector = `li[id='${section}'] div.content div.summary img`;
      // rescatamos la URL de la imagen de la sección y el nombre de su texto alternativo
      const sectionObject = {
        title: $(imageSelector).attr("alt"),
        imageUrl: $(imageSelector).attr("src"),
        subsections: []
      };
      // seleccionamos las actividades
      const activitySelector = `li[id='${section}'] div.content li.activity`;
      // recorremos las actividades
      const subsecciones = [];
      var maxIndex = 0;
      $(activitySelector).each(function(){
        const activityId = $(this).attr("id");
        let activityName = $(`li[id=${activityId}] span.instancename`).text();
        activityName = activityName.slice(0, activityName.lastIndexOf(" "));
        activityLink = $(`li[id=${activityId}] div.activityinstance a:first`).attr("href");
        activityImageUrl = $(`li[id=${activityId}] div.contentafterlink img`).attr("src");
        const subseccion = [ activityName.split(".")[0],
                             subsectionTitle(activityName.split(".")[1]),
                             activityName.split(".")[3],
                             activityLink,
                             activityImageUrl]
        if (activityName.split(".")[0] > maxIndex) {
          maxIndex = parseInt(activityName.split(".")[0])
        }
        subsecciones.push(subseccion);
      });
      for (let index = 0; index <= maxIndex; index++) {
        let submatrix = subsecciones.filter(function(subsection){
          return subsection[0] == index;
        });
        const subsection = {
          id: submatrix[0][0],
          title: submatrix[0][1],
          activities: []
        }
        submatrix.forEach(function(actividad){
          const theActivity = {
            name: actividad[2],
            link: actividad[3],
            imageUrl: actividad[4]
          }
          subsection.activities.push(theActivity);
        });
        sectionObject.subsections.push(subsection);
      }
      courseContent.push(sectionObject); // guardamos sección
    };
  });
  // devolvemos el objeto con los datos
  return courseContent;
}

function menuu2open(e) {
  const courseData = JSON.parse(localStorage.getItem('courseData'));
  $('#menuu').animate( { scrollTop : 0 }, 800 );
  $('.menu-button').attr('data','2');

  var section = e + 1;   
  var imgback = courseData[e].imageUrl;
/*   if (section === "20") {
    submenu20(); 
    $('#sec-20 .sum1').hide();
  }
*/
  $('.menuu2').toggleClass('hide');
  $(`#sec-${section}`).removeClass('hide');
  $('.menuu2').css('background-image',  `url(${imgback})`);
  $('.menuu2').css('background-size', '100%');
  $('.menuu').toggleClass('hide');
  $('.menu-toggle').toggleClass('toggle-switch-menu-open');
  $('.main-menu-switch').toggleClass('toggle-switch');
}



//código cuando la página está lista
$(document).ready(function() {
  // obtenemos la información del curso en un objeto y lo guardamos en local storage
  const courseData = rescatarDatosCurso();
  if (localStorage.getItem('courseData') == null){
    localStorage.setItem('courseData', JSON.stringify(courseData));
  }


  // ajustamos visibilidad de elementos
  $('.menuu').attr('data','0');
  $('#page').attr('style','margin-top: 0px');
  $('.card').attr('style','border: 0px');
  $('.block_html').removeClass("card");
  $('.block_html').removeClass("mb-3");
  $('.block_html').removeClass("block");
  //$('#region-main').removeClass("has-blocks");
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

    // si no está generado el menú de temas (menuu) lo generamos
    if (document.getElementById('menuu').getAttribute('data') == '0' ) {

      // capturamos la capa del menú y ajustamos data=1
      const menuList = document.getElementById('menuu');
      menuList.setAttribute('data', '1');
      
      // creamos un fragmento para luego incluirlo en la capa
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
        linkBtn.setAttribute('onclick', `menuu2open(${k})`);
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

    // si no está generado el menú de las subsecciones de un tema (menuu2) lo generamos
    if (document.getElementById('menuu2').getAttribute('data') == '0' ) {

      // capturamos la capa del menú y ajustamos data=1
      const menuList2 = document.getElementById('menuu2');
      menuList2.setAttribute('data', '1');

      // creamos un fragmento para luego incluirlo en la capa
      const fragment = document.createDocumentFragment();
      var k=1;
      // recorremos las secciones
      for (const section of courseData) {
        // crear la capa section
        const divSection = document.createElement('SECTION');
        divSection.classList.add('menusection', 'hide');
        divSection.setAttribute('id', `sec-${k}`);
        console.log(section.title);
        // recorremos las subsecciones
        var j=1;
        for (const subsection of section.subsections) {
          const detailsTag = document.createElement('DETAILS');
          detailsTag.classList.add('subm', `sum${k}`);
          const summaryTag = document.createElement('SUMMARY');
          summaryTag.textContent = subsection.title;
          console.log(subsection.title);
          detailsTag.appendChild(summaryTag);
          const divSubgrid = document.createElement('DIV');
          divSubgrid.classList.add('subgrid', 'subm');
          // para cada subsección recorremos las actividades
          for (const activity of subsection.activities) {
            console.log(activity.name);
            const divSubitem = document.createElement('DIV');
            divSubitem.classList.add('subitem');
            const subitemLink = document.createElement('A');
            subitemLink.setAttribute('href', activity.link);
            subitemLink.setAttribute('target', '_blank');
            const subitemImage = document.createElement('IMG');
            subitemImage.setAttribute('src', activity.imageUrl)
            subitemImage.setAttribute('alt', activity.name);
            //subitemImage.setAttribute('height','100'); // descomentar para cambiar el tamaño
            subitemLink.appendChild(subitemImage);
            divSubitem.appendChild(subitemLink);
            divSubgrid.appendChild(divSubitem);
          }
          detailsTag.appendChild(divSubgrid);
          divSection.appendChild(detailsTag);
          j++;
        }
        fragment.appendChild(divSection);
        k++;
      }
      // añadir el fragmento a la capa menuu
      menuList2.appendChild(fragment); 
    }
  });


});

