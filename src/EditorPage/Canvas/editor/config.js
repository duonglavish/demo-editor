const config = {
    canvasName: 'default',
    // The minimum area visible outside the canvas, as a multiple of the image dimensions.
    // The larger the number, the more one can scroll outside the canvas.
    canvas_expansion: 3, //origin: 1.5,
    initFill: {
      color: 'FF0000', // solid red
      opacity: 1,
    },
    initStroke: {
      width: 5,
      color: '000000', // solid black
      opacity: 1,
    },
    text: {
      stroke_width: 0,
      font_size: 24,
      font_family: 'serif',
    },
    initOpacity: 1,
    colorPickerCSS: null,
    initTool: 'select',
    exportWindowType: 'new', // 'same' (todo: also support 'download')
    wireframe: false,
    showlayers: false,
    no_save_warning: false,
    // PATH CONFIGURATION
    // The following path configuration items are disallowed in the URL (as should any future path configurations)
    langPath: 'locale/', // Default will be changed if this is a non-modular load
    extPath: 'extensions/', // Default will be changed if this is a non-modular load
    canvgPath: 'canvg/', // Default will be changed if this is a non-modular load
    jspdfPath: 'jspdf/', // Default will be changed if this is a non-modular load
    imgPath: 'images/',
    jGraduatePath: 'jgraduate/images/',
    extIconsPath: 'extensions/',
    // DOCUMENT PROPERTIES
    // Change the following to a preference (already in the Document Properties dialog)?
    dimensions: [640, 480],
    // EDITOR OPTIONS
    // Change the following to preferences (already in the Editor Options dialog)?
    gridSnapping: false,
    gridColor: '#000',
    baseUnit: 'px',
    snappingStep: 10,
    showRulers: true,
    // SOURCE OUTPUT BEHAVIOR
    dynamicOutput: false,
    // URL BEHAVIOR CONFIGURATION
    preventAllURLConfig: false,
    preventURLContentLoading: false,
    // EXTENSION CONFIGURATION (see also preventAllURLConfig)
    lockExtensions: false, // Disallowed in URL setting
    noDefaultExtensions: false, // noDefaultExtensions can only be meaningfully used in `svgedit-config-iife.js` or in the URL
    // EXTENSION-RELATED (GRID)
    showGrid: false, // Set by ext-grid.js
    noStorageOnLoad: false, // Some interaction with ext-storage.js; prevent even the loading of previously saved local storage
    forceStorage: false, // Some interaction with ext-storage.js; strongly discouraged from modification as it bypasses user privacy by preventing them from choosing whether to keep local storage or not
    emptyStorageOnDecline: false, // Used by ext-storage.js; empty any prior storage if the user declines to store
    // EXTENSION (CLIENT VS. SERVER SAVING/OPENING)
    avoidClientSide: false, // Deprecated in favor of `avoidClientSideDownload`
    avoidClientSideDownload: false,
    avoidClientSideOpen: false,
    extensions: [
      // 'ext-connector',
      'ext-eyedropper',
      'ext-grid',
      // 'ext-imagelib',
      // 'ext-arrows',
      'ext-markers',
      // 'ext-overview_window', disabled until we fix performance issue
      'ext-panning',
      'ext-shapes',
      'ext-polystar',
      'ext-storage',
      'ext-opensave'
    ],
    userExtensions: [],
    allowedOrigins: []
  }
  
  export default config