let 
    sha256 = "f6f35b2aea58e12168c8609fdf1fc2e9c2b9332aaf9496070f0cc0606a752737",
    url = "http://abbbaf.github.io/functions.m",
    expression = Text.FromBinary(Web.Contents(url,[IsRetry=true])),   
    sha256_url = "https://api.hashify.net/hash/sha256/hex?value=" &  Uri.EscapeDataString(expression),
    response = Web.Contents(sha256_url),
    response_sha256 = Json.Document(response)[Digest],
    GetFunctions = if response_sha256 = sha256 then Expression.Evaluate(expression,#shared) else null,
    functions = try GetFunctions("https://abbbaf.github.io",#shared) otherwise null
in
    functions

