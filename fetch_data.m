let 
    sha256 = "1bc4d0086c3e55d01905c6f984c4c3df5e95deea3c2516d8b07a1444729986e9",
    url = "http://abbbaf.github.io/functions.m",
    expression = Text.FromBinary(Web.Contents(url,[IsRetry=true])),   
    sha256_url = "https://api.hashify.net/hash/sha256/hex?value=" &  Uri.EscapeDataString(expression),
    response = Web.Contents(sha256_url),
    response_sha256 = Json.Document(response)[Digest],
    GetFunctions = if response_sha256 = sha256 then Expression.Evaluate(expression,#shared) else null,
    functions = try GetFunctions("https://abbbaf.github.io",#shared) otherwise null
in
    functions

