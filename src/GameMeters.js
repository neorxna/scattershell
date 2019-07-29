import React from 'react'
import { Colors } from './Theme'
import { useSpring, animated } from 'react-spring'
import { tickInterval } from './Engine'
import * as numeral from 'numeral'

function GameMeter(props) {
  const { qty, Δ, text } = props
  const interpolator = useSpring({
    qty,
    from: { qty: qty - Δ },
    config: { duration: tickInterval }
  })
  function deltaView(Δ) {
    return Δ === 0 ? null : (
      <span
        className={'game-meter-delta'}
        style={{ color: Δ > 0 ? Colors.Green : 'red' }}
      >{`${Δ > 0 ? '+' : ''}${Δ}`}</span>
    )
  }

  return (
    <li>
      <h4 className={'game-meter-number'}>
        <animated.span>
          {interpolator.qty.interpolate(x => {
            const num = Math.round(x)
            return num >= 1000 ? numeral(num).format('0.0a') : num
          })}
        </animated.span>{' '}
        {deltaView(Δ)}
      </h4>{' '}
      {text}
    </li>
  )
}

/*<section>
  <h3>total scores</h3>
  <ul>
    <li>islands discovered</li>
    <li>population</li>
    <li>dwellings</li>
    <li>treasures</li>
    <li>temples</li>
  <0/ul>
</section>*/

function GameMeters(props) {
  const { deltas, player } = props
  const { wood, food, wind, energy } = player
  const { woodΔ, foodΔ, energyΔ, windΔ } = deltas

  return (
    <section className={'game-meters-container'}>
      <ul className={'game-meters'}>
        <GameMeter qty={food} Δ={foodΔ} text={'food 🥝'} />
        <GameMeter qty={wood} Δ={woodΔ} text={'materials ⚒️'} />
        <GameMeter qty={energy} Δ={energyΔ} text={'energy ⚡'} />
        <GameMeter qty={wind} Δ={windΔ} text={'wind 💨'} />
      </ul>
    </section>
  )
}

export { GameMeters }
