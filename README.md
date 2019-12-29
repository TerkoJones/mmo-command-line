# mmo-command-line
## instalación
```ts
npm install terkojones/mmo-command-line
```
## uso
```ts
import commnadLine from 'mmo-command-line'
```
## función-objeto commandLine
Analiza la linea de comandos pasada a la aplicación en base a la descripción de los parámetros que se pasan a la misma.
```ts
commandLineArgs= commandLine(options: TParamOptionDictionary): TCommnadLineArgs
```
* options: Objeto ParamOptionDictionary con la definición de cada uno de los parámetros que se esperan en la línea de comandos.

### miembros commandLine[STRING|INTEGER|FLOAT|BOOLEAN|FLAG]
Hacen las veces de enumeración para identificar los tipos de datos de los parámetros. 
* `STRING`: El argumento pasado al parámetro se convertirá en cadena.
* `INTEGER`: ... en entero.
* `FLOAT`: ... en flotante.
* `BOOLEAN`: Los valores Y,YES,T,TRUE,S,SI se convertirán en `true`. El resto `false`.
* `FLAG`: Si se indica se convertirá en `true`. Es el único tipo de parametro que no precisa de un valor a continuación.

## tipo `TParamOptionDictionary`
Define cada uno de los parámetros que se esperan en la línea de comandos. Los parámetros se representan en la linea de comandos precedidos de uno o dos guiones y seguidos, si lo precisan, de un valor.
```ts
type TParamOptions= {
    [key:string]: TParamInfo | number | string
}
```
Donde:
* `TParamInfo`:  Objeto que describe el parámetro:
    * `type`: El número que idenfifica el tipo y que ha de ser uno de los valores descritos como miembros en el punto anterior(`commadLine[STRING|INTEGER|...]`).
    * `required`: Booleano que indica que el parámetro será obligatorio.
    * `alias`: Sobre nombre para otro parámetro ya definido. Si se indica, el valor asignado al parámetro será devuelto como valor del parámetro al que representa en el objeto ICommanLineArgs.
* `number`: igual que TParamInfo.type
* `string`: igual que TParamInfo.alias

# tipo de retorno TCommandLineArgs
Es el objeto devuelto con la información extraida de la linea de comandos.
```ts
interface ICommnadLineArgs {
    _node: string,
    _entry: string,
    _unknows?: string[];
    _missing?: string[];
    _faileds?: string[];
    _length?: number;
    [inx: number]: any;
    [key: string]: any;
}
```
* `_node`: Ruta  nodeJS
* `_entry`: Ruta al archivo por en que se entró a la aplicación
* `unknowns`: Nombres de parámetros pasados pero no definidos.
* `_missing`: Parámetros requeridos que no se han indicado.
* `_faileds`: Parámetros definidos que esperaban un valor y no se ha indicado.
* `_length`: Nº de argumentos sin parámetro asociado indicados.   
* *índices numéricos*: Cada argumento pasado sin parámetro asociado.
* *claves cadena*: Cada nombre de párametro definido con el argumento indicado.

## Ejemplo

Ejecutando una aplicación con la siguiente línea de comando:
```
node myapp.js -i file.txt --output --ignored --patatas --debug si "maría de las mercedes"
```
Siendo el código de myapp.js
```ts
import commandLine from '../index';


let out = commandLine({
    input: commandLine.STRING,
    output: commandLine.STRING,
    debug: commandLine.BOOLEAN,
    important: {
        type: commandLine.STRING,
        required: true
    },
    ignored: commandLine.FLAG,
    i: "input",
})

console.log(out);
```
la consola mostrará:
```
{
  '0': 'maría de las mercedes',
  _node: 'C:\\Program Files\\nodejs\\node.exe',
  _entry: 'c:\\Users\\user\\Proyects\\ts\\mmo-commandLineParser\\test\\main.test.js',
  input: 'file.txt',
  output: '',
  ignored: true,
  patatas: '',
  debug: true,
  _length: 1,
  _unknows: [ 'patatas' ],
  _faileds: [ 'output', 'patatas' ],
  _missing: [ 'important' ]
}
```
Esto es: 
* Un valor sin parámetro asociado bajo el índice uno. Como sólo hay uno `---length` así lo indica.
* `input: 'file.txt`. Ya que `-i` que es ja quien se pasó el parámetro, se definio como alias de `--input`.
* `output:''` Ya que se indicó el parámetro pero no se acompaño de un valor, por lo que aparece reflejado en el array de fallados `_faileds`.
* `ignored:true` Al definirlo como flag tan sólo se precisa su presencia para asignarle este valor. Si hubiera ido predcedido de otro valor esté figuraria bajo un índice numérico como valor sin parámetro asociado.
* `patatas`: Como este parámetro no esta definido pero figura en la linea de comandos se refleja en el array `_unknows` y como además no se le ha asingado un valor también aparece en el array `_faileds`.
* Por último `important` aparece en el array `_missing` por que se definio como requerido pero no figura en la linea de comandos.