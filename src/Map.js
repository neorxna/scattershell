import React, { useRef, useEffect } from 'react'
import './App.css'
import * as SVG from 'svg.js'
import rough from 'roughjs/dist/rough.umd'
import { Colors } from './Theme'
import { IslandTypes } from './IslandProperties'
import { islandsDetails } from './Game'

const defaultScattershellMapProps = {
  places: [
    { id: 'a', x: 80, y: 120, name: 'A' },
    {
      id: 'b',
      x: 200,
      y: 100,
      name: 'B',
      isActive: true,
      isBig: true
    },
    { id: 'c', x: 150, y: 250, name: 'C', isBig: true }
  ],

  //paths: [['a', 'b'], ['b', 'c']],

  paths: [],
  baseMarkerOptions: {
    //stroke: Colors.Outline,
    fill: Colors.Green, //Colors.Outline,
    fillStyle: 'solid',
    hachureAngle: 65,
    roughness: 2,
    stroke: 0,
    fillWeight: 2,
    bowing: 2
  },

  activePlaceOptions: {
    fill: Colors.Green,
    stroke: Colors.Light,
    strokeWidth: 5
  },

  inactivePlaceOptions: {},
  pathOptions: {},

  sizes: {
    [IslandTypes.Rocks]: 5,
    [IslandTypes.Guano]: 10,
    [IslandTypes.Small]: 15,
    [IslandTypes.Medium]: 20,
    [IslandTypes.Large]: 35
  }
}

function ScattershellMap(props) {
  const {
    islands,
    paths,
    baseMarkerOptions,
    activePlaceOptions,
    inactivePlaceOptions,
    lineOptions,
    sizes,
    currentIsland // string
  } = {
    ...defaultScattershellMapProps,
    ...props
  }

  const xOffset = -40,
    yOffset = 0

  const opts = baseMarkerOptions

  const righties = ['The Pip', 'Elder', 'Father']

  const svgRef = useRef(null)

  function renderMap(svg) {
    const rc = rough.svg(svg)
    const draw = SVG(svg) //svg.js draw

    /* draw.click(event => {
      let x = event.clientX - draw.parent.offsetLeft,
        y = event.clientY - draw.parent.offsetTop
      
        console.log(x,y)
    })*/

    const placeMarker = ({ name, x, y, type, markerOptions }) => {
      let circleOpts = {
        ...opts,
        ...(name === currentIsland ? activePlaceOptions : inactivePlaceOptions),
        ...markerOptions
      }
      return rc.circle(
        x * 5 + xOffset,
        y * 5 + yOffset,
        sizes[type],
        circleOpts
      )
    }
    const pathMarker = (place1, place2) =>
      rc.line(place1.x, place1.y, place2.x, place2.y, {
        ...opts,
        ...lineOptions,
        stroke: Colors.Light
      })

    const labelMarker = place => {
      draw
        .link('javascript:;')
        .text(place.name)
        .fill(Colors.Light)
        .x(
          place.x * 5 +
            xOffset +
            (righties.indexOf(place.name) !== -1 ? +25 + sizes[place.type] : 0)
        )
        .y(
          place.y * 5 +
            yOffset +
            (righties.indexOf(place.name) !== -1
              ? -8
              : sizes[place.type] / 2 + 1)
        ) //(place.isBig ? 30 : 20))
        .font({
          family: 'Open Sans',
          size: 16,
          anchor: 'middle'
        })
        .on('click', () => {
          props.setCurrentIsland(place.name)
        })
    }

    Object.values(islandsDetails(islands)).forEach(place => {
      if (place.isDiscovered) {
        let marker = placeMarker(place)
        svg.appendChild(marker)
        labelMarker(place)
      }
    })

    paths.forEach(([fromId, toId]) => {
      let marker = pathMarker(islands[fromId], islands[toId])
      svg.appendChild(marker)
    })
  }

  // Render initial
  useEffect(() => {
    let svg = svgRef.current
    renderMap(svg)
  }, [svgRef.current])

  const reRender = () => {
    let svg = svgRef.current
    if (svg) {
      while (svg.lastChild) {
        svg.removeChild(svg.lastChild)
      }
      renderMap(svg)
    }
  }

  // Re-render when islands are discovered or current island changes
  const discoveries = Object.entries(islands).map(
    ([name, place]) => place.isDiscovered
  )

  useEffect(reRender, discoveries)
  useEffect(reRender, [currentIsland])

  return <svg ref={svgRef} className={'map-svg'} />
}

export default ScattershellMap
