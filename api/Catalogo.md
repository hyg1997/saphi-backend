# Modulo Nutricion

root: /nutrition

- Debe recibir el token en el header con el que se define quien es el usuario

## Gestión de contenido

Se debe implementar servicios para crear, leer por id y listar los siguiente recursos

Algunos de estos servicios ya cubren otros especificados más adelante

- aliments
- deliveryPlans
- dishRecipes
- menus

## Pantalla Mi Plan - **Pendiente de confirmar**

[Zeplin por definir]

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

[Zeplin1](https://zpl.io/aR8wMOp)

[Zeplin2](https://zpl.io/2Z130lE)

GET /dishrecipes?category=salsa

- Retorna el listado de recetas de la categoria solicitada
- category es salsa o aliño

## Pantalla Detalle de Receta - **Solo para el caso de salsas**

[Zeplin](https://zpl.io/awedLjg)

GET/dishrecipes:id

- Retorna una receta segun id

## Pantalla Delivery

[Zeplin Caso sin plan](https://zpl.io/aR8wMxg)
[Zeplin Caso con plan](https://zpl.io/b6EwOqK)

GET /mydeliveryorder

- Retorna el plan de delivery actual del paciente, si no esta retorna la estructura vacía

GET /deliveryplans

- Retorna la lista de planes

## Pantalla Ordenar

Zeplin por definir
[UX](https://www.figma.com/file/6d878V4JEcURRrpRv7FoPa/Compra-nutricion?node-id=0%3A1)

GET /menus?startdate=2020-01-01&limit=30

- Retorno la lista de menus disponibles a partir de la fecha indicada y tantos menus como se indican. Los valores por defecto deben ser el dia actual y el limite 30

POST /deliveryorder

- Recibe el token de la tarjeta de culqi y el plan elegido, así como los datos de contacto llenados en el formulario
- Primero procesa el cargo en culqi, en caso sea exitoso se procede a crear el pedido
- Al confirmar el pedido se envía un email con el resumen del pedido al correo del proveedor.
