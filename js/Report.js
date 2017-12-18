// Safari 3.0+ "[object HTMLElementConstructor]" 
const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

const mobile = (function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
})();

/* AUTHOR: Analytical Graphics, Inc.
Test functions taken from 'webglreport':
https://github.com/AnalyticalGraphicsInc/webglreport 
*/

const REPORT = (function(){
	var webglVersion = window.location.search.indexOf('v=2') > 0 ? 2 : 1;

    // var template = _.template($('#reportTemplate').html());
    var report = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        webglVersion: webglVersion
    };

    var canvas = document.getElementsByTagName('canvas')[0];
    var gl;

    var possibleNames = (webglVersion === 2) ? ['webgl2', 'experimental-webgl2'] : ['webgl', 'experimental-webgl'];
    var contextName;
    for(var i=0; i<possibleNames.length; i++){
    	var name = possibleNames[i];
    	if (canvas.getContext(name, { stencil: true }) == null){
    		continue;
    	}
    	else{
    		contextName = name;
    		gl = canvas.getContext(name, { stencil: true });
    	}
    }

    report.gl = gl;
    report.contextName = contextName;


    function describeRange(value) {
        return '[' + value[0] + ', ' + value[1] + ']';
    }

    function getMaxAnisotropy() {
        var e = gl.getExtension('EXT_texture_filter_anisotropic')
                || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');

        if (e) {
            var max = gl.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            // See Canary bug: https://code.google.com/p/chromium/issues/detail?id=117450
            if (max === 0) {
                max = 2;
            }
            return max;
        }
        return 'n/a';
    }

    function formatPower(exponent, verbose) {
        if (verbose) {
            return '' + Math.pow(2, exponent);
        } else {
            return '2<sup>' + exponent + '</sup>';
        }
    }

    function getPrecisionDescription(precision, verbose) {
        var verbosePart = verbose ? ' bit mantissa' : '';
        return '[-' + formatPower(precision.rangeMin, verbose) + ', ' + formatPower(precision.rangeMax, verbose) + '] (' + precision.precision + verbosePart + ')'
    }

    function getBestFloatPrecision(shaderType) {
        var high = gl.getShaderPrecisionFormat(shaderType, gl.HIGH_FLOAT);
        var medium = gl.getShaderPrecisionFormat(shaderType, gl.MEDIUM_FLOAT);
        var low = gl.getShaderPrecisionFormat(shaderType, gl.LOW_FLOAT);

        var best = high;
        if (high.precision === 0) {
            best = medium;
        }

        return '<span title="High: ' + getPrecisionDescription(high, true) + '\n\nMedium: ' + getPrecisionDescription(medium, true) + '\n\nLow: ' + getPrecisionDescription(low, true) + '">' +
            getPrecisionDescription(best, false) + '</span>';
    }

    function getFloatIntPrecision(gl) {
        var high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        var s = (high.precision !== 0) ? 'highp/' : 'mediump/';

        high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT);
        s += (high.rangeMax !== 0) ? 'highp' : 'lowp';

        return s;
    }

    function isPowerOfTwo(n) {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }

    function getAngle(gl) {
        var lineWidthRange = describeRange(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE));

        // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
        var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
            (gl.getParameter(gl.RENDERER) !== 'Internet Explorer') &&
            (gl.getParameter(gl.RENDERER) !== 'Microsoft Edge') &&
            (lineWidthRange === describeRange([1,1]));

        if (angle) {
            // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
            // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
            //
            // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
            // due to driver bugs, etc.
            if (isPowerOfTwo(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)) && isPowerOfTwo(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS))) {
                return 'Yes, D3D11';
            } else {
                return 'Yes, D3D9';
            }
        }

        return 'No';
    }

    function getMajorPerformanceCaveat(contextName) {
        // Does context creation fail to do a major performance caveat?
        var canvas2 = document.createElement('canvas');
        var gl = canvas2.getContext(contextName, { failIfMajorPerformanceCaveat : true });
        canvas2.remove();

        if (!gl) {
            // Our original context creation passed.  This did not.
            return 'Yes';
    }

        if (typeof gl.getContextAttributes().failIfMajorPerformanceCaveat === 'undefined') {
            // If getContextAttributes() doesn't include the failIfMajorPerformanceCaveat
            // property, assume the browser doesn't implement it yet.
            return 'Not implemented';
        }

    return 'No';
    }

    function getDraftExtensionsInstructions() {
        if (navigator.userAgent.indexOf('Chrome') !== -1) {
            return 'To see draft extensions in Chrome, browse to about:flags, enable the "Enable WebGL Draft Extensions" option, and relaunch.';
        } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
            return 'To see draft extensions in Firefox, browse to about:config and set webgl.enable-draft-extensions to true.';
        }

        return '';
    }

    function getMaxColorBuffers(gl) {
        var maxColorBuffers = 1;
        var ext = gl.getExtension("WEBGL_draw_buffers");
        if (ext != null) 
            maxColorBuffers = gl.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL);
        
        return maxColorBuffers;
    }

    function getUnmaskedInfo(gl) {
        var unMaskedInfo = {
            renderer: '',
            vendor: ''
        };
        
        var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (dbgRenderInfo != null) {
            unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
            unMaskedInfo.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
        }
        
        return unMaskedInfo;
    }

    function showNull(v) {
        return (v === null) ? 'n/a' : v;
    }
    
    var webglToEsNames = {
        'getInternalformatParameter' : 'getInternalformativ',
        'uniform1ui' : 'uniform',
        'uniform2ui' : 'uniform',
        'uniform3ui' : 'uniform',
        'uniform4ui' : 'uniform',
        'uniform1uiv' : 'uniform',
        'uniform2uiv' : 'uniform',
        'uniform3uiv' : 'uniform',
        'uniform4uiv' : 'uniform',
        'uniformMatrix2x3fv' : 'uniform',
        'uniformMatrix3x2fv' : 'uniform',
        'uniformMatrix2x4fv' : 'uniform',
        'uniformMatrix4x2fv' : 'uniform',
        'uniformMatrix3x4fv' : 'uniform',
        'uniformMatrix4x3fv' : 'uniform',
        'vertexAttribI4i' : 'vertexAttrib',
        'vertexAttribI4iv' : 'vertexAttrib',
        'vertexAttribI4ui' : 'vertexAttrib',
        'vertexAttribI4uiv' : 'vertexAttrib',
        'vertexAttribIPointer' : 'vertexAttribPointer',
        'vertexAttribDivisor' : 'vertexAttribDivisor',
        'createQuery' : 'genQueries',
        'deleteQuery' : 'deleteQueries',
        'endQuery' : 'beginQuery',
        'getQuery' : 'getQueryiv',
        'getQueryParameter' : 'getQueryObjectuiv',
        'samplerParameteri' : 'samplerParameter',
        'samplerParameterf' : 'samplerParameter',
        'clearBufferiv' : 'clearBuffer',
        'clearBufferuiv' : 'clearBuffer',
        'clearBufferfv' : 'clearBuffer',
        'clearBufferfi' : 'clearBuffer',
        'createSampler' : 'genSamplers',
        'deleteSampler' : 'deleteSamplers',
        'getSyncParameter' : 'getSynciv',
        'createTransformFeedback' : 'genTransformFeedbacks',
        'deleteTransformFeedback' : 'deleteTransformFeedbacks',
        'endTransformFeedback' : 'beginTransformFeedback',
        'getIndexedParameter' : 'get',
        'getActiveUniforms' : 'getActiveUniformsiv',
        'getActiveUniformBlockParameter' : 'getActiveUniformBlockiv',
        'createVertexArray' : 'genVertexArrays',
        'deleteVertexArray' : 'deleteVertexArrays'
    };

    function getWebGL2ExtensionUrl(name) {
        if (name === 'getBufferSubData') {
            return 'http://www.opengl.org/sdk/docs/man/docbook4/xhtml/glGetBufferSubData.xml';
        }

        if (webglToEsNames[name]) {
            name = webglToEsNames[name];
        }

        var filename = 'gl' + name[0].toUpperCase() + name.substring(1) + '.xhtml';
        return 'http://www.khronos.org/opengles/sdk/docs/man3/html/' + filename;
    }

    function getWebGL2Status(gl, contextName) {
        var webgl2Names = [
            'copyBufferSubData',
            'getBufferSubData',
            'blitFramebuffer',
            'framebufferTextureLayer',
            'getInternalformatParameter',
            'invalidateFramebuffer',
            'invalidateSubFramebuffer',
            'readBuffer',
            'renderbufferStorageMultisample',
            'texStorage2D',
            'texStorage3D',
            'texImage3D',
            'texSubImage3D',
            'copyTexSubImage3D',
            'compressedTexImage3D',
            'compressedTexSubImage3D',
            'getFragDataLocation',
            'uniform1ui',
            'uniform2ui',
            'uniform3ui',
            'uniform4ui',
            'uniform1uiv',
            'uniform2uiv',
            'uniform3uiv',
            'uniform4uiv',
            'uniformMatrix2x3fv',
            'uniformMatrix3x2fv',
            'uniformMatrix2x4fv',
            'uniformMatrix4x2fv',
            'uniformMatrix3x4fv',
            'uniformMatrix4x3fv',
            'vertexAttribI4i',
            'vertexAttribI4iv',
            'vertexAttribI4ui',
            'vertexAttribI4uiv',
            'vertexAttribIPointer',
            'vertexAttribDivisor',
            'drawArraysInstanced',
            'drawElementsInstanced',
            'drawRangeElements',
            'drawBuffers',
            'clearBufferiv',
            'clearBufferuiv',
            'clearBufferfv',
            'clearBufferfi',
            'createQuery',
            'deleteQuery',
            'isQuery',
            'beginQuery',
            'endQuery',
            'getQuery',
            'getQueryParameter',
            'createSampler',
            'deleteSampler',
            'isSampler',
            'bindSampler',
            'samplerParameteri',
            'samplerParameterf',
            'getSamplerParameter',
            'fenceSync',
            'isSync',
            'deleteSync',
            'clientWaitSync',
            'waitSync',
            'getSyncParameter',
            'createTransformFeedback',
            'deleteTransformFeedback',
            'isTransformFeedback',
            'bindTransformFeedback',
            'beginTransformFeedback',
            'endTransformFeedback',
            'transformFeedbackVaryings',
            'getTransformFeedbackVarying',
            'pauseTransformFeedback',
            'resumeTransformFeedback',
            'bindBufferBase',
            'bindBufferRange',
            'getIndexedParameter',
            'getUniformIndices',
            'getActiveUniforms',
            'getUniformBlockIndex',
            'getActiveUniformBlockParameter',
            'getActiveUniformBlockName',
            'uniformBlockBinding',
            'createVertexArray',
            'deleteVertexArray',
            'isVertexArray',
            'bindVertexArray'
        ];

        var webgl2 = (contextName.indexOf('webgl2') !== -1);

        var functions = [];
        var totalImplemented = 0;
        var length = webgl2Names.length;

        if (webgl2) {
            for (var i = 0; i < length; ++i) {
                var name = webgl2Names[i];
                var className = 'extension';
                if (webgl2 && gl[name]) {
                    ++totalImplemented;
                } else {
                    className += ' unsupported';
                }
                functions.push({ name: name, className: className });
            }
        }

        return {
            status : webgl2 ? (totalImplemented + ' of ' + length + ' new functions implemented.') :
                'webgl2 and experimental-webgl2 contexts not available.',
            functions : functions
        };
    }

    var webgl2Status = getWebGL2Status(gl, contextName);


    report = Object.assign(report, {
        contextName: contextName,
        glVersion: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        unMaskedVendor: getUnmaskedInfo(gl).vendor,
        unMaskedRenderer: getUnmaskedInfo(gl).renderer,
        antialias:  gl.getContextAttributes().antialias ? 'Available' : 'Not available',
        angle: getAngle(gl),
        majorPerformanceCaveat: getMajorPerformanceCaveat(contextName),
        maxColorBuffers: getMaxColorBuffers(gl),
        redBits: gl.getParameter(gl.RED_BITS),
        greenBits: gl.getParameter(gl.GREEN_BITS),
        blueBits: gl.getParameter(gl.BLUE_BITS),
        alphaBits: gl.getParameter(gl.ALPHA_BITS),
        depthBits: gl.getParameter(gl.DEPTH_BITS),
        stencilBits: gl.getParameter(gl.STENCIL_BITS),
        maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
        maxCombinedTextureImageUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
        maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
        maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
        maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        maxVertexTextureImageUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        aliasedLineWidthRange: describeRange(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)),
        aliasedPointSizeRange: describeRange(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)),
        maxViewportDimensions: describeRange(gl.getParameter(gl.MAX_VIEWPORT_DIMS)),
        maxAnisotropy: getMaxAnisotropy(),
        vertexShaderBestPrecision: getBestFloatPrecision(gl.VERTEX_SHADER),
        fragmentShaderBestPrecision: getBestFloatPrecision(gl.FRAGMENT_SHADER),
        fragmentShaderFloatIntPrecision: getFloatIntPrecision(gl),

        extensions: gl.getSupportedExtensions(),
        draftExtensionsInstructions: getDraftExtensionsInstructions(),

        webgl2Status : webgl2Status.status,
        webgl2Functions : webgl2Status.functions
    });

    if (webglVersion > 1) {
        report = Object.assign(report, {
            maxVertexUniformComponents: showNull(gl.getParameter(gl.MAX_VERTEX_UNIFORM_COMPONENTS)),
            maxVertexUniformBlocks: showNull(gl.getParameter(gl.MAX_VERTEX_UNIFORM_BLOCKS)),
            maxVertexOutputComponents: showNull(gl.getParameter(gl.MAX_VERTEX_OUTPUT_COMPONENTS)),
            maxVaryingComponents: showNull(gl.getParameter(gl.MAX_VARYING_COMPONENTS)),
            maxFragmentUniformComponents: showNull(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_COMPONENTS)),
            maxFragmentUniformBlocks: showNull(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_BLOCKS)),
            maxFragmentInputComponents: showNull(gl.getParameter(gl.MAX_FRAGMENT_INPUT_COMPONENTS)),
            minProgramTexelOffset: showNull(gl.getParameter(gl.MIN_PROGRAM_TEXEL_OFFSET)),
            maxProgramTexelOffset: showNull(gl.getParameter(gl.MAX_PROGRAM_TEXEL_OFFSET)),
            maxDrawBuffers: showNull(gl.getParameter(gl.MAX_DRAW_BUFFERS)),
            maxColorAttachments: showNull(gl.getParameter(gl.MAX_COLOR_ATTACHMENTS)),
            maxSamples: showNull(gl.getParameter(gl.MAX_SAMPLES)),
            max3dTextureSize: showNull(gl.getParameter(gl.MAX_3D_TEXTURE_SIZE)),
            maxArrayTextureLayers: showNull(gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS)),
            maxTextureLodBias: showNull(gl.getParameter(gl.MAX_TEXTURE_LOD_BIAS)),
            maxUniformBufferBindings: showNull(gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)),
            maxUniformBlockSize: showNull(gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE)),
            uniformBufferOffsetAlignment: showNull(gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT)),
            maxCombinedUniformBlocks: showNull(gl.getParameter(gl.MAX_COMBINED_UNIFORM_BLOCKS)),
            maxCombinedVertexUniformComponents: showNull(gl.getParameter(gl.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS)),
            maxCombinedFragmentUniformComponents: showNull(gl.getParameter(gl.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS)),
            maxTransformFeedbackInterleavedComponents: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS)),
            maxTransformFeedbackSeparateAttribs: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)),
            maxTransformFeedbackSeparateComponents: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS)),
            maxElementIndex: showNull(gl.getParameter(gl.MAX_ELEMENT_INDEX)),
            maxServerWaitTimeout: showNull(gl.getParameter(gl.MAX_SERVER_WAIT_TIMEOUT))
        });
    }


    return report;

})();