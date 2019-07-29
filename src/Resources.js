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

const IsGardenFood = {
  [ResourceTypes.Shellfish]: false,
  [ResourceTypes.Fish]: false,
  [ResourceTypes.Pigs]: false,
  [ResourceTypes.Birds]: false,
  [ResourceTypes.BushFood]: false,
  [ResourceTypes.Coconuts]: false,
  [ResourceTypes.RootVegetables]: true,
  [ResourceTypes.PreciousShells]: false,
  [ResourceTypes.FreshWater]: false,
  [ResourceTypes.Flax]: false,
  [ResourceTypes.Bamboo]: false,
  [ResourceTypes.SturdyWood]: false,
  [ResourceTypes.FruitTrees]: true,
  [ResourceTypes.Guano]: false
}

const RequiresGathering = {
  [ResourceTypes.Shellfish]: false,
  [ResourceTypes.Fish]: false,
  [ResourceTypes.Pigs]: false,
  [ResourceTypes.Birds]: false,
  [ResourceTypes.BushFood]: false,
  [ResourceTypes.Coconuts]: true,
  [ResourceTypes.RootVegetables]: true,
  [ResourceTypes.PreciousShells]: true,
  [ResourceTypes.FreshWater]: false,
  [ResourceTypes.Flax]: false,
  [ResourceTypes.Bamboo]: false,
  [ResourceTypes.SturdyWood]: true,
  [ResourceTypes.FruitTrees]: false,
  [ResourceTypes.Guano]: false
}

const IsDispersible = {
  [ResourceTypes.Shellfish]: false,
  [ResourceTypes.Fish]: false,
  [ResourceTypes.Pigs]: true,
  [ResourceTypes.Birds]: false,
  [ResourceTypes.BushFood]: false,
  [ResourceTypes.Coconuts]: true,
  [ResourceTypes.RootVegetables]: true,
  [ResourceTypes.PreciousShells]: false,
  [ResourceTypes.FreshWater]: false,
  [ResourceTypes.Flax]: false,
  [ResourceTypes.Bamboo]: false,
  [ResourceTypes.SturdyWood]: false,
  [ResourceTypes.FruitTrees]: true,
  [ResourceTypes.Guano]: true
}

const FoodPerResources = {
  [ResourceTypes.Shellfish]: 2,
  [ResourceTypes.Fish]: 3,
  [ResourceTypes.Pigs]: 2,
  [ResourceTypes.Birds]: 1,
  [ResourceTypes.BushFood]: 3,
  [ResourceTypes.Coconuts]: 2,
  [ResourceTypes.RootVegetables]: 1,
  [ResourceTypes.PreciousShells]: 0,
  [ResourceTypes.FreshWater]: 2,
  [ResourceTypes.Flax]: 0,
  [ResourceTypes.Bamboo]: 1,
  [ResourceTypes.SturdyWood]: 0,
  [ResourceTypes.FruitTrees]: 2,
  [ResourceTypes.Guano]: 0
}

const WoodPerResources = {
  [ResourceTypes.Shellfish]: 1,
  [ResourceTypes.Fish]: 0,
  [ResourceTypes.Pigs]: 1,
  [ResourceTypes.Birds]: 1,
  [ResourceTypes.BushFood]: 0,
  [ResourceTypes.Coconuts]: 2,
  [ResourceTypes.RootVegetables]: 0,
  [ResourceTypes.PreciousShells]: 2,
  [ResourceTypes.FreshWater]: 0,
  [ResourceTypes.Flax]: 3,
  [ResourceTypes.Bamboo]: 2,
  [ResourceTypes.SturdyWood]: 2,
  [ResourceTypes.FruitTrees]: 1,
  [ResourceTypes.Guano]: 2
}

const Boons = {}
const Burdens = {}

export {
  ResourceTypes,
  FoodPerResources,
  WoodPerResources,
  Boons,
  Burdens,
  RequiresGathering,
  IsDispersible,
  IsGardenFood
}
