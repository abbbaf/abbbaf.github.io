let 
    sha256 = "db4da2a73a9d299fd2cb32a475609dfc7cbd9569e1fec4223de56b3962d09a2f",
    url = "http://abbbaf.github.io/functions.m",
    expression = Text.FromBinary(Web.Contents(url,[IsRetry=true])),   
    sha256_url = "https://api.hashify.net/hash/sha256/hex?value=" &  Uri.EscapeDataString(expression),
    response = Web.Contents(sha256_url),
    response_sha256 = Json.Document(response)[Digest],
    GetFunctions = if response_sha256 = sha256 then Expression.Evaluate(expression,#shared) else null,
    functions = try GetFunctions("https://abbbaf.github.io",#shared) otherwise null
in
    functions

