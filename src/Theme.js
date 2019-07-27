import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as i from '@fortawesome/free-solid-svg-icons'
import React from 'react'

const Colors = {
  Deep: '#121258',
  Med: '#5ba9ff',
  Shallow: '#7ccbff',
  Light: '#f3f1f1',
  Outline: '#000d16',
  Green: '#00b842'
}

const fa = (icon, ...props) => {
  return <FontAwesomeIcon icon={icon} {...props} />
}

const fabricIcons = {
  icons: {
    chevrondown: fa(i.faChevronDown),
    chevronright: fa(i.faChevronRight),
    More: fa(i.faEllipsisH),
    Cancel: fa(i.faTimes),
    Plus: fa(i.faPlus),
    checkmark: fa(i.faCheck)
  }
}

const fabricTheme = {
  typography: {
    families: {
      default: 'Open Sans'
    }
  },
  fonts: {
    large: {
      fontFamily: 'Open Sans'
    },
    xLarge: {
      fontFamily: 'Open Sans'
    },
    xxLarge: {
      fontFamily: 'Open Sans'
    },
    superLarge: {
      fontFamily: 'Open Sans'
    },
    mega: {
      fontFamily: 'Open Sans'
    }
  },
  palette: {
    themePrimary: '#5ba9ff',
    themeLighterAlt: '#04070a',
    themeLighter: '#0f1b29',
    themeLight: '#1c334d',
    themeTertiary: '#376699',
    themeSecondary: '#5196e0',
    themeDarkAlt: '#6cb3ff',
    themeDark: '#83bfff',
    themeDarker: '#a4d0ff',
    neutralLighterAlt: '#111157',
    neutralLighter: '#111155',
    neutralLight: '#101052',
    neutralQuaternaryAlt: '#0f0f4c',
    neutralQuaternary: '#0f0f49',
    neutralTertiaryAlt: '#0e0e46',
    neutralTertiary: '#f6f5f5',
    neutralSecondary: '#f8f6f6',
    neutralPrimaryAlt: '#f9f8f8',
    neutralPrimary: '#f3f1f1',
    neutralDark: '#fcfbfb',
    black: '#fdfdfd',
    white: '#121258'
  }
}

export { Colors, fabricTheme, fabricIcons }
