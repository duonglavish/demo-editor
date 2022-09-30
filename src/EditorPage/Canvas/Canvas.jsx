import React,{ useEffect } from 'react'
import PropTypes from 'prop-types'
import SvgCanvas from './svgcanvas/svgcanvas'
import './Canvas.css';
import LeftBar from './LeftBar/LeftBar.jsx'
import config from './editor/config'
import updateCanvas from './editor/updateCanvas'
import svg from '../services/svg'

import { CanvasContext, CanvasContextProvider } from './Context/canvasContext.jsx'

const Canvas = ({ svgContent, locale, svgUpdate, onClose, log }) => {
  const textRef = React.useRef(null)
  const svgcanvasRef = React.useRef(null)
  const oiAttributes = React.useRef(svg.saveOIAttr(svgContent))
  const [canvasState, dispatchCanvasState] = React.useContext(CanvasContext)
  const { canvas } = canvasState

  const onKeyUp = (event) => {
    log('onKeyUp', event)
  }

  const onKeyDown = (event) => {
    log('onKeyUp', event)
  }

  const changedHandler = (win, elems) => {
    log('changedHandler', { elems })
  }

  const selectedHandler = (win, elems) => {
    log('selectedHandler', elems)
  }

  const contextsetHandler = (win, context) => {
    log('contextsetHandler', context)
  }

  const zoomedHandler = (win, bbox, autoCenter) => {
    log('zoomedHandler', autoCenter)
  }

  const eventList = {
    selected: selectedHandler,
    changed: changedHandler,
    contextset: contextsetHandler,
    // 'extension-added': () => log('extensionAddedHandler'),
    // cleared: () => log('clearedHandler'),
    // exported: () => log('exportedHandler'),
    // exportedPDF: () => log('exportedPDFHandler'),
    // message: () => log('messageHandler'),
    // pointsAdded: () => log('pointsAddedHandler'),
    // saved: () => log('savedHandler'),
    // setnonce: () => log('setnonceHandler'),
    // unsetnonce: () => log('unsetnonceHandler'),
    // transition: () => log('transitionHandler'),
    zoomed: () => zoomedHandler,
    // zoomDone: () => log('zoomDoneHandler'),
    // updateCanvas: () => log('updateCanvasHandler'),
    // extensionsAdded: () => log('extensionsAddedHandler'),
  }

  React.useLayoutEffect(() => {
    const editorDom = svgcanvasRef.current
    const canvas = new SvgCanvas(editorDom, config)
    updateCanvas(canvas, svgcanvasRef.current, config, true)
    canvas.textActions.setInputElem(textRef.current)
    Object.entries(eventList).forEach(([eventName, eventHandler]) => {
      canvas.bind(eventName, eventHandler)
    })
    dispatchCanvasState({ type: 'init', canvas, svgcanvas: editorDom, config })
    document.addEventListener('keydown', onKeyDown.bind(canvas))
    return () => {
      document.removeEventListener('keydown', onKeyDown.bind(canvas))
    }
  }, [])

  React.useLayoutEffect(() => {
    log('new svgContent', svgContent.length)
    if (!canvasState.canvas) return
    oiAttributes.current = svg.saveOIAttr(svgContent)
    canvasState.canvas.clear()
    const success = canvasState.canvas.setSvgString(svgContent.replace(/'/g, "\\'"), true)
    updateCanvas(canvasState.canvas, svgcanvasRef.current, config, true)
    if (!success) throw new Error('Error loading SVG')
    dispatchCanvasState({ type: 'updated', updated: false })
  }, [svgContent, canvasState.canvas])

  return (
    <>

      <LeftBar />

      <div className="OIe-editor" role="main">
        <div className="workarea">
          <div ref={svgcanvasRef} className="svgcanvas" style={{ position: 'relative' }} />
        </div>
      </div>

      <input ref={textRef} onKeyUp={onKeyUp} type="text" size="35" style={{ position: 'absolute', left: '-9999px' }} />
    </>
  )
}

Canvas.propTypes = {
  svgContent: PropTypes.string,
  locale: PropTypes.string.isRequired,
  svgUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  log: PropTypes.func.isRequired,
}

Canvas.defaultProps = { svgContent: '<svg width="680" height="480" xmlns="http://www.w3.org/2000/svg"></svg>' }

const CanvasWithContext = (props) => (
  <CanvasContextProvider>
    <Canvas {...props} />
  </CanvasContextProvider>
)
export default CanvasWithContext
