# Turtle Expression Studio

A static web page for the turtle exported from Inochi Creator as `puppet/turtle.inp`. It uses the existing **Inox2D WebAssembly runtime**, the supported Rust implementation of Inochi2D, with its prebuilt JavaScript wrapper from AITuber-OnAir. All eight parameters in the native export (nine scalar axes) are presented with sliders and numeric inputs. The head stays upright because the latest rig has no head-tilt parameter.

The page adds expression presets, a draggable eye-direction pad, reset controls, full/face framing, transparent 1086×1448 PNG downloads and portable JSON expression save/load. Settings persist in this browser only. No idle movements or automatic blinking override the controls.

## Run or publish

Serve this folder with a local HTTP server, for example `python3 -m http.server 8769`, then open `http://localhost:8769/`. Opening it as a `file://` page is not supported: the browser needs to fetch the puppet and WebAssembly module. GitHub Pages provides the necessary HTTP hosting. A current browser with WebGL2, WebAssembly and DecompressionStream is required.

For GitHub Pages, place the following files under `turtlespeed/turtle-expression-studio/` in the existing Pages repository:

- `index.html`, `style.css`, `app.js`, `expression-presets.js`
- `puppet-loader.js`, `runtime-adapter.js`, `white-mask-data.js`
- `puppet/turtle.inp.gz`
- `vendor/inochi2d.js`, `vendor/inochi2d_bg.wasm`
- `vendor/THIRD-PARTY-NOTICES.md`, `vendor/AITUBER-ONAIR-LICENSE`, `vendor/UPSTREAM.md`

The uncompressed native export is retained locally. Its gzip version is lossless and restores the exact exported bytes; it reduces model transfer from19.4MB to3.1MB. The runtime binary adds0.91MB. All production files are served from this folder; there are no CDN dependencies or API keys. The game files are separate and unchanged.

## Native export and compatibility

The `.inp` was exported through Inochi Creator v0.8.6, File→Export→Inochi2D Puppet, with a4096 atlas and100% texture scale. `puppet/export-manifest.json` records the export fingerprint. The original source project and exported file are not modified by the web page.

The existing runtime owns parsing, hierarchy, deformation, interpolation, masking and drawing. The small adapter contains four narrowly scoped integration workarounds, verified against this turtle:

1. Inox2D skips a parameter whose vector is exactly `(0,0)`. The adapter supplies an epsilon in the unused second axis of scalar zero values; scalar interpolation clamps that axis back to its sole keypoint. For the central 2D gaze, the epsilon is visually negligible.
2. The upstream engine marks opacity bindings as unfinished. The page applies the one-dimensional opacity property through the runtime's existing part-opacity API. Mesh deformation remains in the engine.
3. WebGL does not implement desktop OpenGL's `CLAMP_TO_BORDER`. The adapter uses the same mapping to `CLAMP_TO_EDGE` as the upstream browser integration.
4. Creator's atlas export wrote NaN UVs for the original constant-UV, one-pixel white mouth mask. The loader restores that original exact texture record in the in-memory puppet and valid constant UVs. A zero-opacity white mask is made drawable using a white Multiply state so its stencil can work without painting over the mouth. Original disk files remain intact.

`white-mask-data.js` contains the original source rig's54-byte texture record, not newly generated artwork. The earlier custom renderer is retained locally in `previous-custom-implementation/` for history; **it is not used or published**. Unused `upstream/` investigations, build scripts, old asset bundle and test artifacts are not part of deployment.

## Runtime provenance and limitations

See `vendor/UPSTREAM.md` and the accompanying notices. The generated JavaScript and WASM are unchanged. This page is a controller for the current puppet, not a rig-authoring replacement for Inochi Creator. Original partial-lid seams and extreme combined deformations can remain visible. Actual phone hardware and Safari need separate validation; do not infer their performance from desktop mobile emulation.

## Verification

2026-11-22: isolated Chrome139/SwiftShader passed75 browser checks with the **native puppet and Inox2D runtime**. Every parameter's min/max endpoints produced different rendered images; all25 presets rendered without GPU errors. Slider/numeric synchronization, malformed JSON rejection, range clamping, reset, PNG transparency and dimensions were checked. Mouth-open smile/frown, closed eyes and gaze directions were visually inspected after the compatibility fixes. Mobile emulation390px had no horizontal overflow. A real PNG download was exercised from the face/zoom view. Original rig artifacts remain; these checks do not establish Safari or real-phone performance.
