# Runtime provenance

This is the existing Inox2D WebAssembly browser runtime, distributed by the AITuber-OnAir project. It statically links the official Inox2D Rust engine. The generated JavaScript wrapper and WebAssembly binary are copied without modification.

- Engine: https://github.com/Inochi2D/inox2d
- Browser wrapper/binary: https://github.com/shinshin86/aituber-onair/tree/main/packages/core/examples/react-inochi2d-app/public/inochi2d/runtime
- Runtime-binary source commit: 65a8109b51c5cdbd4113562665a7d82511c82f26
- Keep THIRD-PARTY-NOTICES.md with the runtime.

The page's small runtime-adapter.js forwards parameters and camera controls to this existing engine. It includes compatibility workarounds for the engine's zero-value skip, incomplete opacity binding, and WebGL's lack of CLAMP_TO_BORDER. The loader keeps the original native export intact and adjusts only the hidden white mask's in-memory drawing state for Inox2D. These are integration fixes, not a replacement deformation or rendering engine.
