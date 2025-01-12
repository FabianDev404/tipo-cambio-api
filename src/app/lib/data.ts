import { XMLHttpRequest } from "xmlhttprequest";
import { parseString } from "xml2js";

// Variables constantes
const token: string = "VANA7FPAAA";
const nombre: string = "Fabian Espinoza";
const fechaInicio: string = new Date().toLocaleDateString("es-CR");
let fecha: Date = new Date();
fecha.setDate(fecha.getDate() + 1);
const fechaFinal: string = fecha.toLocaleDateString("es-CR");
const subNiveles: string = "N";
const correoElectronico: string = "fabianespinozadeveloper@gmail.com";
const indicador = {
  compra: 3181,
  venta: 3215,
};

const req: XMLHttpRequest = new XMLHttpRequest();

/**
 * Esta función sirve para hacer un XMLHTTPRequest
 * @param {Number} ind Es el número del indicador, para saber si es de compra o venta
 * @returns Retorna un XML o undefined si no tiene respuesta
 */
const getXML = async (ind: number): Promise<string | undefined> => {
  req.open(
    "GET",
    `https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML?Indicador=${ind}&FechaInicio=${fechaInicio}&FechaFinal=${fechaFinal}&Nombre=${nombre}&SubNiveles=${subNiveles}&CorreoElectronico=${correoElectronico}&Token=${token}`,
    false
  );
  req.send(null);

  if (req.status === 200) {
    return req.responseText;
  }

  console.log(fechaInicio, fechaFinal);
  return undefined;
};

/**
 * Transforma un XML a objeto y obtiene el resultado buscado
 * @param {String} xmlResultado Es un string con formato XML, que va a ser transformado a objeto
 * @returns {Number} El resultado del tipo de cambio obtenido
 */
const parser = (xmlResultado: string | undefined): string | undefined => {
  if (xmlResultado !== undefined) {
    let resultadoCambio: string | undefined;
    parseString(xmlResultado, (err, result) => {
      if (result?.string._) {
        parseString(result.string._, (err, result2) => {
          if (
            result2?.Datos_de_INGC011_CAT_INDICADORECONOMIC
              ?.INGC011_CAT_INDICADORECONOMIC[0]?.NUM_VALOR
          ) {
            resultadoCambio =
              result2.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC[0].NUM_VALOR[0].toString();
          }
        });
      }
    });
    return resultadoCambio;
  }
  return undefined;
};

/**
 * Función principal que obtiene los valores de compra y venta desde el API
 * @returns Un objeto con los valores de compra y venta
 */
export async function fetchTipoCambio(): Promise<{ compra: number; venta: number }> {
  const cambio: { compra: number; venta: number } = {
    compra: 0,
    venta: 0,
  };

  let xmlCompra = await getXML(indicador.compra);
  let xmlVenta = await getXML(indicador.venta);
  if (xmlCompra) {
    cambio.compra = parseFloat(parser(xmlCompra) || "0");
  }
  if (xmlVenta) {
    cambio.venta = parseFloat(parser(xmlVenta) || "0");
  }

  console.log("Compra: ", cambio.compra);
  console.log("Venta: ", cambio.venta);

  if (cambio.compra !== undefined && cambio.venta !== undefined) {
   console.log("Se obtuvo la información de la API");
  } else {
    console.log("Error consiguiendo la información de la API");
    console.log("Se debe hacer de forma manual");
  }
   return cambio; 
}

