import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as i from '@fortawesome/free-solid-svg-icons'
import React from 'react'

const Colors = {
  Deep: '#121258',
  Med: '#5ba9ff',
  Shallow: '#7ccbff',
  Light: '#f3f1f1',
  Outline: '#000d16',
  Green: '#00b842',
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
  palette: {}
}

export { Colors, fabricTheme, fabricIcons }

