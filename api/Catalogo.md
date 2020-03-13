# Modulo Nutricion

root: /nutrition

- Debe recibir el token en el header con el que se define quien es el usuario

## Gestión de contenido

Se debe implementar servicios para crear, leer por id y listar los siguiente recursos

Algunos de estos servicios ya cubren otros especificados más adelante

- [x] aliments
- [x] deliveryPlans
- [x] dishRecipes
- [x] menus

## Pantalla Mi Plan

[PANTALLA 1](https://www.figma.com/proto/1x8QOK8EM6gHYhRgtiWo1y/Seleccionar-comidas?node-id=1%3A2&scaling=min-zoom)

- [ ] GET /myplan

- Retorna la dieta actual del usuario, incluyendo los meals del dia.
- La resupuesta debe incluir data de la coleccion DIET y la coleccion MEAL

- [ ] PUT /meals

- Recibe la lista de comidas (desayuno, almuerzo, cena, etc) y actualiza el objeto MEAL

- [ ] POST /meals/:mealName
- Servicio para actualizar la seleccion de comidas de un determinado meal

- El servicio recibe un body que tiene la siguiente informacion

  ```js
    {
      macroStep: 'carbohydrate', // Recibe los campos: ['init', 'protein', 'carbohydrate', 'fat']
      selectedAlimentId: '5e61f21e0dcccc07f9adf90f',
      past:[
        {
          macro: 'protein',
          alimentId: '5e61f21e0dcccc07f9adf90f', // id del alimento
        }
      ]
    }
  ```

- El servicio responde

  ```js
    {
      nextStep: 'fat', // cual es el siguiente macro a mostrar o 'end' si ya termino el flujo
      allow: true, // si el paso permite elegir o no un alimento
      allowMessage: 'La combinacion', // mensaje a mostrar en caso allow sea falso
      aliments: [
        {},
        {}
      ]
    }
  ```

## Pantalla categoría

[Zeplin](https://zpl.io/29RdqEp)

- [ ] GET /myplan/?category=proteina

- Igual que el anterior pero solo se devuelve una categoría de las 3 anteriores

## Pantalla detalle de alimento

[Zeplin](https://zpl.io/amNRDk3)

- [ ] GET /aliments/:id

- Retorna un alimento en particular, considerando la cantidad recomendada para el paciente

## Pantalla Recetas

[Zeplin1](https://zpl.io/aR8wMOp)

[Zeplin2](https://zpl.io/2Z130lE)

- [x] GET /dishrecipes?type=salsa

- Retorna el listado de recetas de la categoria solicitada
- category es salsa o aliño

## Pantalla Detalle de Receta - **Solo para el caso de salsas**

[Zeplin](https://zpl.io/awedLjg)

- [x] GET/dishrecipes/:id

- Retorna una receta segun id

## Pantalla Delivery

[Zeplin Caso sin plan](https://zpl.io/aR8wMxg)
[Zeplin Caso con plan](https://zpl.io/b6EwOqK)

- [ ] GET /mydeliveryorder

- Retorna el plan de delivery actual del paciente, si no esta retorna la estructura vacía

- [x] GET /deliveryplans

- Retorna la lista de planes

## Pantalla Ordenar

Zeplin por definir
[UX](https://www.figma.com/file/6d878V4JEcURRrpRv7FoPa/Compra-nutricion?node-id=0%3A1)

- [x] GET /menus?startdate=2020-01-01&businessdays=30

- Retorno la lista de menus disponibles a partir de la fecha indicada y para tantos dias de semana se requiera. Los valores por defecto deben ser el dia actual y el limite 30

POST /deliveryorder

- Recibe el token de la tarjeta de culqi y el plan elegido, así como los datos de contacto llenados en el formulario
- Primero procesa el cargo en culqi, en caso sea exitoso se procede a crear el pedido
- Al confirmar el pedido se envía un email con el resumen del pedido al correo del proveedor.
