// Textos para práctica de mecanografía
interface ThemedText {
  text: string;
  theme: string;
  language: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado'; // Nivel de dificultad
}

// Textos en español para práctica de mecanografía
export const spanishTypingTexts: ThemedText[] = [
  // TEXTOS LITERARIOS - AVANZADOS
  {
    theme: "literatura",
    text: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza que así ensillaba el rocín como tomaba la podadera.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "literatura",
    text: "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos. El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo. Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "literatura",
    text: "La primera vez que Fermina Daza lo vio, tenía él veintiún años y había regresado de París con la última epidemia del cólera. No le pareció distinto de como era antes de irse, con su aire lúgubre y sus ropas de poeta, y la espina dorsal que empezaba a torcérsele por el abuso de la lectura a mala luz. Lo encontró más flaco que cuando se fue, más abatido por la fiebre, y había dejado en París las patillas románticas, pero seguía siendo el mismo por dentro y por fuera. Fue la primera vez que ella lo vio después de que él le había declarado su amor con una carta de veinte pliegos cuando ella apenas tenía trece años, y él no había cumplido los dieciocho.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "literatura",
    text: "Aquel día comprenderían que el tiempo no pasaba, como ella lo había sentido siempre, sino que daba vueltas en redondo. Esa revelación no les llegó formulada con palabras, sino como una certidumbre física, como si de pronto el calor se hiciera visible o el frío adquiriera forma de metal. Habían estado caminando durante horas, y aunque el sol ya estaba muy alto, no sentían fatiga. Tenían hambre y sed, pero no era una urgencia, sino más bien una vaga conciencia de que en algún momento tendrían que comer y beber. Cuando llegaron al claro del bosque, se detuvieron sin hablar. Allí estaba la casa, exactamente como la habían imaginado, exactamente como sabían que estaría.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "literatura",
    text: "La memoria del corazón elimina los malos recuerdos y magnifica los buenos, y gracias a ese artificio, logramos sobrellevar el pasado. El amor es tan efímero como la vida, pero ambos se alimentan de pequeñas verdades, no de grandes experiencias. No hay que confundir la verdad con la opinión: la primera es absoluta, la segunda relativa. La verdad es lo que es, mientras que la opinión es lo que pensamos de lo que es. La verdad no cambia porque creamos o no en ella, simplemente es. La opinión, en cambio, puede variar según nuestras experiencias, conocimientos o prejuicios.",
    language: "es",
    difficulty: "avanzado"
  },

  // TEXTOS CIENTÍFICOS - AVANZADOS
  {
    theme: "ciencia",
    text: "El cerebro humano es, sin duda, el objeto más complejo del universo conocido. Con sus aproximadamente 86 mil millones de neuronas y 100 billones de conexiones sinápticas, este órgano de apenas 1.5 kg es capaz de procesar información sensorial, coordinar el movimiento, regular funciones corporales, experimentar emociones, crear recuerdos y generar pensamientos abstractos. La neuroplasticidad, o la capacidad del cerebro para reorganizarse formando nuevas conexiones neuronales a lo largo de la vida, permite el aprendizaje continuo y la recuperación de ciertas funciones tras una lesión. Los avances en neurociencia están revelando gradualmente los mecanismos subyacentes a la consciencia, la memoria y la cognición, aunque todavía estamos lejos de comprender completamente este extraordinario órgano.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "ciencia",
    text: "La teoría de la relatividad general de Einstein revolucionó nuestra comprensión del espacio, el tiempo y la gravedad. Según esta teoría, la gravedad no es una fuerza que actúa a distancia como propuso Newton, sino una consecuencia de la curvatura del espacio-tiempo causada por la masa y la energía. Esta idea aparentemente abstracta ha sido confirmada por numerosas observaciones, desde la precesión de la órbita de Mercurio hasta la detección de ondas gravitacionales en 2015. La relatividad general también predice fenómenos extraordinarios como los agujeros negros, regiones del espacio-tiempo donde la gravedad es tan intensa que ni siquiera la luz puede escapar, y la expansión del universo, que sugiere un origen cósmico en el Big Bang hace aproximadamente 13.800 millones de años.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "ciencia",
    text: "La mecánica cuántica, desarrollada en la primera mitad del siglo XX, describe el comportamiento de la materia a escalas subatómicas, revelando un mundo profundamente contraintuitivo. Principios como la superposición cuántica, que permite a las partículas existir en múltiples estados simultáneamente, y el entrelazamiento cuántico, donde partículas separadas por grandes distancias mantienen correlaciones instantáneas, desafían nuestra percepción cotidiana de la realidad. El principio de incertidumbre de Heisenberg establece límites fundamentales a la precisión con que podemos conocer simultáneamente ciertas propiedades de una partícula, como su posición y momento. Estas extrañas propiedades cuánticas, lejos de ser meras curiosidades teóricas, son la base de tecnologías modernas como los láseres, los transistores y, potencialmente, las computadoras cuánticas del futuro.",
    language: "es",
    difficulty: "avanzado"
  },

  // TEXTOS TECNOLÓGICOS - AVANZADOS
  {
    theme: "tecnologia",
    text: "La inteligencia artificial (IA) está transformando radicalmente nuestra sociedad, economía y vida cotidiana. Los sistemas de aprendizaje profundo, inspirados en las redes neuronales del cerebro humano, han logrado avances impresionantes en reconocimiento de imágenes, procesamiento del lenguaje natural y toma de decisiones complejas. Estos algoritmos aprenden patrones a partir de enormes conjuntos de datos, mejorando continuamente su rendimiento sin programación explícita. Sin embargo, el auge de la IA plantea importantes desafíos éticos y sociales: desde preocupaciones sobre la privacidad y la vigilancia masiva, hasta el impacto en el empleo y la posibilidad de amplificar sesgos existentes. A medida que estas tecnologías se vuelven más sofisticadas y autónomas, surge la necesidad de establecer marcos regulatorios robustos y principios éticos que garanticen que la IA beneficie a la humanidad en su conjunto.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "tecnologia",
    text: "La computación cuántica promete revolucionar la capacidad de procesamiento de información, abordando problemas actualmente intratables para los ordenadores convencionales. A diferencia de los bits clásicos, que pueden ser 0 o 1, los qubits pueden existir en superposiciones de ambos estados simultáneamente gracias a los principios de la mecánica cuántica. Esta propiedad, junto con fenómenos como el entrelazamiento cuántico, permite a los ordenadores cuánticos realizar ciertas operaciones de forma exponencialmente más rápida. Aunque todavía estamos en las primeras etapas de esta tecnología, con dispositivos que contienen decenas de qubits inestables, el potencial es enorme: desde la simulación de sistemas químicos complejos para el descubrimiento de nuevos materiales y medicamentos, hasta la ruptura de los sistemas criptográficos actuales, lo que plantea importantes implicaciones para la seguridad de la información en el futuro.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "tecnologia",
    text: "El desarrollo de la tecnología blockchain ha trascendido su aplicación inicial en criptomonedas como Bitcoin para ofrecer nuevas posibilidades en diversos sectores. Esta tecnología de registro distribuido permite crear bases de datos inmutables y transparentes sin necesidad de una autoridad central, garantizando la integridad de la información mediante consenso criptográfico. Más allá de las finanzas descentralizadas, blockchain está encontrando aplicaciones en cadenas de suministro, donde permite rastrear productos desde su origen hasta el consumidor final; en sistemas de identidad digital soberana, donde los usuarios controlan sus datos personales; en votaciones electrónicas, donde aumenta la transparencia y verificabilidad; y en la gestión de derechos de propiedad intelectual, facilitando la compensación directa a creadores. Sin embargo, persisten desafíos significativos relacionados con la escalabilidad, el consumo energético y la integración con marcos legales existentes.",
    language: "es",
    difficulty: "avanzado"
  },

  // TEXTOS FILOSÓFICOS - AVANZADOS
  {
    theme: "filosofia",
    text: "La cuestión del libre albedrío ha sido un tema central en la filosofía occidental desde la antigüedad. ¿Somos verdaderamente libres en nuestras decisiones o estamos determinados por causas previas? El determinismo sostiene que todo evento, incluidas las acciones humanas, está causalmente determinado por eventos anteriores y las leyes naturales, lo que parece contradecir nuestra intuición de libertad. El compatibilismo intenta reconciliar estas posiciones, argumentando que la libertad no requiere ausencia de causación, sino ausencia de coerción externa: somos libres cuando actuamos según nuestros deseos, aunque estos estén determinados. Por otro lado, el libertarismo filosófico defiende que al menos algunas de nuestras acciones escapan a la cadena causal determinista. Las neurociencias modernas han añadido nuevas dimensiones a este debate, revelando que muchas decisiones que creemos conscientes están influenciadas por procesos cerebrales inconscientes, lo que plantea profundas preguntas sobre la naturaleza de la agencia humana y la responsabilidad moral.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "filosofia",
    text: "El problema mente-cuerpo, o la relación entre los fenómenos mentales y los procesos físicos del cerebro, constituye uno de los mayores enigmas filosóficos. El dualismo cartesiano postula que mente y cuerpo son sustancias fundamentalmente distintas, pero esta posición enfrenta la dificultad de explicar cómo interactúan entidades de naturaleza tan diferente. El materialismo, predominante en la ciencia contemporánea, sostiene que los estados mentales son idénticos a, o emergen de, estados cerebrales físicos, aunque esta visión lucha por explicar la experiencia subjetiva o qualia. El funcionalismo propone que los estados mentales se definen por su rol funcional, independientemente del sustrato físico que los implementa, abriendo la posibilidad de que sistemas no biológicos puedan tener experiencias conscientes. Mientras tanto, teorías como el panpsiquismo sugieren que la consciencia podría ser una propiedad fundamental del universo, presente en cierto grado en toda la materia. Este debate no es meramente académico: tiene profundas implicaciones para nuestra comprensión de la identidad personal, la posibilidad de inteligencia artificial consciente y el lugar de la humanidad en el cosmos.",
    language: "es",
    difficulty: "avanzado"
  },

  // TEXTOS DE HISTORIA - AVANZADOS
  {
    theme: "historia",
    text: "La Revolución Industrial, iniciada en Gran Bretaña a finales del siglo XVIII, representa uno de los puntos de inflexión más significativos en la historia de la humanidad. La transición de una economía agraria y artesanal a otra dominada por la industria y la manufactura mecanizada transformó profundamente no solo los sistemas de producción, sino también las estructuras sociales, políticas y culturales. La invención de la máquina de vapor por James Watt en 1769 catalizó este proceso, permitiendo la mecanización de industrias como la textil y la metalúrgica, y revolucionando el transporte con el ferrocarril y los barcos de vapor. El éxodo rural hacia las ciudades industriales creó una nueva clase obrera urbana que trabajaba en condiciones frecuentemente deplorables, lo que eventualmente condujo al surgimiento de movimientos sindicales y teorías políticas como el socialismo. Simultáneamente, emergió una poderosa clase media industrial y comercial que desafió el dominio tradicional de la aristocracia terrateniente. Los avances tecnológicos se aceleraron, alimentándose mutuamente en un ciclo de innovación continua que elevó exponencialmente la productividad y, a largo plazo, el nivel de vida, aunque con costos sociales y ambientales significativos que aún hoy seguimos gestionando.",
    language: "es",
    difficulty: "avanzado"
  },
  {
    theme: "historia",
    text: "La Guerra Fría, que dominó las relaciones internacionales durante casi medio siglo tras la Segunda Guerra Mundial, no fue un conflicto armado directo entre las superpotencias, sino una compleja confrontación ideológica, política, económica, tecnológica y cultural entre Estados Unidos y la Unión Soviética. Este enfrentamiento bipolar dividió al mundo en esferas de influencia, manifestándose en conflictos periféricos como las guerras de Corea y Vietnam, crisis como la de los misiles en Cuba, y una carrera armamentística nuclear que llevó a la humanidad al borde de la aniquilación. La doctrina de la destrucción mutua asegurada paradójicamente contribuyó a evitar un enfrentamiento directo, mientras que la competencia se trasladó a otros ámbitos como la carrera espacial, que produjo logros tecnológicos extraordinarios. El colapso del bloque soviético entre 1989 y 1991 marcó el fin de esta era, pero sus consecuencias geopolíticas persisten en el siglo XXI, desde la configuración de alianzas militares como la OTAN hasta conflictos regionales en zonas que fueron escenarios de disputa durante este periodo. La Guerra Fría demuestra cómo las ideologías pueden movilizar recursos globales y configurar el destino de naciones enteras, incluso sin confrontación militar directa entre los principales antagonistas.",
    language: "es",
    difficulty: "avanzado"
  },

  // TEXTOS INTERMEDIOS - VARIADOS
  {
    theme: "general",
    text: "El aprendizaje de mecanografía requiere práctica constante y atención a la técnica correcta. Mantener una postura adecuada es fundamental: la espalda recta, los hombros relajados y los pies apoyados en el suelo. Los dedos deben descansar ligeramente sobre la fila central del teclado, con los pulgares sobre la barra espaciadora. Cada dedo es responsable de teclas específicas, y con el tiempo, este patrón se vuelve automático. La clave está en comenzar lentamente, priorizando la precisión sobre la velocidad, y aumentar gradualmente el ritmo a medida que se desarrolla la memoria muscular. Los ejercicios regulares que incluyen todas las letras, números y símbolos comunes ayudan a construir fluidez. Con dedicación, la mayoría de las personas pueden alcanzar velocidades de 60 a 80 palabras por minuto, lo que representa una habilidad valiosa en la era digital.",
    language: "es",
    difficulty: "intermedio"
  },
  {
    theme: "general",
    text: "La fotografía digital ha democratizado el arte de capturar imágenes, permitiendo a cualquier persona con un smartphone documentar momentos y expresar creatividad visual. Sin embargo, dominar esta forma de expresión va más allá de simplemente presionar un botón. Comprender conceptos como la exposición (el balance entre apertura, velocidad de obturación y sensibilidad ISO), la composición (utilizando reglas como la de los tercios o las líneas principales) y la iluminación (natural o artificial) puede transformar fotografías ordinarias en imágenes impactantes. El proceso no termina con la captura: el revelado digital permite ajustar parámetros como contraste, saturación y balance de blancos para refinar la visión original. En un mundo saturado de imágenes, desarrollar un estilo personal y una mirada única se ha vuelto tan importante como el dominio técnico.",
    language: "es",
    difficulty: "intermedio"
  },
  {
    theme: "general",
    text: "El ajedrez, con más de 1500 años de historia, sigue fascinando a millones de personas en todo el mundo. Este juego de estrategia, que simula una batalla entre dos ejércitos, combina elementos tácticos, posicionales y psicológicos. Cada pieza tiene movimientos únicos: el rey se mueve una casilla en cualquier dirección, la dama combina los movimientos de torre y alfil, las torres se desplazan en líneas rectas, los alfiles en diagonales, los caballos en forma de L, y los peones avanzan hacia adelante con capacidad de capturar en diagonal. El objetivo es dar jaque mate al rey contrario, colocándolo bajo ataque sin posibilidad de escape. Las aperturas, el medio juego y los finales requieren diferentes enfoques estratégicos, y los jugadores deben anticipar múltiples movimientos futuros. Aunque las reglas básicas pueden aprenderse rápidamente, dominar el ajedrez es una búsqueda que puede durar toda la vida.",
    language: "es",
    difficulty: "intermedio"
  },
  {
    theme: "general",
    text: "La cocina mediterránea, reconocida por la UNESCO como Patrimonio Cultural Inmaterial de la Humanidad, representa más que un conjunto de recetas: es un estilo de vida que promueve la convivencia y el respeto por la tradición y la tierra. Basada en la tríada de aceite de oliva, cereales y vino, complementada con abundantes verduras, legumbres, frutas, pescados y un consumo moderado de lácteos y carnes, esta dieta ha demostrado beneficios significativos para la salud cardiovascular. Cada región mediterránea aporta sus propias especialidades: las tapas españolas, la pasta italiana, el mezze griego, el cuscús norteafricano. La frescura y estacionalidad de los ingredientes son fundamentales, así como las técnicas de cocción que preservan los sabores naturales. Los mercados locales, las comidas familiares prolongadas y la sobremesa son aspectos culturales tan importantes como los alimentos mismos, reflejando una filosofía que valora el placer de comer como experiencia social y sensorial.",
    language: "es",
    difficulty: "intermedio"
  },

  // TEXTOS BÁSICOS - VARIADOS
  {
    theme: "general",
    text: "La lectura es una de las habilidades más importantes que podemos desarrollar. Nos permite aprender, imaginar y conectar con otras personas a través del tiempo y el espacio. Cuando leemos un libro, no solo decodificamos palabras, sino que construimos significados y expandimos nuestra comprensión del mundo. Los buenos lectores desarrollan estrategias como predecir, cuestionar, visualizar y resumir. Estas técnicas ayudan a mejorar la comprensión y retención de la información. Además, la lectura regular fortalece el vocabulario y mejora las habilidades de escritura. En un mundo digital, la capacidad de leer críticamente es más importante que nunca para evaluar la credibilidad de la información que encontramos.",
    language: "es",
    difficulty: "básico"
  },
  {
    theme: "general",
    text: "El ejercicio físico regular ofrece numerosos beneficios para la salud física y mental. Caminar treinta minutos diarios puede reducir el riesgo de enfermedades cardíacas, diabetes y algunos tipos de cáncer. También fortalece los músculos y huesos, mejorando la movilidad y previniendo lesiones. Desde el punto de vista mental, el ejercicio libera endorfinas, conocidas como las hormonas de la felicidad, que reducen el estrés y mejoran el estado de ánimo. Actividades como yoga o tai chi combinan movimiento con técnicas de respiración, promoviendo la relajación. Lo importante es encontrar una actividad que disfrutemos y convertirla en un hábito regular, adaptándola a nuestra condición física y preferencias personales.",
    language: "es",
    difficulty: "básico"
  },
  {
    theme: "general",
    text: "La música ha formado parte de todas las culturas humanas a lo largo de la historia. Desde los ritmos tribales hasta las sinfonías clásicas o el pop moderno, la música nos conecta con nuestras emociones y con los demás. Aprender a tocar un instrumento desarrolla habilidades cognitivas como la memoria, la coordinación y la concentración. Estudios científicos demuestran que la educación musical mejora el rendimiento académico en otras áreas como matemáticas y lenguaje. Escuchar música puede reducir la ansiedad, aliviar el dolor y mejorar la calidad del sueño. Ya sea como intérpretes o como oyentes, la música enriquece nuestras vidas y nos ofrece una forma universal de expresión que trasciende barreras culturales y lingüísticas.",
    language: "es",
    difficulty: "básico"
  }
];

// Textos en inglés para práctica de mecanografía (como respaldo)
export const englishTypingTexts: ThemedText[] = [
  {
    theme: "general",
    text: "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
    language: "en",
    difficulty: "básico"
  },
  {
    theme: "general",
    text: "Typing is a fundamental skill in today's digital world. Regular practice can significantly improve your typing speed and accuracy.",
    language: "en",
    difficulty: "básico"
  }
];

// Combinar todos los textos disponibles
export const themedTypingTexts: ThemedText[] = [...spanishTypingTexts, ...englishTypingTexts];

// Obtener todos los textos disponibles
export const getAllTexts = (): string[] => {
  // Priorizar textos en español
  const spanishTexts = spanishTypingTexts.map(item => item.text);

  // Si no hay suficientes textos en español, añadir algunos en inglés
  if (spanishTexts.length < 10) {
    const englishTexts = englishTypingTexts.map(item => item.text);
    return [...spanishTexts, ...englishTexts];
  }

  return spanishTexts;
};

// Obtener textos por nivel de dificultad
export const getTextsByDifficulty = (difficulty: 'básico' | 'intermedio' | 'avanzado'): string[] => {
  // Filtrar por dificultad
  const filteredTexts = spanishTypingTexts
    .filter(item => item.difficulty === difficulty);

  // Aplicar filtros adicionales basados en la longitud del texto según la dificultad
  let lengthFilteredTexts = filteredTexts;

  if (difficulty === 'básico') {
    // Textos básicos: preferir textos más cortos (menos de 300 caracteres)
    lengthFilteredTexts = filteredTexts.filter(item => item.text.length < 300);
    // Si no hay suficientes textos cortos, usar todos los de dificultad básica
    if (lengthFilteredTexts.length < 3) {
      lengthFilteredTexts = filteredTexts;
    }
  } else if (difficulty === 'intermedio') {
    // Textos intermedios: preferir textos de longitud media (entre 300 y 600 caracteres)
    lengthFilteredTexts = filteredTexts.filter(item => item.text.length >= 300 && item.text.length < 600);
    // Si no hay suficientes textos de longitud media, usar todos los de dificultad intermedia
    if (lengthFilteredTexts.length < 3) {
      lengthFilteredTexts = filteredTexts;
    }
  } else if (difficulty === 'avanzado') {
    // Textos avanzados: preferir textos más largos (600 caracteres o más)
    lengthFilteredTexts = filteredTexts.filter(item => item.text.length >= 600);
    // Si no hay suficientes textos largos, usar todos los de dificultad avanzada
    if (lengthFilteredTexts.length < 3) {
      lengthFilteredTexts = filteredTexts;
    }
  }

  return lengthFilteredTexts.map(item => item.text);
};

// Obtener textos aleatorios sin repetición
export const getRandomTexts = async (count: number = 5): Promise<string[]> => {
  // Obtener todos los textos disponibles en español
  const allTexts = spanishTypingTexts.map(item => item.text);

  // Si no hay suficientes textos, devolver todos los disponibles
  if (allTexts.length <= count) {
    return allTexts;
  }

  // Seleccionar textos aleatorios sin repetición
  const selectedTexts: string[] = [];
  const usedIndices = new Set<number>();

  while (selectedTexts.length < count && usedIndices.size < allTexts.length) {
    const randomIndex = Math.floor(Math.random() * allTexts.length);

    // Evitar repeticiones
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedTexts.push(allTexts[randomIndex]);
    }
  }

  return selectedTexts;
};
