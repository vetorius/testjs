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

  console.log(rescatarDatosCurso());
  
});

