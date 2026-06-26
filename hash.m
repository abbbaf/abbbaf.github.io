let SHA256 = (input as text) =>
    let 
        convert_to_binary = Text.ToBinary(input),
        byte_count = Binary.Length(convert_to_binary),
        add_128_byte = Binary.Combine({convert_to_binary,#binary({128})}),
        number_of_zeros_to_add = Number.Mod(64 - Number.Mod(byte_count+1+8,64),64),
        add_zeros =
            Binary.Combine(
                {add_128_byte}
                &
                List.Transform(
                    {1..number_of_zeros_to_add},
                    each #binary({0})
                )
            ),
        length_as_list = List.Transform(
            {7, 6, 5, 4, 3, 2, 1, 0}, 
            each Number.Mod(Number.IntegerDivide(8*byte_count, Number.Power(256, _)), 256)
        ),
        length_binary = Binary.FromList(length_as_list),
        final_padded_binary = Binary.Combine({add_zeros, length_binary}),
        blocks = Binary.Split(final_padded_binary,64),

        H = { 0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 },
        K = {
               0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
                0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
                0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
                0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
                0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
                0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
                0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
                0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        },


        Int32 = (value) => Number.BitwiseAnd(value,0xFFFFFFFF),
        RotateRight = (value,n) => Number.BitwiseShiftRight(value,n) +  Number.BitwiseShiftLeft(Number.BitwiseAnd(value,Number.Power(2, n) - 1),32-n),
        BitwiseXor = (value1,value2,value3) => Number.BitwiseXor(Number.BitwiseXor(value1,value2),value3),
        Sigma0 = (value) => BitwiseXor(RotateRight(value,7),RotateRight(value,18),Number.BitwiseShiftRight(value,3)),
        Sigma1 = (value) => BitwiseXor(RotateRight(value,17),RotateRight(value,19),Number.BitwiseShiftRight(value,10)),
        BigSigma0 = (value) => BitwiseXor(RotateRight(value,2),RotateRight(value,13),RotateRight(value,22)),
        BigSigma1 = (value) => BitwiseXor(RotateRight(value,6),RotateRight(value,11),RotateRight(value,25)),
        Choose = (value1,value2,value3) => Number.BitwiseXor(
                                                Number.BitwiseAnd(value1,value2),
                                                Number.BitwiseAnd(Number.BitwiseNot(value1),value3)
                                            ),
        Maj = (value1,value2,value3) => Number.BitwiseOr(
                                            Number.BitwiseOr(
                                                Number.BitwiseAnd(value1,value2),
                                                Number.BitwiseAnd(value1,value3)
                                            ),Number.BitwiseAnd(value2,value3)),

        HValues = (a,b,c,d,e,f,g,h,W,t) =>
                    let
                        T1 = Int32(h + BigSigma1(e) + Choose(e,f,g) + K{t} + W{t}),
                        T2 = Int32(BigSigma0(a) + Maj(a,b,c))
                    in
                        {Int32(T1+T2),a,b,c,Int32(d+T1),e,f,g},

        Process = (block,starting_h_values) =>
            let
                words = BinaryFormat.List(BinaryFormat.UnsignedInteger32)(block),
                W = List.Accumulate({16..63},words,
                                (w,t) => w & {Int32(Sigma1(w{t-2})+w{t-7}+Sigma0(w{t-15})+w{t-16})}
                            ),
                h_values = List.Accumulate({0..63},starting_h_values,
                                (H,t) => HValues(H{0},H{1},H{2},H{3},H{4},H{5},H{6},H{7},W,t) )
            in
                List.Transform(List.Zip({h_values, starting_h_values}), each Int32(_{0} + _{1})),



        h_values = List.Accumulate(blocks,H,(previous_h_values,block) => Process(block,previous_h_values)),
        

        ToBytes32 = (n as number) as list =>
        {
            Number.BitwiseAnd(Number.BitwiseShiftRight(n, 24), 0xFF),
            Number.BitwiseAnd(Number.BitwiseShiftRight(n, 16), 0xFF),
            Number.BitwiseAnd(Number.BitwiseShiftRight(n, 8), 0xFF),
            Number.BitwiseAnd(n, 0xFF)
        },

        ByteList =
            List.Combine(
                List.Transform(
                    h_values,
                    each ToBytes32(Number.BitwiseAnd(_, 0xFFFFFFFF))
                )
            ),

        CombinedBinary = Binary.FromList(ByteList),

        FinalHexString = Binary.ToText(CombinedBinary, BinaryEncoding.Hex)
            
    in 
        FinalHexString
in 
    SHA256