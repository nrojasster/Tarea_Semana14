const yargs = require('yargs');
const fs = require('fs');

// Comando para leer un archivo con opciones adicionales
yargs.command({
  command: 'read',
  describe: 'Leer un archivo',
  builder: {
    file: {
      describe: 'Ruta del archivo',
      demandOption: true,
      type: 'string'
    },
    encoding: {
      describe: 'Codificación del archivo',
      demandOption: false,
      type: 'string',
      default: 'utf8'
    }
  },
  handler(argv) {
    fs.readFile(argv.file, argv.encoding, (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return;
      }
      console.log(data);
    });
  }
});

// Comando para escribir en un archivo con opciones adicionales
yargs.command({
  command: 'write',
  describe: 'Escribir en un archivo',
  builder: {
    file: {
      describe: 'Ruta del archivo',
      demandOption: true,
      type: 'string'
    },
    content: {
      describe: 'Contenido a escribir',
      demandOption: true,
      type: 'string'
    },
    append: {
      describe: 'Añadir al contenido existente',
      demandOption: false,
      type: 'boolean',
      default: false
    }
  },
  handler(argv) {
    const writeMethod = argv.append ? fs.appendFile : fs.writeFile;
    writeMethod(argv.file, argv.content+'\n', (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        return;
      }
      console.log('Archivo escrito exitosamente');
    });
  }
});

// Comando para eliminar una linea (tarea) en un archivo existente
yargs.command({
    command: 'borraLinea',
    describe: 'Elimina linea en un archivo',
    builder: {
      file: {
        describe: 'Ruta del archivo',
        demandOption: true,
        type: 'string'
      },
      linea: {
        describe: 'N° linea a eliminar',
        demandOption: true,
        type: 'number'
      }
    },
    handler(argv) {
        fs.readFile(argv.file, 'utf8', (err, data) => {
            if (err) {
              console.error('Error al leer el archivo:', err);
              return;
            }
        
            // Dividir el contenido en líneas
            const lineas = data.split('\n');
        
            // Verificar que el número de línea es válido
            if (argv.linea < 0 || argv.linea >= lineas.length) {
              console.error('Número de línea inválido');
              return;
            }
        
            // Eliminar la línea específica
            lineas.splice(argv.linea, 1);
        
            // Unir las líneas de nuevo en una cadena
            const contenidoActualizado = lineas.join('\n');
        
            // Escribir el contenido actualizado en el archivo
            fs.writeFile(argv.file, contenidoActualizado, (err) => {
              if (err) {
                console.error('Error al escribir en el archivo:', err);
                return;
              }
              console.log('Línea eliminada exitosamente');
            });
          });
    }
  });

yargs.parse();

// Uso de la función

//node ejemplo.js write --file=Agenda.txt --content="Tarea 2" --append

//node ejemplo.js write --file=Agenda.txt --content="Tarea 1"
//node ejemplo.js read --file=Agenda.txt
//node ejemplo.js borraLinea --file=Agenda.txt --linea=2   // Elimina la tercera línea (índice 2)
