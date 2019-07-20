import {IslandTypes} from './Island'

const Birdstar = {
  id: 'Birdstar',
  name: 'Birdstar',
  trueName: 'Artheenkwas',
  x: 30, 
  y: 30,
  type: IslandTypes.Guano,
  resources: [],
  neighbours: ['Great Ark', 'Shellcove', 'Holystone'],
  neighbourDistance: {
    'Great Ark': 359,
    Shellcove: 28,
    Holystone: 62
  },
}

const GreatArk = {
  ...Birdstar
}

const Shellcove = {
  ...Birdstar
}

const Holystone = {
  ...Birdstar
}

const ScattershellLocations = {
  'Birdstar': Birdstar,
  'Great Ark': GreatArk,
  'Shellcove': Shellcove,
  'Holystone': Holystone 
}

export default ScattershellLocations