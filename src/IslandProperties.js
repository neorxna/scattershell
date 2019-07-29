const IslandTypes = {
  Rocks: 'rocky',
  Guano: 'guano',
  Small: 'small',
  Medium: 'medium',
  Large: 'large'
}

const IslandDescriptions = {
  [IslandTypes.Rocks]:
    'You are disappointed to find an inhospitable outcrop of rocks in the middle of the ocean.',
  [IslandTypes.Guano]:
    'This place is covered in guano, hospitable only to the many gulls that dwell here.',
  [IslandTypes.Small]: 'You look out upon a modest but hospitable island.',
  [IslandTypes.Medium]:
    'You are relieved to find a hospitable and plentiful island.',
  [IslandTypes.Large]:
    'You are thankful to the gods to find a massive volcanic island, capable of sustaining a large population.'
}

const IslandIllustrations = {
  [IslandTypes.Rocks]: '/island_types/rock_cropped.png',
  [IslandTypes.Guano]: '/island_types/gull3_cropped.png',
  [IslandTypes.Small]: '/island_types/shells_cropped.png',
  [IslandTypes.Medium]: '/island_types/coconuts_cropped.png',
  [IslandTypes.Large]: '/island_types/volcano_cropped.png'
}

const IslandMaxPopulations = {
  [IslandTypes.Rocks]: 0,
  [IslandTypes.Guano]: 5,
  [IslandTypes.Small]: 10,
  [IslandTypes.Medium]: 25,
  [IslandTypes.Large]: 50
}

const DevelopmentLevel = {
  Undeveloped: 'undeveloped',
  Burgeoning: 'burgeoning',
  Developed: 'developed',
  HighlyDeveloped: 'highly developed',
  Advanced: 'advanced'
}

export {
  IslandTypes,
  IslandDescriptions,
  IslandIllustrations,
  IslandMaxPopulations,
  DevelopmentLevel
}
