* [X] Todos los servicios que nos libres deben incluir el middleware 
  authenticateMiddleware('jwt') de manera que se garantice que solo aquellos autenticados pueden realizar las operaciones. Actualmente varios endpoints de admin no tienen esta configuracion
* Considero necesarios mantener una estructura de db actualizada antes los cambios que se vienen realizando

* [X] Validar proceso de paginación - https://www.hacksparrow.com/databases/mongodb/pagination.html
* [X] Los try catch no deberían ser necesario, se tiene configurado un error router que devuelve 500 en caso el servidor no funcione
  * En el caso de errores de servicios externos debería emplearse el http status code 503
---

* Los servicios deberían cumplir una actividad muy particular:
  * Realizar un cálculo
  * Realizar una operacion en DB de create, read, update o delete
  * Realizar una validación
  * Consumir un servicio interno/externo como enviar un email, renderizar un html, realizar una operación en culqi
* El objetivo de este diseño es que los servicios puedan reutilizarse y ante eventuales cambios, el trabajo sea mínimo

---

* [X] La carpeta auth debería contener solo las componentes relacionada a authenticación y authorization. 
  * Modelo user
  * API's de autenticación (login, register)
* [X} La compañia no es una entidad que tenga que ver con el usuario, no todos los usuarios tienen una compañía. La lógica de compañía tendrá mas componentes a futuro porque habrá un módulo asociado al admin que recibiran las compañías
  * Sería mejor separar en una carpeta distinta, de nombre "business" en donde manejemos los apis asociados a los servicios de empresas

* [X] Los endpoints que no estan asociados a auth podrían moverse a otra carpeta pacient que maneje el crud de los pacientes que son usados en el app. De esta manera también podemos separar las interacciones que estan ligadas a por ejemplo el admin, o usuario empresa que tendremos mas adelante

---

* [X] Los servicios de admin también deberían ser una componente aparte ya que su logica escapa a lo que esta dentro de auth. Se deberían mover los servicios, controladores y rutas a esta componente. De esa manera también será mas sencillo validar la autorizacion a estos endpoints ya que se puede crear un middleware que valide si tienen permiso admin

---

* [X] En envio de email debería estar en un utils aparte ya que es algo que se va a usar en varias funcionalidades.

---

* [X] La estructura de los servicios en postman tambien deberia estar separados por componentes, similar a la estructura del codigo

---

* [X] Siempre eliminar los console.log