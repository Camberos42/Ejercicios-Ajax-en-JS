<?php
if(isset($_POST)){
    error_reporting(0);
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $comments = $_POST["comments"];

    $domain = $_SERVER["HTTP_HOST"]; //Para que venga el dominio desde donde se manda el correo (dxplicacion: min 7:30 )
    
    //Definir los parametros del metodo mail 
    $to = "jonmircha@gmail.com";
    $subject_mail = "Contacto desde el formulario del sitio $domain.";
    $message = "
    <p>
      Datos enviados desde el formulario del sitio <b>$domain</b>
    </p>
    <ul>
      <li>Nombre: <b>$name</b></li>
      <li>Email: <b>$email</b></li>
      <li>Asunto: $subject</li>
      <li>Comentarios: $comments</li>
    </ul>
    ";

    //1er param: version de la mime, 2do: tipo de contenido, 3ro: el remitente (el sitio con su dominio)
    $headers = "MIME-Version: 1.0\r\n" . "Content-Type: text/html; charset=utf-8\r\n" . "From: Envío Automático No Responder <no-reply@$domain>";

    //Metodo mail con sus respectivos parametros que ya tienen su informacion asignada en las variables
    $send_mail = mail($to, $subject_mail, $message, $headers);

    //Se guarda en una variable para en caso de que no haya error retorne true y se pueda ejecutar una condicion

    //Se hace la validacion  
    if($send_mail) {
        //Se crea un array asociativo para que posteriormente se pueda parsear en json format
        $res = [
          "err" => false,
          "message" => "Tus datos han sido enviados"
        ];
      } else {
        $res = [
          "err" => true,
          "message" => "Error al enviar tus datos. Intenta nuevamente."
        ];
      }
      
    //Son las cabeceras de nuestras respuestas (peticiones por medio de php)
    //header("Access-Control-Allow-Origin: https://jonmircha.com"); //Recibir peticiones desde un dominio en especifico
    header("Access-Control-Allow-Origin: *");
    header( 'Content-type: application/json' );
    echo json_encode($res);
    exit;

}
    
