export const abi = 
[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "folio",
				"type": "string"
			}
		],
		"name": "BeneficiarioRegistrado",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "nuevoIndex",
				"type": "uint256"
			}
		],
		"name": "cambiarBeneficiarioActual",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "beneficiario",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "monto",
				"type": "uint256"
			}
		],
		"name": "DonacionRecibida",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "donar",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_wallet",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_nombre",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_edad",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_nacionalidad",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_historia",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_avatar",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nip",
				"type": "string"
			}
		],
		"name": "registrarBeneficiario",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "monto",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nipIngresado",
				"type": "string"
			}
		],
		"name": "retirar",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "beneficiario",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "monto",
				"type": "uint256"
			}
		],
		"name": "RetiroRealizado",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "beneficiarioActual",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "beneficiarios",
		"outputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "nombre",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "edad",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "nacionalidad",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "historia",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "avatar",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "folio",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "saldo",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nip",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBeneficiarioActual",
		"outputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "nombre",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "edad",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "nacionalidad",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "historia",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "avatar",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "folio",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "saldo",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "getBeneficiarioPorWallet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "obtenerHistorial",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBeneficiarios",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "transacciones",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]as const;