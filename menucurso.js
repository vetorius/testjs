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
 *  funcion insertarEstilo
 *  incorpora los estilos extra necesarios
 */
function insertarEstilo(hojaEstilo) {
  const estilo = document.createElement('link');
  estilo.rel = 'stylesheet';
  estilo.type = 'text/css';
  estilo.href = hojaEstilo; 
  document.head.appendChild(estilo);
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
  const secciones = document.querySelectorAll('li[id^="section-"]');
  for (const section of secciones){
    const sectionName = section.getAttribute('id');
    if(sectionName.split('-')[1] !== '0'){ //eliminamos la sección 0
      let sectionImage = document.querySelector(`li[id="${sectionName}"] div.content div.summary img`);
      // rescatamos la URL de la imagen de la sección y el nombre de su texto alternativo
      const sectionObject = {
        title: section.getAttribute('aria-label'),
        imageUrl: sectionImage.getAttribute('src'),
        subsections: []
      }
      // seleccionamos las actividades
//      const activitySelector = `li[id='${sectionName}'] div.content li.activity`;
      const actividades = document.querySelectorAll(`li[id="${sectionName}"] div.content li.activity`);
      // recorremos las actividades
      const subsecciones = [];
      var maxIndex = 0;
      for (const actividad of actividades){
        const activityId = actividad.getAttribute('id');
        let activityName = document.querySelector(`li[id="${activityId}"] span.instancename`).textContent;
        activityName = activityName.slice(0, activityName.lastIndexOf(" "));
        activityLink = document.querySelector(`li[id="${activityId}"] div.activityinstance a`)
                               .getAttribute("href");
        activityImageUrl =document.querySelector(`li[id="${activityId}"] div.contentafterlink img`)
                                  .getAttribute("src");
        const subseccion = [ activityName.split(".")[0],
                             subsectionTitle(activityName.split(".")[1]),
                             activityName.split(".")[3],
                             activityLink,
                             activityImageUrl]
        if (activityName.split(".")[0] > maxIndex) {
          maxIndex = parseInt(activityName.split(".")[0])
        }
        subsecciones.push(subseccion);
      }
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
    }
  }
  // devolvemos el objeto con los datos
  return courseContent;
}

/**
 *  funcion menuu2open
 *  muestra el menuu2 de la sección que viene en el parámetro e
 * 
 * ### quitar llamadas a jquery
 * 
 */

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
  document.querySelector('.menu-toggle').classList.toggle('toggle-switch-menu-open');
  document.querySelector('.main-menu-switch').classList.toggle('toggle-switch');
}

/**
 *  funcion crearMenuu
 *  genera el elemento menuu en el DOM
 * 
 */

function crearMenuu(courseData) {

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

/**
 *  funcion crearMenuu2
 *  genera el elemento menuu2 en el DOM
 * 
 */
function crearMenuu2(courseData) {

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
    // recorremos las subsecciones
    var j=1;
    for (const subsection of section.subsections) {
      const detailsTag = document.createElement('DETAILS');
      detailsTag.classList.add('subm', `sum${j}`);
      const summaryTag = document.createElement('SUMMARY');
      summaryTag.textContent = subsection.title;
      detailsTag.appendChild(summaryTag);
      const divSubgrid = document.createElement('DIV');
      divSubgrid.classList.add('subgrid', 'subm');
      // para cada subsección recorremos las actividades
      for (const activity of subsection.activities) {
        const divSubitem = document.createElement('DIV');
        divSubitem.classList.add('subitem');
        const subitemLink = document.createElement('A');
        subitemLink.setAttribute('href', activity.link);
        subitemLink.setAttribute('target', '_blank');
        const subitemImage = document.createElement('IMG');
        subitemImage.setAttribute('src', activity.imageUrl)
        subitemImage.setAttribute('alt', activity.name);
        subitemImage.setAttribute('height','100'); // descomentar para cambiar el tamaño
        const imageCaption = document.createElement('p');
        imageCaption.textContent = activity.name;
        subitemLink.appendChild(subitemImage);
        subitemLink.appendChild(imageCaption);
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

/** código cuando la página está lista
 *
 * ### quitar llamadas a jquery
 * 
 */
$(document).ready(function() {

  // obtenemos la información del curso en un objeto y lo guardamos en local storage
  const courseData = rescatarDatosCurso();
  localStorage.removeItem('courseData');
  localStorage.setItem('courseData', JSON.stringify(courseData));

  // creamos una capa para alojar los distintos menús
  const menunca = document.createDocumentFragment();
  const capaPrincipal = document.createElement('div');
  capaPrincipal.setAttribute('id', 'ncamenu');
  
  // Creamos e insertamos el frontal
  const frontal = document.createElement('div');
  frontal.setAttribute('id', 'ncafront');
  frontal.classList.add('grid1');
  //imagen 1
  const capaImagen1 = document.createElement('div');
  capaImagen1.classList.add('grid');
  const capaImagen1bis = document.createElement('div');
  capaImagen1bis.classList.add('griditems');
  imagen1url = document.getElementById('general-1').getAttribute('src');
  capaImagen1bis.setAttribute('style', `background-image: url('${imagen1url}');`);
  capaImagen1.appendChild(capaImagen1bis);
  frontal.appendChild(capaImagen1);
  //imagen 2
  const capaImagen2 = document.createElement('div');
  capaImagen2.classList.add('grid');
  const capaImagen2bis = document.createElement('div');
  capaImagen2bis.classList.add('griditems');
  imagen2url = document.getElementById('general-2').getAttribute('src');
  capaImagen2bis.setAttribute('style', `background-image: url('${imagen2url}');`);
  const indicaBoton = document.createElement('h4');
  indicaBoton.innerHTML = 'Pulsa el botón <b>&oplus;</b> para acceder';
  capaImagen2bis.appendChild(indicaBoton);
  capaImagen2.appendChild(capaImagen2bis);
  frontal.appendChild(capaImagen2);
  //imagen 3
  const capaImagen3 = document.createElement('div');
  capaImagen3.classList.add('grid');
  const capaImagen3bis = document.createElement('div');
  capaImagen3bis.classList.add('griditems');
  imagen3url = document.getElementById('general-3').getAttribute('src');
  capaImagen3bis.setAttribute('style', `background-image: url('${imagen3url}');`);
  capaImagen3.appendChild(capaImagen3bis);
  frontal.appendChild(capaImagen3);
  capaPrincipal.appendChild(frontal);

  // creamos e insertamos el botón en la capa principal
  const botonMenu = document.createElement('button');
  botonMenu.setAttribute('type', 'button');
  botonMenu.setAttribute('aria-label', 'Haz click para abrir el menú');
  botonMenu.classList.add('menu-button', 'menu-toggle');
  capaPrincipal.appendChild(botonMenu);

  // creamos e insertamos la capa menuu
  const menuuLayer = document.createElement('div');
  menuuLayer.setAttribute('id', 'menuu');
  menuuLayer.setAttribute('data', 0);
  menuuLayer.classList.add('menuu', 'main-menu-switch', 'hide');
  capaPrincipal.appendChild(menuuLayer);

  // creamos e insertamos la capa menuu2
  const menuu2Layer = document.createElement('div');
  menuu2Layer.setAttribute('id', 'menuu2');
  menuu2Layer.setAttribute('data', 0);
  menuu2Layer.classList.add('menuu2', 'hide');
  capaPrincipal.appendChild(menuu2Layer);
  // Insertamos la capa en el fragmento y el fragmento en la posición elegida
  menunca.appendChild(capaPrincipal);
  const padre = document.getElementById('region-main-box');
  const hijo = document.getElementById('region-main');
  padre.insertBefore(menunca, hijo);


  // parte de código que viene de la sección general ## por revisar

/*   $("#grid1").hide();
  $("#region-main").removeClass("has-blocks");
  $("#page-footer").css("display","none");
  $("#back-to-top").css("display","none");
  $(".text-right").css("display","none");
  $(".teacherdash").css("display","none");
 */
  if ($("body").hasClass("editing")) {
    $("#ncafront").hide();
//     $("#espacio").hide();
    $("#region-main").addClass("has-blocks");
  } else {
    $("#region-main").removeClass("has-blocks");
    $("#region-main").addClass("hide");
    $('section[data-region="blocks-column"]').addClass('hide');
  };

/*   if( $('.editingbutton').attr('data-original-title') == 'Turn Edit Off' ){
      $('.grid1').css('display','none');
      $('#espacio').css('display','none');
  }; */



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

/*     $("body").css({'overflow':'auto'});
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
    } */
    document.querySelector('.menu-toggle').classList.toggle('toggle-switch-menu-open');
    document.querySelector('.main-menu-switch').classList.toggle('toggle-switch');

    if($('.menu-button').attr('data') == '0'){
          $('.menu-button').attr('data','1');
          $('#ncafront').addClass('hide');
          $('#menuu').removeClass('hide');
    } else if($('.menu-button').attr('data') == '1') {
          $('.menu-button').attr('data','0');
//          $('.card').show();
          $('#ncafront').removeClass('hide');
          $('#menuu').addClass('hide');
    }  else if($('.menu-button').attr('data') == '2') {
          $('.menu-button').attr('data','1');
          $('#menuu').removeClass('hide');
          $('#menuu2').addClass('hide');
          $('.menusection').each(function(){
            $(this).addClass('hide');
          });
    }
      
    // si no está generado el menú de temas (menuu) lo generamos
    if (document.getElementById('menuu').getAttribute('data') == '0' ) {
      crearMenuu(courseData);
    }

    // si no está generado el menú de las subsecciones de un tema (menuu2) lo generamos
    if (document.getElementById('menuu2').getAttribute('data') == '0' ) {
      crearMenuu2(courseData); 
    }
  });
});

