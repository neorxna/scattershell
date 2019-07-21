import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import * as SVG from 'svg.js'
import rough from 'roughjs/dist/rough.umd'
import Colors from './Theme'
import { IslandTypes } from './Island'
import { link } from 'fs';
import { throwStatement, whileStatement } from '@babel/types';

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
    stroke: Colors.Outline,
    fill: Colors.Outline, //Colors.Outline,
    hachureAngle: 65,
    roughness: 1.5
  },

  activePlaceOptions: {
    fill: Colors.Outline,
    stroke: Colors.Outline
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
  const svgRef = useRef(null)

  function renderMap(svg) {
    const rc = rough.svg(svg)
    const draw = SVG(svg) //svg.js draw

   /* draw.click(event => {
      let x = event.clientX - draw.parent.offsetLeft,
        y = event.clientY - draw.parent.offsetTop
      
        console.log(x,y)
    })*/

    const {
      places,
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

    const xOffset = -25,
      yOffset = -20

    const _places = places
    const opts = baseMarkerOptions

    const righties = ['The Pip', 'Elder Island']

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
        .fill(Colors.Outline)
        .x(place.x * 5 + xOffset + (righties.indexOf(place.name) !== -1 ? 45 : 0))
        .y(place.y * 5 + yOffset + (righties.indexOf(place.name) !== -1 ? -8 : sizes[place.type] / 2)) //(place.isBig ? 30 : 20))
        .font({
          size: 14,
          anchor: 'middle'
        })
        .on('click', ()=>{props.setCurrentIsland(place.name)})
    }

    Object.values(_places).forEach(place => {
      if (place.isDiscovered) {
        let marker = placeMarker(place)
        svg.appendChild(marker)
        labelMarker(place)
      }
    })

    paths.forEach(([fromId, toId]) => {
      let marker = pathMarker(_places[fromId], _places[toId])
      svg.appendChild(marker)
    })
  }

  useEffect(() => {
    let svg = svgRef.current
    renderMap(svg)
  }, [svgRef.current])

  return <svg ref={svgRef} className={'map-svg'} />
}
export default ScattershellMap
