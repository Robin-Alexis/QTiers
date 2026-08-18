// Jeu de questions initial. reponses = [A, B, C, D], bonne = index (0..3).
// Les positions de la bonne réponse sont volontairement variées, et le jeu
// mélange de toute façon l'ordre des réponses à l'affichage.
export const SEED_QUESTIONS = [
  // ---- Clins d'oeil Agrial / RAC ----
  { categorie: 'Agrial', difficulte: 'facile', question: "Que signifie l'acronyme RAC ?", reponses: ['Réseau Agricole Coopératif', 'Référentiel Adhérent Client', 'Registre Agricole Central', 'Référentiel Agrial Comptable'], bonne: 1 },
  { categorie: 'Agrial', difficulte: 'moyen', question: 'Combien de chiffres compose un numéro SIREN ?', reponses: ['14', '9', '13', '5'], bonne: 1 },
  { categorie: 'Agrial', difficulte: 'moyen', question: 'Combien de chiffres compose un numéro SIRET ?', reponses: ['9', '13', '14', '12'], bonne: 2 },
  { categorie: 'Agrial', difficulte: 'facile', question: "Dans le RAC, que représente un « tiers » ?", reponses: ['Un tracteur', 'Une parcelle', 'Un adhérent ou un client', 'Un salarié'], bonne: 2 },
  { categorie: 'Agrial', difficulte: 'moyen', question: 'Que signifie la BAN, utilisée pour vérifier les adresses ?', reponses: ['Banque Agricole Nationale', 'Bureau Agricole du Nord', 'Base Adresse Nationale', 'Base Agrial Numérique'], bonne: 2 },
  { categorie: 'Agrial', difficulte: 'facile', question: 'Dans quelle région se trouve le siège historique d\'Agrial ?', reponses: ['La Provence', 'La Normandie', "L'Alsace", 'La Corse'], bonne: 1 },

  // ---- Agriculture ----
  { categorie: 'Agriculture', difficulte: 'facile', question: 'De quel animal provient le lait du Camembert de Normandie AOP ?', reponses: ['La chèvre', 'La vache', 'La brebis', 'La jument'], bonne: 1 },
  { categorie: 'Agriculture', difficulte: 'moyen', question: 'Quelle céréale est la plus cultivée en France (en surface) ?', reponses: ['Le maïs', "L'orge", 'Le blé tendre', 'Le riz'], bonne: 2 },
  { categorie: 'Agriculture', difficulte: 'facile', question: 'Que produisent les plantes grâce à la photosynthèse ?', reponses: ['Du CO2 uniquement', "De l'oxygène et des sucres", "De l'azote", 'Des protéines animales'], bonne: 1 },
  { categorie: 'Agriculture', difficulte: 'moyen', question: 'Environ combien de litres de lait pour produire 1 kg de beurre ?', reponses: ['2 litres', '100 litres', 'Environ 22 litres', '5 litres'], bonne: 2 },
  { categorie: 'Agriculture', difficulte: 'facile', question: "Quel est l'aliment de base d'un bovin ruminant ?", reponses: ['Le poisson', "L'herbe", 'Le pain', 'Le sucre'], bonne: 1 },
  { categorie: 'Agriculture', difficulte: 'moyen', question: 'Que signifie la PAC ?', reponses: ['Plan Agricole Coopératif', 'Politique Agricole Commune', 'Programme Agraire Central', 'Pacte Agricole Communal'], bonne: 1 },
  { categorie: 'Agriculture', difficulte: 'moyen', question: 'Quel gaz les plantes absorbent-elles principalement pour croître ?', reponses: ["L'oxygène", 'Le dioxyde de carbone', "L'hélium", "L'azote pur"], bonne: 1 },

  // ---- Culture générale ----
  { categorie: 'Culture générale', difficulte: 'moyen', question: "Quelle est la capitale de l'Australie ?", reponses: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], bonne: 2 },
  { categorie: 'Culture générale', difficulte: 'facile', question: 'Combien de côtés a un hexagone ?', reponses: ['5', '6', '7', '8'], bonne: 1 },
  { categorie: 'Culture générale', difficulte: 'facile', question: 'Qui a peint la Joconde ?', reponses: ['Picasso', 'Monet', 'Léonard de Vinci', 'Van Gogh'], bonne: 2 },
  { categorie: 'Culture générale', difficulte: 'facile', question: 'Quelle planète est la plus proche du Soleil ?', reponses: ['Vénus', 'Mercure', 'Mars', 'La Terre'], bonne: 1 },
  { categorie: 'Culture générale', difficulte: 'facile', question: 'En quelle année débute la Révolution française ?', reponses: ['1815', '1789', '1914', '1492'], bonne: 1 },
  { categorie: 'Culture générale', difficulte: 'facile', question: 'Quel est le plus grand océan du monde ?', reponses: ['Atlantique', 'Pacifique', 'Indien', 'Arctique'], bonne: 1 },
  { categorie: 'Culture générale', difficulte: 'facile', question: 'Combien de joueurs composent une équipe de football sur le terrain ?', reponses: ['7', '11', '9', '15'], bonne: 1 }
]
