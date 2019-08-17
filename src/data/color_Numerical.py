import png, array, json

name = ["parula","jet","hsv","hot","cool","summer","spring","autumn","winter","gray"]
x_cm = [[0.242200,0.250390,0.257771,0.264729,0.270648,0.275114,0.278300,0.280333,0.281338,0.281014,0.279467,0.275971,0.269914,0.260243,0.244033,0.220643,0.196333,0.183405,0.178643,0.176438,0.168743,0.154000,0.146029,0.138024,0.124814,0.111252,0.095210,0.068871,0.029667,0.003571,0.006657,0.043329,0.096395,0.140771,0.171700,0.193767,0.216086,0.246957,0.290614,0.340643,0.390900,0.445629,0.504400,0.561562,0.617395,0.671986,0.724200,0.773833,0.820314,0.863433,0.903543,0.939257,0.972757,0.995648,0.996986,0.995205,0.989200,0.978629,0.967648,0.961010,0.959671,0.962795,0.969114,0.976900,0.150400,0.164995,0.181781,0.197757,0.214676,0.234238,0.255871,0.278233,0.300595,0.322757,0.344671,0.366681,0.389200,0.412329,0.435833,0.460257,0.484719,0.507371,0.528857,0.549905,0.570262,0.590200,0.609119,0.627629,0.645929,0.663500,0.679829,0.694771,0.708167,0.720267,0.731214,0.741095,0.750000,0.758400,0.766962,0.775767,0.784300,0.791795,0.797290,0.800800,0.802871,0.802419,0.799300,0.794233,0.787619,0.779271,0.769843,0.759805,0.749814,0.740600,0.733029,0.728786,0.729771,0.743371,0.765857,0.789252,0.813567,0.838629,0.863900,0.889019,0.913457,0.937338,0.960629,0.983900,0.660300,0.707614,0.751138,0.795214,0.836371,0.870986,0.899071,0.922100,0.941376,0.957886,0.971676,0.982905,0.990600,0.995157,0.998833,0.997286,0.989152,0.979795,0.968157,0.952019,0.935871,0.921800,0.907857,0.897290,0.888343,0.876314,0.859781,0.839357,0.816333,0.791700,0.766014,0.739410,0.712038,0.684157,0.655443,0.625100,0.592300,0.556743,0.518829,0.478857,0.435448,0.390919,0.348000,0.304481,0.261238,0.222700,0.191029,0.164610,0.153529,0.159633,0.177414,0.209957,0.239443,0.237148,0.219943,0.202762,0.188533,0.176557,0.164290,0.153676,0.142257,0.126510,0.106362,0.080500],
        [0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.062500,0.125000,0.187500,0.250000,0.312500,0.375000,0.437500,0.500000,0.562500,0.625000,0.687500,0.750000,0.812500,0.875000,0.937500,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.937500,0.875000,0.812500,0.750000,0.687500,0.625000,0.562500,0.500000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.062500,0.125000,0.187500,0.250000,0.312500,0.375000,0.437500,0.500000,0.562500,0.625000,0.687500,0.750000,0.812500,0.875000,0.937500,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.937500,0.875000,0.812500,0.750000,0.687500,0.625000,0.562500,0.500000,0.437500,0.375000,0.312500,0.250000,0.187500,0.125000,0.062500,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.562500,0.625000,0.687500,0.750000,0.812500,0.875000,0.937500,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.937500,0.875000,0.812500,0.750000,0.687500,0.625000,0.562500,0.500000,0.437500,0.375000,0.312500,0.250000,0.187500,0.125000,0.062500,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000],
        [1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.968750,0.875000,0.781250,0.687500,0.593750,0.500000,0.406250,0.312500,0.218750,0.125000,0.031250,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.031250,0.125000,0.218750,0.312500,0.406250,0.500000,0.593750,0.687500,0.781250,0.875000,0.968750,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.093750,0.187500,0.281250,0.375000,0.468750,0.562500,0.656250,0.750000,0.843750,0.937500,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.906250,0.812500,0.718750,0.625000,0.531250,0.437500,0.343750,0.250000,0.156250,0.062500,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.062500,0.156250,0.250000,0.343750,0.437500,0.531250,0.625000,0.718750,0.812500,0.906250,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.937500,0.843750,0.750000,0.656250,0.562500,0.468750,0.375000,0.281250,0.187500,0.093750],
        [0.041667,0.083333,0.125000,0.166667,0.208333,0.250000,0.291667,0.333333,0.375000,0.416667,0.458333,0.500000,0.541667,0.583333,0.625000,0.666667,0.708333,0.750000,0.791667,0.833333,0.875000,0.916667,0.958333,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.041667,0.083333,0.125000,0.166667,0.208333,0.250000,0.291667,0.333333,0.375000,0.416667,0.458333,0.500000,0.541667,0.583333,0.625000,0.666667,0.708333,0.750000,0.791667,0.833333,0.875000,0.916667,0.958333,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.062500,0.125000,0.187500,0.250000,0.312500,0.375000,0.437500,0.500000,0.562500,0.625000,0.687500,0.750000,0.812500,0.875000,0.937500,1.000000],
        [0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000,1.000000,0.984127,0.968254,0.952381,0.936508,0.920635,0.904762,0.888889,0.873016,0.857143,0.841270,0.825397,0.809524,0.793651,0.777778,0.761905,0.746032,0.730159,0.714286,0.698413,0.682540,0.666667,0.650794,0.634921,0.619048,0.603175,0.587302,0.571429,0.555556,0.539683,0.523810,0.507937,0.492063,0.476190,0.460317,0.444444,0.428571,0.412698,0.396825,0.380952,0.365079,0.349206,0.333333,0.317460,0.301587,0.285714,0.269841,0.253968,0.238095,0.222222,0.206349,0.190476,0.174603,0.158730,0.142857,0.126984,0.111111,0.095238,0.079365,0.063492,0.047619,0.031746,0.015873,0.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000],
        [0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000,0.500000,0.507937,0.515873,0.523810,0.531746,0.539683,0.547619,0.555556,0.563492,0.571429,0.579365,0.587302,0.595238,0.603175,0.611111,0.619048,0.626984,0.634921,0.642857,0.650794,0.658730,0.666667,0.674603,0.682540,0.690476,0.698413,0.706349,0.714286,0.722222,0.730159,0.738095,0.746032,0.753968,0.761905,0.769841,0.777778,0.785714,0.793651,0.801587,0.809524,0.817460,0.825397,0.833333,0.841270,0.849206,0.857143,0.865079,0.873016,0.880952,0.888889,0.896825,0.904762,0.912698,0.920635,0.928571,0.936508,0.944444,0.952381,0.960317,0.968254,0.976190,0.984127,0.992063,1.000000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000,0.400000],
        [1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000,1.000000,0.984127,0.968254,0.952381,0.936508,0.920635,0.904762,0.888889,0.873016,0.857143,0.841270,0.825397,0.809524,0.793651,0.777778,0.761905,0.746032,0.730159,0.714286,0.698413,0.682540,0.666667,0.650794,0.634921,0.619048,0.603175,0.587302,0.571429,0.555556,0.539683,0.523810,0.507937,0.492063,0.476190,0.460317,0.444444,0.428571,0.412698,0.396825,0.380952,0.365079,0.349206,0.333333,0.317460,0.301587,0.285714,0.269841,0.253968,0.238095,0.222222,0.206349,0.190476,0.174603,0.158730,0.142857,0.126984,0.111111,0.095238,0.079365,0.063492,0.047619,0.031746,0.015873,0.000000],
        [1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000],
        [0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000,1.000000,0.992063,0.984127,0.976190,0.968254,0.960317,0.952381,0.944444,0.936508,0.928571,0.920635,0.912698,0.904762,0.896825,0.888889,0.880952,0.873016,0.865079,0.857143,0.849206,0.841270,0.833333,0.825397,0.817460,0.809524,0.801587,0.793651,0.785714,0.777778,0.769841,0.761905,0.753968,0.746032,0.738095,0.730159,0.722222,0.714286,0.706349,0.698413,0.690476,0.682540,0.674603,0.666667,0.658730,0.650794,0.642857,0.634921,0.626984,0.619048,0.611111,0.603175,0.595238,0.587302,0.579365,0.571429,0.563492,0.555556,0.547619,0.539683,0.531746,0.523810,0.515873,0.507937,0.500000],
        [0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000,0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000,0.000000,0.015873,0.031746,0.047619,0.063492,0.079365,0.095238,0.111111,0.126984,0.142857,0.158730,0.174603,0.190476,0.206349,0.222222,0.238095,0.253968,0.269841,0.285714,0.301587,0.317460,0.333333,0.349206,0.365079,0.380952,0.396825,0.412698,0.428571,0.444444,0.460317,0.476190,0.492063,0.507937,0.523810,0.539683,0.555556,0.571429,0.587302,0.603175,0.619048,0.634921,0.650794,0.666667,0.682540,0.698413,0.714286,0.730159,0.746032,0.761905,0.777778,0.793651,0.809524,0.825397,0.841270,0.857143,0.873016,0.888889,0.904762,0.920635,0.936508,0.952381,0.968254,0.984127,1.000000]]
dim = [2,128]

def to_trip(cm):
    ncm = []
    c = len(cm)//3
    for i in range(c):
        ncm.append([cm[c*0+i],cm[c*1+i],cm[c*2+i]])
    return ncm

def to_rgb(cm):
    for p in cm:
        for c in range(3):
            p[c] = int(p[c]*255)
    return cm

# format for image writer
def to_pixels(cm):
    pixels = []
    row = []
    for px in cm:
        for _ in range(dim[0]):
            row += px
        
    for _ in range(dim[1]):
        pixels += tuple(row)
        
    return pixels


def draw(cm,fn):
    
    output = open(fn, 'wb')
    writer = png.Writer(len(cm)*dim[0], dim[1], greyscale=False)
    writer.write_array(output, to_pixels(cm))
    output.close()    

def ave(c1,c2):
    return [(c1[0]+c2[0])//2,(c1[1]+c2[1])//2,(c1[2]+c2[2])//2]

def doub(cm):

    ncm = [cm[0]]
    for i in range(1,len(cm)):
        ncm.append(ave(cm[i-1],cm[i]))
        ncm.append(cm[i])
        
    return ncm

def main(i):
    o_cm = x_cm[i]
    t_cm = to_trip(o_cm)
    cm = to_rgb(t_cm)
    cm = doub(doub(doub(doub(cm))))
    #draw(cm,'draw_'+name[i]+'.png')
    d = {}
    try:
        f = open("Numerical.json",'r')
        d = json.loads(f.read())
        f.close()
    except FileNotFoundError: pass
    
    for c in range(len(cm)):
        cm[c] = "rgb("+str(cm[c][0])+","+str(cm[c][1])+","+str(cm[c][2])+")"
    
    d[name[i]] = cm
    
    f = open("Numerical.json",'w')
    f.write(json.dumps(d,indent=4 ))
    f.close()    
    
"""
0: "parula"
1: "jet"
2: "hsv"
3: "hot"
4: "cool"
5: "summer"
6: "spring"
7: "autumn"
8: "winter"
9: "gray"
"""
for i in [1,3,4]: main(i)