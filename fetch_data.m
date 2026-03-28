let 
    sha256 = "8d32f08259438c03d604061b390477eb3b62ca9ad094fb510e6b7200327c541d",
    url = "http://abbbaf.github.io/functions.m",
    expression = Text.FromBinary(Web.Contents(url,[IsRetry=true])),   
    sha256_url = "https://api.hashify.net/hash/sha256/hex?value=" &  Uri.EscapeDataString(expression),
    response = Web.Contents(sha256_url),
    response_sha256 = Json.Document(response)[Digest],
    GetFunctions = if response_sha256 = sha256 then Expression.Evaluate(expression,#shared) else null,
    functions = try GetFunctions("https://abbbaf.github.io",#shared) otherwise null
in
    functions

