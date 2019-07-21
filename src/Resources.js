const ResourceTypes = {
  Shellfish: 'shellfish',
  Fish: 'fish',
  Pigs: 'pigs',
  Birds: 'birds',
  BushFood: 'bush food',
  Coconuts: 'coconuts',
  RootVegetables: 'root vegetables',
  PreciousShells: 'precious shells',
  FreshWater: 'fresh water',
  Flax: 'flax',
  Bamboo: 'bamboo',
  SturdyWood: 'sturdy wood',
  FruitTrees: 'fruit trees',
  Guano: 'guano'
}

const FoodPerResources = {
  [ResourceTypes.Shellfish]: 1,
  [ResourceTypes.Fish]: 2,
  [ResourceTypes.Pigs]: 1,
  [ResourceTypes.Birds]: 1,
  [ResourceTypes.BushFood]: 2,
  [ResourceTypes.Coconuts]: 1,
  [ResourceTypes.RootVegetables]: 2,
  [ResourceTypes.PreciousShells]: 0,
  [ResourceTypes.FreshWater]: 2,
  [ResourceTypes.Flax]: 0,
  [ResourceTypes.Bamboo]: 1,
  [ResourceTypes.SturdyWood]: 0,
  [ResourceTypes.FruitTrees]: 1,
  [ResourceTypes.Guano]: 0
}

const WoodPerResources = {
  [ResourceTypes.Shellfish]: 1,
  [ResourceTypes.Fish]: 0,
  [ResourceTypes.Pigs]: 1,
  [ResourceTypes.Birds]: 1,
  [ResourceTypes.BushFood]: 0,
  [ResourceTypes.Coconuts]: 1,
  [ResourceTypes.RootVegetables]: 0,
  [ResourceTypes.PreciousShells]: 2,
  [ResourceTypes.FreshWater]: 0,
  [ResourceTypes.Flax]: 2,
  [ResourceTypes.Bamboo]: 1,
  [ResourceTypes.SturdyWood]: 2,
  [ResourceTypes.FruitTrees]: 1,
  [ResourceTypes.Guano]: 1
}

const Boons = {}
const Burdens = {}

export {
  ResourceTypes,
  FoodPerResources,
  WoodPerResources,
  Boons,
  Burdens
}
