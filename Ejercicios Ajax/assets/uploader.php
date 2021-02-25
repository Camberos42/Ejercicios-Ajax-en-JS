<?php
//echo "Hola , respuesta desde el servidor";

//Variable especial $_FILES crea un arreglo asociativo donde crea toda la info del archivo que se sube
//var_dump($_FILES);

if(isset($_FILES["file"])){
    //Guardar los valores de algunas variables del arreglo FILE
    $name = $_FILES["file"]["name"];
    $file = $_FILES["file"]["tmp_name"];
    $error = $_FILES["file"]["error"];
    $destination = "../files/$name"; //Se hace la interpoalcion de variables con dobles comillas

    //Guardar los archivos en una carpeta especificada Devuelve un boolean si todo esta BIEN
   $upload = move_uploaded_file($file,$destination); 

   //Si la variable es igual a TRUE quiere decir que si se subio
   if($upload){
       //Es la respuesta que recibira js en json
       $res = array(
           "err" => false,
           "status" => http_response_code(200), //Se pone el tipo de peticion (200 porque fue exitosa)
           "statusText" => "Archivo $name subido con exito", //Un mensaje que queramos mandar
           "files" => $_FILES["file"] //Info que se mandara al js
       );
   }else{
       //Si es FALSE
       $res = array(
        "err" => true,
        "status" => http_response_code(400), //Se pone el tipo de peticion (200 porque fue exitosa)
        "statusText" => "Error al subir el archivo $name", //Un mensaje que queramos mandar
        "files" => $_FILES["file"] //Info que se mandara al js
       );
   }
   //Pasar la info del array asociativo pero en un formato de json
   echo json_encode($res);
}