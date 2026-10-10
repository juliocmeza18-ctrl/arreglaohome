import { AIDiagnosticQuestion } from '../types';

export const CATEGORY_QUESTIONS: Record<string, AIDiagnosticQuestion[]> = {
  electricidad: [
    {
      id: 'elec-q1',
      question: '¿Qué síntoma principal presenta la instalación eléctrica?',
      options: [
        'Salta el diferencial general y deja sin luz toda la casa',
        'Salta solo un magnetotérmico / circuito específico (enchufes o alumbrado)',
        'Un enchufe o interruptor echa chispas o huele a quemado',
        'Necesito instalar o colgar nuevos puntos de luz / lámparas LED',
      ],
    },
    {
      id: 'elec-q2',
      question: '¿Ocurre el fallo al conectar algún electrodoméstico concreto?',
      options: [
        'Sí, ocurre con el horno, lavadora, termo o vitrocerámica',
        'No, salta de forma aleatoria incluso de noche sin consumo',
        'Ocurre al accionar un interruptor de luz',
        'No hay cortocircuito, es solo una instalación o sustitución nueva',
      ],
    },
    {
      id: 'elec-q3',
      question: '¿En qué tipo de estancia se encuentra la avería o trabajo?',
      options: [
        'Cocina o galería',
        'Salón o dormitorio',
        'Baño (zona con humedad)',
        'Cuadro eléctrico general de entrada',
      ],
    },
  ],
  fontaneria: [
    {
      id: 'font-q1',
      question: '¿Cuál es el problema exacto de fontanería?',
      options: [
        'Goteo continuo dentro de la taza del inodoro o por la base',
        'Fuga de agua en grifo, latiguillo o debajo del fregadero/lavabo',
        'Desagüe o sifón atascado con agua estancada',
        'Termo eléctrico gotea, no calienta o pierde presión',
      ],
    },
    {
      id: 'font-q2',
      question: '¿Es posible cortar el agua de forma independiente?',
      options: [
        'Sí, he cerrado la llave de escuadra del aparato afectado',
        'Solo puedo cortar la llave de paso general de toda la vivienda',
        'La llave de paso está atascada y no gira',
        'No hay fuga activa en este momento',
      ],
    },
    {
      id: 'font-q3',
      question: '¿La pérdida de agua ha afectado a suelos, muebles o vecinos?',
      options: [
        'No, está controlada en un cubo o desagüe',
        'Empieza a filtrarse en el mueble bajo encimera',
        'Hay riesgo de mancha de humedad o filtración a piso inferior',
        'Es un atasco sin fuga externa',
      ],
    },
  ],
  persianas: [
    {
      id: 'pers-q1',
      question: '¿Qué sistema de accionamiento tiene la persiana?',
      options: [
        'Cinta tradicional con recogedor empotrado o exterior',
        'Manivela con torno / cable de acero',
        'Motorizada con pulsador de pared',
        'Motorizada con mando a distancia',
      ],
    },
    {
      id: 'pers-q2',
      question: '¿Cuál es el estado mecánico actual de la persiana?',
      options: [
        'La cinta se ha roto o deshilachado y ha caído de golpe',
        'Las lamas están torcidas o trabadas en la guía lateral',
        'El recogedor inferior no enrolla la cinta',
        'El motor suena pero el eje no gira o se frena a mitad',
      ],
    },
    {
      id: 'pers-q3',
      question: '¿De qué material son las lamas de la persiana?',
      options: [
        'Aluminio térmico (habitual blanco o gris)',
        'PVC / plástico',
        'Madera antigua',
        'No estoy seguro/a',
      ],
    },
  ],
  muebles: [
    {
      id: 'mueb-q1',
      question: '¿Qué tipo de mobiliario necesitas montar o reparar?',
      options: [
        'Armario grande de dormitorio (IKEA, Leroy Merlin, etc.)',
        'Mueble de televisión, cómoda o aparador de salón',
        'Módulos altos o estantes suspendidos en pared',
        'Ajuste de bisagras o guías de cajones existentes',
      ],
    },
    {
      id: 'mueb-q2',
      question: '¿En qué estado se encuentran las piezas y herrajes?',
      options: [
        'Cajas precintadas con instrucciones y todos los tornillos',
        'Parcialmente montado pero bloqueado o incompleto',
        'Mueble ya existente que se ha descolgado o desajustado',
        'Faltan tacos o herrajes específicos de pared',
      ],
    },
    {
      id: 'mueb-q3',
      question: '¿Qué tipo de pared tiene la estancia?',
      options: [
        'Ladrillo tradicional revocado',
        'Tabique de Pladur / cartón yeso',
        'Hormigón armado',
        'No requiere anclaje a pared',
      ],
    },
  ],
  bricolaje: [
    {
      id: 'brico-q1',
      question: '¿Qué trabajo de bricolaje necesitas realizar?',
      options: [
        'Colgar cuadros pesados, espejos o estores / cortinas',
        'Instalar accesorios de baño (toalleros, mampara, etc.)',
        'Sellado de bañera/ducha con silicona antimoho profesional',
        'Ajuste o cepillado de puerta que roza con el suelo',
      ],
    },
    {
      id: 'brico-q2',
      question: '¿Dispones ya de los elementos o materiales a instalar?',
      options: [
        'Sí, tengo los elementos comprados en casa',
        'Tengo los accesorios pero necesito que el técnico aporte tacos/silicona',
        'Necesito asesoramiento previo sobre qué comprar',
      ],
    },
    {
      id: 'brico-q3',
      question: '¿A qué altura se realizará el trabajo?',
      options: [
        'Altura estándar accesible de pie (hasta 2 metros)',
        'Altura de techo que requiere escalera (2,50 a 3 metros)',
        'Zona de difícil acceso',
      ],
    },
  ],
  otros: [
    {
      id: 'otros-q1',
      question: '¿Qué tipo de necesidad o avería presenta tu inmueble?',
      options: [
        'Puesta a punto completa para entrar a vivir o alquilar',
        'Mantenimiento preventivo general de chalé o piso',
        'Reparación combinada de varios gremios a la vez',
        'Consulta o valoración técnica para reforma pequeña',
      ],
    },
    {
      id: 'otros-q2',
      question: '¿Con qué urgencia necesitas la visita del técnico?',
      options: [
        'Hoy mismo o en menos de 24 horas (urgente)',
        'Esta semana en horario concertado',
        'Sin prisa, flexible según disponibilidad',
      ],
    },
  ],
};

export function getDiagnosticQuestionsForCategory(categoryId: string): AIDiagnosticQuestion[] {
  return CATEGORY_QUESTIONS[categoryId] || CATEGORY_QUESTIONS['otros'];
}

/**
 * Generate intelligent AI diagnostic assessment based on user category, service, and answers
 */
export async function generateAIDiagnostic(
  categoryName: string,
  serviceName: string,
  answers: { question: string; answer: string }[],
  additionalNotes: string = '',
  hasPhoto: boolean = false
): Promise<{
  summary: string;
  estimatedMinutes: number;
  urgencyLevel: 'baja' | 'moderada' | 'alta';
  suggestedTools: string[];
  recommendation: string;
}> {
  // Synthesize answers
  const answersText = answers.map((a) => `${a.question} -> ${a.answer}`).join('; ');

  let summary = '';
  let estimatedMinutes = 45;
  let urgencyLevel: 'baja' | 'moderada' | 'alta' = 'moderada';
  let suggestedTools: string[] = ['Herramienta manual', 'Medidor'];
  let recommendation = '';

  const catLower = categoryName.toLowerCase();

  if (catLower.includes('electr')) {
    estimatedMinutes = 50;
    suggestedTools = ['Polímetro digital', 'Destornilladores VDE aislados 1000V', 'Térmicos de repuesto'];
    if (answersText.includes('diferencial general') || answersText.includes('chispas')) {
      urgencyLevel = 'alta';
      summary = `Diagnóstico IA: Anomalía de aislamiento por derivación a tierra o sobrecarga en línea de fuerza. Se recomienda corte preventivo del circuito afectado hasta la llegada del técnico oficial en Castellón.`;
      recommendation = 'Evitar accionar el mecanismo averiado y no conectar electrodomésticos de alto consumo.';
    } else {
      urgencyLevel = 'moderada';
      summary = `Diagnóstico IA: Sustitución de mecanismos con verificación de fase y neutro. Instalación limpia sin obras.`;
      recommendation = 'Revisar si existen otros enchufes de la misma serie a renovar en la misma visita.';
    }
  } else if (catLower.includes('fontan')) {
    estimatedMinutes = 45;
    suggestedTools = ['Llave inglesa de fontanero', 'Juntas de estanqueidad EPDM', 'Cinta de teflón profesional'];
    if (answersText.includes('inodoro') || answersText.includes('cisterna')) {
      summary = `Diagnóstico IA: Fallo en válvula de cierre o desgaste en la zapata de descarga de cisterna por acumulación de cal de la red de Castellón. Tiempo estimado: 35-45 min.`;
      recommendation = 'Si el ruido es molesto, se aconseja cerrar la llave de escuadra durante la noche.';
    } else if (answersText.includes('atascado')) {
      summary = `Diagnóstico IA: Obstrucción mecánica en sifón registrable por sedimentos o grasas. Desatasco directo sin químicos agresivos.`;
      recommendation = 'No verter desatascadores ácidos de supermercado para no degradar las tuberías de PVC.';
    } else {
      summary = `Diagnóstico IA: Pérdida por holgura de latiguillos flexibles o cartucho cerámico desgastado. Sustitución y sellado.`;
      recommendation = 'Cerrar la llave de escuadra para evitar humedades en el mueble inferior.';
    }
  } else if (catLower.includes('persian')) {
    estimatedMinutes = 40;
    suggestedTools = ['Cinta reforzada de persiana', 'Destornillador', 'Rodillo pasacintas', 'Lubricante de teflón'];
    summary = `Diagnóstico IA: Desgaste por fricción en cinta o descuelgue de flejes de amarre al eje octogonal. Sustitución completa y engrase de guías.`;
    recommendation = 'No forzar la bajada manual para no doblar las lamas de aluminio.';
  } else if (catLower.includes('mueble')) {
    estimatedMinutes = 75;
    suggestedTools = ['Atornillador de impacto a batería', 'Nivel láser', 'Tacos Fischer DuoPower'];
    summary = `Diagnóstico IA: Montaje de estructura con fijación de seguridad antivuelco y calibración milimétrica de holguras.`;
    recommendation = 'Tener despejado el espacio de montaje para poder manipular los tableros horizontalmente.';
  } else if (catLower.includes('brico')) {
    estimatedMinutes = 40;
    suggestedTools = ['Taladro percutor con aspirador', 'Detector de metales y cables en pared', 'Nivel digital'];
    summary = `Diagnóstico IA: Fijación limpia mediante taladrado sin polvo y anclajes certificados para el tipo de tabique.`;
    recommendation = 'Indicar al técnico la ubicación aproximada de tuberías o cableados si se conocen.';
  } else {
    estimatedMinutes = 60;
    suggestedTools = ['Maletín multiespecialidad', 'Medidor láser'];
    summary = `Diagnóstico IA: Valoración técnica de la avería. Nuestro especialista asignado revisará la causa de origen y presupuestará la solución óptima.`;
    recommendation = 'Preparar acceso a la zona afectada para agilizar la revisión.';
  }

  if (hasPhoto) {
    summary += ' [Fotografía de la avería adjuntada y procesada para asignación de piezas].';
  }

  if (additionalNotes.trim()) {
    summary += ` Nota del cliente: "${additionalNotes.trim().slice(0, 100)}"`;
  }

  return {
    summary,
    estimatedMinutes,
    urgencyLevel,
    suggestedTools,
    recommendation,
  };
}
