import React from 'react'
import { createRoot } from 'react-dom/client'
import Canvas from './Canvas/Canvas.jsx'
import SvgCanvas from './Canvas/svgcanvas/svgcanvas'
import ConfigObj from './services/ConfigObj.js'
import { isMac } from './common/browser.js'

const VERSION = require('../../package.json').version

const { $id, $click, decode64, blankPageObjectURL } = SvgCanvas

const modKey = (isMac() ? 'meta+' : 'ctrl+')

class Editor {
    constructor(div) {
        /** @private the div that holds the whole thing */
        this.div = div
        this.langChanged = false
        this.showSaveWarning = false
        this.storagePromptState = 'ignore'
        this.title = 'untitled.svg'
        this.svgCanvas = null
        this.$click = $click
        this.isReady = false
        this.customExportImage = false
        this.customExportPDF = false
        this.configObj = new ConfigObj(this)
        this.configObj.pref = this.configObj.pref.bind(this.configObj)
        this.setConfig = this.configObj.setConfig.bind(this.configObj)
        this.callbacks = []
        this.curContext = null
        this.exportWindowName = null
        this.docprops = false
        this.configObj.preferences = false
        this.canvMenu = null
        this.goodLangs = ['ar', 'cs', 'de', 'en', 'es', 'fa', 'fr', 'fy', 'hi', 'it', 'ja', 'nl', 'pl', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'tr', 'zh-CN', 'zh-TW']
        this.shortcuts = [
        // Shortcuts not associated with buttons
            { key: 'ctrl+arrowleft', fn: () => { this.rotateSelected(0, 1) } },
            { key: 'ctrl+arrowright', fn: () => { this.rotateSelected(1, 1) } },
            { key: 'ctrl+shift+arrowleft', fn: () => { this.rotateSelected(0, 5) } },
            { key: 'ctrl+shift+arrowright', fn: () => { this.rotateSelected(1, 5) } },
            { key: 'shift+o', fn: () => { this.svgCanvas.cycleElement(0) } },
            { key: 'shift+p', fn: () => { this.svgCanvas.cycleElement(1) } },
            { key: 'tab', fn: () => { this.svgCanvas.cycleElement(0) } },
            { key: 'shift+tab', fn: () => { this.svgCanvas.cycleElement(1) } },
            { key: [modKey + 'arrowup', true], fn: () => { this.zoomImage(2) } },
            { key: [modKey + 'arrowdown', true], fn: () => { this.zoomImage(0.5) } },
            { key: [modKey + ']', true], fn: () => { this.moveUpDownSelected('Up') } },
            { key: [modKey + '[', true], fn: () => { this.moveUpDownSelected('Down') } },
            { key: ['arrowup', true], fn: () => { this.moveSelected(0, -1) } },
            { key: ['arrowdown', true], fn: () => { this.moveSelected(0, 1) } },
            { key: ['arrowleft', true], fn: () => { this.moveSelected(-1, 0) } },
            { key: ['arrowright', true], fn: () => { this.moveSelected(1, 0) } },
            { key: 'shift+arrowup', fn: () => { this.moveSelected(0, -10) } },
            { key: 'shift+arrowdown', fn: () => { this.moveSelected(0, 10) } },
            { key: 'shift+arrowleft', fn: () => { this.moveSelected(-10, 0) } },
            { key: 'shift+arrowright', fn: () => { this.moveSelected(10, 0) } },
            { key: ['alt+arrowup', true], fn: () => { this.svgCanvas.cloneSelectedElements(0, -1) } },
            { key: ['alt+arrowdown', true], fn: () => { this.svgCanvas.cloneSelectedElements(0, 1) } },
            { key: ['alt+arrowleft', true], fn: () => { this.svgCanvas.cloneSelectedElements(-1, 0) } },
            { key: ['alt+arrowright', true], fn: () => { this.svgCanvas.cloneSelectedElements(1, 0) } },
            { key: ['alt+shift+arrowup', true], fn: () => { this.svgCanvas.cloneSelectedElements(0, -10) } },
            { key: ['alt+shift+arrowdown', true], fn: () => { this.svgCanvas.cloneSelectedElements(0, 10) } },
            { key: ['alt+shift+arrowleft', true], fn: () => { this.svgCanvas.cloneSelectedElements(-10, 0) } },
            { key: ['alt+shift+arrowright', true], fn: () => { this.svgCanvas.cloneSelectedElements(10, 0) } },
            {
                key: ['delete/backspace', true],
                fn: () => {
                if (this.selectedElement || this.multiselected) { this.svgCanvas.deleteSelectedElements() }
                }
            },
            { key: 'a', fn: () => { this.svgCanvas.selectAllInCurrentLayer() } },
            { key: modKey + 'a', fn: () => { this.svgCanvas.selectAllInCurrentLayer() } },
            { key: modKey + 'x', fn: () => { this.cutSelected() } },
            { key: modKey + 'c', fn: () => { this.copySelected() } },
            { key: modKey + 'v', fn: () => { this.pasteInCenter() } }
        ]
        this.config = {
        //   debug: true,
          i18n: 'en',
          saveHandler: null,
          onCloseHandler: null,
          debugPrefix: 'editor',
        }
    }

    rotateSelected (cw, step) {
        if (!this.selectedElement || this.multiselected) {
          return
        }
        if (!cw) {
          step *= -1
        }
        const angle = Number.parseFloat($id('angle').value) + step
        // this.svgCanvas.setRotationAngle(angle)
        // this.topPanel.updateContextPanel()
    }

    configure(name, value) {
        this.logDebugData('configure', { name, value })
    
        if (typeof this.config[name] === 'undefined') {
          throw new Error(`${name} is not a valid configuration`)
        }
        this.config[name] = value
        return this.config
    }

    logDebugData = (functionName, args) => {
        if (this.config.debug) {
          console.info('%c%s', 'color:green', this.config.debugPrefix, functionName, args, new Error().stack.split(/\n/)[2])
        }
    }

    load(svgContent) {
        this.logDebugData('load', svgContent?.length)
        try {
        createRoot(this.div)
        .render(
            <Canvas 
                svgContent={svgContent}
                locale={this.config.i18n}
                svgUpdate={this.svgUpdate}
                onClose={this.onClose}
                log={this.logDebugData}
            />
        )
        } catch (err) {
          console.error('could not load the SVG content', err)
          throw err
        }
    }

    svgUpdate = (svgContent) => {
        this.logDebugData('svgUpdate', this.config.saveHandler !== null)
    }

    onClose = () => {
        this.logDebugData('onClose', this.config.onCloseHandler !== null)
    }
}

export default Editor
