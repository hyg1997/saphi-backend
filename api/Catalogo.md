# Modulo Nutricion

 root: /nutrition
 
  - Debe recibir el token en el header con el que se define quien es el usuario

## Pantalla Mi Plan - **Pendiente de confirmar**
[Zeplin](https://zpl.io/aX8yL0g)

GET /myplan 
  - Retorna la lista de alimentos, según las categorías carbohidratos, proteinas, frutas. Cada alimento viene con la cantidad según el plan del paciente

## Pantalla categoría
[Zeplin](https://zpl.io/29RdqEp)

GET /myplan/?category=proteina
  - Igual que el anterior pero solo se devuelve una categoría de las 3 anteriores

## Pantalla detalle de alimento
[Zeplin](https://zpl.io/amNRDk3)

GET /aliments/:id
  - Retorna un alimento en particular, considerando la cantidad recomendada para el paciente

## Pantalla Recetas
[Zeplin](https://zpl.io/aR8wMOp)

GET /dishrecipes?category=salsa
  - Retorna el listado de recetas de la categoria solicitada

## Pantalla Detalle de Receta - **Solo para el caso de salsas**
[Zeplin](https://zpl.io/awedLjg)

GET/dishrecipes:id
  - Retorna una receta segun id

## Pantalla Delivery
[Zeplin](https://zpl.io/b6EwOqK)

GET /mydeliveryorder
  - Retorna el plan de delivery actual del paciente, si no esta retorna la estrucutra vacía

GET /deliveryplans
  - Retorna la lista de planes

## Pantalla Ordenar
Zeplin por definir

GET /menus?startdate=2020-01-01&limit=30

  - Retorno la lista de menus disponibles a partir de la fecha indicada y tantos menus como se indican. Los valores por defecto deben ser el dia actual y el limite 30

POST /deliveryorder

  - Recibe el token de la tarjeta de culqi y el plan elegido, así como los datos de contacto llenados en el formulario 
  - Primero procesa el cargo en culqi, en caso sea exitoso se procede a crear el pedido
  - Al confirmar el pedido se envía un email con el resumen del pedido al correo del proveedor. 