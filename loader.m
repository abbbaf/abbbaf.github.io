let
    Loader = (file as text) =>
        let
            raw = Text.FromBinary(Web.Contents("https://abbaf.github.io/" & file)),
            sig_line_start = Text.Length(raw) - 264,
            _ = if Text.Middle(raw, sig_line_start + 1, 7) <> "// SIG:" then error "No signature found" else null,
            sig_hex = Text.Middle(raw, sig_line_start + 8, 256),
            clean_content = Text.Start(raw, sig_line_start),

            message_hash = SHA256(clean_content),

            public_key = "336ef4a342f5a02c2386e7480bba9f04db3bbdc884cd5d0ce0128294f15db7f4d90c2b011c41948c2b50c091b25358bf93c55c6d5ced187331c7c8ea1f1717fb",
            is_valid = ECC(message_hash)(sig_hex, public_key),

            __ = if not is_valid then error "Invalid signature" else null,

            result = Expression.Evaluate(clean_content, #shared)
        in
            result
in
    Loader