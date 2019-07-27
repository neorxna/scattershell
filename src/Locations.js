import { IslandTypes } from './IslandProperties'
import { ResourceTypes } from './Resources';

const paths = [
  ['Morrigan', 'The Crook', 16],
  ['The Crook', 'Morrigan', 16],
  ['Morrigan', 'Great Arc', 20],
  ['Great Arc', 'Morrigan', 20],
  ['Fivestone', 'The Crook', 14],
  ['The Crook', 'Fivestone', 14],
  ['Shell Cove', 'Great Arc', 12],
  ['Great Arc', 'Shell Cove', 12],
  ['The Splinter', 'Great Arc', 25],
  ['Great Arc', 'The Splinter', 25],
  ['The Pip', 'The Splinter', 15],
  ['The Splinter', 'The Pip', 15],
  ['Afallon', 'The Splinter', 22],
  ['The Splinter', 'Afallon', 22],
  ['Brightreach', 'The Splinter', 23],
  ['The Splinter', 'Brightreach', 23],
  ['Afallon', 'The Pip', 7],
  ['The Pip', 'Afallon', 7],
  ['Brightreach', 'The Pip', 13],
  ['The Pip', 'Brightreach', 13],
  ['Birdstar', 'The Pip', 25],
  ['The Pip', 'Birdstar', 25],
  ['Brightreach', 'Afallon', 12],
  ['Afallon', 'Brightreach', 12],
  ['Old Crone', 'Birdstar', 20],
  ['Birdstar', 'Old Crone', 20],
  ['Gull\'s Rest', 'Shell Cove', 22],
  ['Shell Cove', 'Gull\'s Rest', 22],
  ['Mother', 'Shell Cove', 28],
  ['Shell Cove', 'Mother', 28],
  ['Elder', 'Shell Cove', 30],
  ['Shell Cove', 'Elder', 30],
  ['Younger', 'Mother', 15],
  ['Mother', 'Younger', 15],
  ['Father', 'Mother', 10],
  ['Mother', 'Father', 10],
  ['Twinstone', 'Mother', 11],
  ['Mother', 'Twinstone', 11],
  ['Obsidian Point', 'Gull\'s Rest', 13],
  ['Gull\'s Rest', 'Obsidian Point', 13],
  ['Last Hope', 'Obsidian Point', 30],
  ['Obsidian Point', 'Last Hope', 30],
  ['Island of Pearls', 'Obsidian Point', 29],
  ['Obsidian Point', 'Island of Pearls', 29],
  ['Island of Pearls', 'Last Hope', 9],
  ['Last Hope', 'Island of Pearls', 9],
]

const neighbourDistance = source => {
  let pathsForSource = paths.filter(([a, b, dist]) => source === a)
  let neighbours = pathsForSource.reduce((obj, [a,b,dist]) => {
    return {...obj, [b]: dist}
  }, {})
  return neighbours
}

const loc = (name, type, x, y, resources) => ({
  id: name,
  name,
  x,
  y,
  type,
  resources: resources.map(res => ResourceTypes[res]),
  neighbours: Object.keys(neighbourDistance(name)),
  neighbourDistance: neighbourDistance(name)
})

const ScattershellLocations = {
  'Shell Cove': loc('Shell Cove', IslandTypes.Small, 63, 49, [
    'PreciousShells',
    'Fish'
  ]),
  'Great Arc': loc('Great Arc', IslandTypes.Large, 56, 58, [
    'Flax',
    'Bamboo',
    'BushFood',
    'RootVegetables',
    'SturdyWood'
  ]),
  'Morrigan': loc('Morrigan', IslandTypes.Medium, 46, 75, [
    'Fish',
    'RootVegetables',
    'BushFood',
    'Flax'
  ]),
  'The Crook': loc('The Crook', IslandTypes.Small, 34, 87, [
    'Shellfish',
    'Fish',
    'PreciousShells'
  ]),
  Fivestone: loc('Fivestone', IslandTypes.Rocks, 23, 93, []),
  'Elder': loc('Elder', IslandTypes.Rocks, 87, 55, []),
  'Younger': loc('Younger', IslandTypes.Guano, 95, 48, [
    'Guano',
    'Birds'
  ]),
  Mother: loc('Mother', IslandTypes.Medium, 86, 60, [
    'Flax',
    'Birds',
    'PreciousShells',
    'BushFood'
  ]),
  Father: loc('Father', IslandTypes.Medium, 95, 60, [
    'Bamboo',
    'Fish',
    'Pigs',
    'SturdyWood'
  ]),
  'Twinstone': loc('Twinstone', IslandTypes.Rocks, 92, 70, []),
  Birdstar: loc('Birdstar', IslandTypes.Guano, 40, 30, ['Guano', 'Birds']),
  'Last Hope': loc('Last Hope', IslandTypes.Large, 97, 8, [
    'Shellfish',
    'Fish',
    'Birds',
    'SturdyWood',
    'FreshWater'
  ]),
  'Island of Pearls': loc('Island of Pearls', IslandTypes.Small, 98, 18, [
    'PreciousShells',
    'Shellfish',
    'Coconuts'
  ]),
  'Obsidian Point': loc('Obsidian Point', IslandTypes.Rocks, 73, 19, []),
  "Gull's Rest": loc("Gull's Rest", IslandTypes.Guano, 70, 30, [
    'Guano',
    'Birds'
  ]),
  'Old Crone': loc('Old Crone', IslandTypes.Medium, 40, 10, [
    'Coconuts',
    'RootVegetables',
    'Pigs',
    'BushFood'
  ]),
  'The Splinter': loc('The Splinter', IslandTypes.Rocks, 33, 55, []),
  Afallon: loc('Afallon', IslandTypes.Large, 14, 45, [
    'FruitTrees',
    'FreshWater',
    'SturdyWood',
    'Birds',
    'Pigs'
  ]),
  'The Pip': loc('The Pip', IslandTypes.Small, 22, 47, [
    'FruitTrees',
    'Fish',
    'SturdyWood'
  ]),
  Brightreach: loc('Brightreach', IslandTypes.Medium, 23, 35, [
    'PreciousShells',
    'FreshWater',
    'Flax',
    'Shellfish'
  ])
}

export { ScattershellLocations }
