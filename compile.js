const path = require('path');
const fs = require('fs');
const solc = require('solc');
// Compile contract
const contractPath = path.resolve(__dirname, 'ito.sol');
const source = fs.readFileSync(contractPath, 'utf8');



/*
Input contiene language, sources y settings.
	language= va el lenguaje de compilacion (Solidity y hay que respetar minusculas y mayusculas)
	sources= contiene un array asociativo con los contratos y dentro de cada uno de eso el campo
			content corresponde al codigo fuente del contrato.
	settings= solo especifica que se tomaran todos los archivos de salida.
*/
const input = {
   language: 'Solidity',
   sources: {
      'ito.sol': {
         content: source,
      },
   },
   settings: {
      outputSelection: {
         '*': {
            '*': ['*'],
         },
      },
   },
};

/*
tempFile contiene resultado de la compilacion. Caso exitoso tendra contracts y sources y en fallo
errors y sources..
	Errors= viene bien especificado los errores y warnings del compilador.
	sources= contiene el nombre del archivo del contrato (ERC20) y el identificador del mismo. Por
			ser uno solo ahora el id será 0.
	contracts= Contiene el objeto creado en la compilacion. como puede haber varios, estos se
				se indexan asociativamente como contracts['Archivo']['contrato']
*/
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(tempFile);

/*
contractFile Es el objeto generado por la compilacion anterior. contiente
	Abi= en donde se especifica la interfaz
	evm{ // evm es de ethereum virtual machine
		devdoc: { kind: 'dev', methods: {}, version: 1 } //no se que es
		assembly: codigo en assembly del contrato
		bytecode: 	generatedSources: [],
	      			linkReferences: {},
	      			object: los bytes escritos propiamente dichos (Lo que necesitamos para deploy)
	      			opcode: el opcode del objeto de arriba
	      			source map= el mapeo del codigo
	    deployedBytecode: // no se la dif entre este y el bytecode. uno debe ser el generador del otro.
	      			generatedSources: [],
	      			immutableReferences: {},
	      			linkReferences: {},
	      			object:
	      			opcode: el opcode del objeto de arriba
	      			source map= el mapeo del codigo
	    gasEstimates: Para la estimacion del gas
	    legacyAssembly: para la separacion de codigo de datos en la memoria.
	    methodIdentifiers: relaciona las funciones con los identificadores de la misma
		ewasm: { wasm: '' } // no se que es
	  	metadata: Contiene info de compilador, versiones, funciones y variables utilizadas, etc.
	  }

  	storageLayout: // tipo de variables y como se guardan
  	{
    	storage: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    	types: 
    	{
	      	t_address: [Object],
	      	't_mapping(t_address,t_mapping(t_address,t_uint256))': [Object],
	      	't_mapping(t_address,t_uint256)': [Object],
	      	t_string_storage: [Object],
	      	t_uint256: [Object],
	      	t_uint8: [Object]
    	}
  	}
  	userdoc: { kind: 'user', methods: {}, version: 1 } // supongo que es documentacion del usuario
*/
const contractFile = tempFile.contracts['ito.sol']['TokenSale'];

// exporto lo compilado para poder agarrarlo afuera y hacer el deploy
module.exports = contractFile;