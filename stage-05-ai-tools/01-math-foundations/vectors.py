"""
AI 工程课 Phase 1 / Lesson 01：线性代数直觉
配套代码：不依赖任何第三方库，用纯 Python 从零实现向量与矩阵。

=== 这个文件是什么 ===
它不是工具、不是项目，是一个"练习文件"。目的只有一个：把"向量""矩阵"这些
数学概念，写成能真的跑起来的 Python 代码，让你亲眼看见
"点积确实等于对应位置相乘再相加"。

文件结构：
  - Vector 类  → 第 1 块（向量）到第 4 块（余弦相似度）的内容
  - Matrix 类  → 第 5 块（矩阵 = 线性变换）
  - 最底下 if __name__ == "__main__": 是"演示区"，
    直接运行本文件（python vectors.py）就会打印一堆结果给你看。

=== 读代码前先认识 4 个 Python 词 ===
1) 类（class）：把"一种东西"和"它的做法"打包在一起。
   `class Vector:` 这句话的意思就是"我要定义'向量'这种东西"。
2) 实例：用这个定义真正造出来的一个具体对象。
   `Vector([1, 2, 3])` 造出来的就是一个"向量实例"。
3) self：实例自己。`self.components` 读作"我自己的 components"。
4) __init__：造一个新实例时自动跑一遍的那段代码，相当于"出生时要做的事"。
   前后两根下划线是 Python 的约定，表示"这是 Python 自己用的名字"。
   所以你永远不会手写 v.__init__()，你只会写 Vector([1, 2, 3])。

来源：ai-engineering-from-scratch / phases/01-math-foundations/01-linear-algebra-intuition
"""


class Vector:
    """向量：一串有序的数字。

    两个身份（同一个东西的两种看法）：
      1) 空间里的一个点（位置）
      2) 从原点出发的一支箭（有方向、有长度）

    维数：这个向量里有几个数字，就是几维。
      [1, 2, 3] 有 3 个数字 → 3 维
      [4, 5]    有 2 个数字 → 2 维
    维数是向量的一部分，不是附属信息：[1,2] 和 [1,2,3] 属于两个不同的空间。
    而且维数不同的两个向量，既不能相加、也不能做点积——逐项对不齐。
    """

    def __init__(self, components):
        """出生时要做的事：把数字存好，把维数算好。

        你写 Vector([1, 2, 3]) 的那一刻，Python 会自动把 [1, 2, 3] 塞给
        这个函数的 components 参数，然后下面两行立刻执行。

        参数：
            components：要放进向量的数字序列，例如 [1, 2, 3]
        """
        # components 就是传进来的那串数字，例如 [1, 2, 3]。
        # 用 list() 复制一份再存：
        #   如果直接写 self.components = components，存的只是"同一个列表的引用"，
        #   外面之后改了原列表，这个向量就会被悄悄改掉。复制一份就互不影响了。
        self.components = list(components)

        # dim 是我自己起的名字，dimension（维度）的缩写，存的就是上面说的"维数"。
        # len(...) 数一数里面有几个数字。
        # 为什么单独存一份：每次用的时候重新数一遍太麻烦，出生时数一次、以后直接查。
        self.dim = len(self.components)

    def __add__(self, other):
        """向量加法：对应位置相加。这就是"可加性"的代码实现。

        __add__ 是 Python 的"魔法方法"：名字以 __ 开头结尾的函数，会在你用
        + 运算符时自动被调用。所以写 a + b，实际执行的是 a.__add__(b)。
        """
        # 下面这一行塞了三个 Python 特性，逐个拆开看：
        #   zip(self.components, other.components)
        #       把两个列表按位置配成对：(1,4), (2,5), (3,6)
        #   [a + b for a, b in ...]
        #       列表推导式：对每一对都做 a + b，把结果收集成一个新列表
        #   Vector(...)
        #       用这个新列表造出一个新向量（注意：原来的两个向量不会被改动）
        #
        # 避坑：zip 遇到两个长度不一样的列表，会按"短的"那边截断，而且不报错。
        # 所以 Vector([1,2,3]) + Vector([4,5]) 会静默地返回 Vector([5, 7])，
        # 维数从 3 悄悄变成 2。这类"不报错的错"是 AI 代码里最难查的 bug。
        return Vector([a + b for a, b in zip(self.components, other.components)])

    def __sub__(self, other):
        """向量减法：对应位置相减（- 运算符，同样由 Python 自动调用）。"""
        return Vector([a - b for a, b in zip(self.components, other.components)])

    def __mul__(self, scalar):
        """数乘：每个分量都乘同一个数（* 运算符）。这就是"齐次性"的代码实现。

        注意参数名是 scalar（标量），意思是这里只接受"一个数"，不是向量。
        含义：输入放大 k 倍，输出也放大 k 倍。
        """
        return Vector([x * scalar for x in self.components])

    def dot(self, other):
        """点积：对应位置相乘，再全部加起来。结果是一个数，不是向量。

        公式：a·b = a1×b1 + a2×b2 + ... + an×bn
        例子：[1,2,3] · [4,5,6] = 1×4 + 2×5 + 3×6 = 32

        意义：它衡量"两个箭头的方向有多一致"。
        避坑：点积的大小同时受"方向"和"长度"影响。
              [1,0] · [100,0] = 100，只是因为对方很长，不是因为方向多像。
              所以点积不能直接当"像不像"用——要用下面的余弦相似度。
        """
        return sum(a * b for a, b in zip(self.components, other.components))

    def magnitude(self):
        """模（长度）：勾股定理。√(x1² + x2² + ... + xn²)

        x**2 是 x 的平方；** 0.5 就是开平方（开平方 = 0.5 次方）。
        """
        return sum(x**2 for x in self.components) ** 0.5

    def normalize(self):
        """归一化：把向量缩放到长度为 1，只保留方向、丢掉长度。

        做法：每个分量都除以自己的长度。得到的结果叫"单位向量"。
        """
        mag = self.magnitude()
        return Vector([x / mag for x in self.components])

    def cosine_similarity(self, other):
        """余弦相似度 = 点积 ÷ (两边长度相乘)。

        相当于"把长度约掉之后的点积"，所以它只反映方向像不像。
        结果范围固定在 -1 到 1：
            1  → 完全同向
            0  → 垂直，毫无关系
           -1  → 完全反向

        语义检索、RAG、记忆门控里算的"相似度"，通常就是它。
        """
        return self.dot(other) / (self.magnitude() * other.magnitude())

    def angle_between(self, other):
        """夹角（角度制）：用反余弦把相似度换算回角度。

        因为 cos θ = 余弦相似度，所以 θ = arccos(余弦相似度)。
        """
        import math

        cos_theta = self.cosine_similarity(other)
        # 避坑：小数运算有浮点误差，结果可能变成 1.0000000001，
        # 而 acos 只接受 [-1, 1] 范围内的输入，超出就会直接报错。
        # 所以先用 max/min 把它"夹"回合法范围。
        cos_theta = max(-1.0, min(1.0, cos_theta))
        return math.degrees(math.acos(cos_theta))

    def project_onto(self, other):
        """投影：把 self 投到 other 这根方向上，得到在 other 上的"影子"。

        影子长度 = (self·other) ÷ |other|，再乘上 other 的方向就是影子向量。
        了解级：本课不深究，知道有这回事即可。
        """
        scalar = self.dot(other) / other.dot(other)
        return Vector([scalar * x for x in other.components])

    def __repr__(self):
        """决定 print 出来长什么样。

        又一个魔法方法：当 Python 需要把对象变成字符串展示时（比如 print、
        或是在交互环境里直接敲变量名），会自动调用它。
        f"..." 是 f-string，字符串里用 {} 就能把变量的值直接嵌进去。
        """
        return f"Vector({self.components})"


def is_independent(vectors) -> bool:
    """判断一组向量是否线性无关。

    了解级：本课只需知道"有这么个函数"，不要求会手算。
    做法是高斯消元求秩，秩等于向量个数就说明每个向量都贡献了新维度。
    """
    n = len(vectors)
    if n == 0:
        return True
    dim = vectors[0].dim
    rows = [v.components[:] for v in vectors]
    rank = 0
    for col in range(dim):
        pivot = None
        for row in range(rank, len(rows)):
            if abs(rows[row][col]) > 1e-10:
                pivot = row
                break
        if pivot is None:
            continue
        rows[rank], rows[pivot] = rows[pivot], rows[rank]
        scale = rows[rank][col]
        rows[rank] = [x / scale for x in rows[rank]]
        for row in range(len(rows)):
            if row != rank and abs(rows[row][col]) > 1e-10:
                factor = rows[row][col]
                rows[row] = [rows[row][j] - factor * rows[rank][j] for j in range(dim)]
        rank += 1
    return rank == n


def gram_schmidt(vectors):
    """施密特正交化：把一组向量改造成互相垂直、长度全为 1 的一组。

    了解级：本课不深究，知道它能"把歪的一组方向掰成正交的一组"即可。
    """
    orthonormal = []
    for v in vectors:
        w = v
        for u in orthonormal:
            proj = w.project_onto(u)
            w = w - proj
        if w.magnitude() < 1e-10:
            continue
        orthonormal.append(w.normalize())
    return orthonormal


class Matrix:
    """矩阵：一张数表，数学身份是"线性变换"——一台把向量变成向量的机器。"""

    def __init__(self, rows):
        self.rows = [list(row) for row in rows]
        # shape = (行数, 列数)
        self.shape = (len(self.rows), len(self.rows[0]))

    def __matmul__(self, other):
        # @ 运算符：矩阵 × 矩阵，或 矩阵 × 向量
        # 这也是"神经网络的一层"的核心动作：输入向量 × 权重矩阵 = 输出向量
        if isinstance(other, Vector):
            # 每个输出分量 = 矩阵的第 i 行 与 输入向量 的点积
            return Vector([
                sum(self.rows[i][j] * other.components[j] for j in range(self.shape[1]))
                for i in range(self.shape[0])
            ])
        rows = []
        for i in range(self.shape[0]):
            row = []
            for j in range(other.shape[1]):
                row.append(sum(
                    self.rows[i][k] * other.rows[k][j]
                    for k in range(self.shape[1])
                ))
            rows.append(row)
        return Matrix(rows)

    def transpose(self):
        # 转置：行变列、列变行，形状 (m,n) -> (n,m)
        return Matrix([
            [self.rows[j][i] for j in range(self.shape[0])]
            for i in range(self.shape[1])
        ])

    def rank(self) -> int:
        """秩 = 线性无关的列数 = 这个矩阵真正装了几维有用信息。

        了解级：本课只需理解含义，不要求会手算。
        """
        rows = [row[:] for row in self.rows]
        m, n = self.shape
        r = 0
        for col in range(n):
            pivot = None
            for row in range(r, m):
                if abs(rows[row][col]) > 1e-10:
                    pivot = row
                    break
            if pivot is None:
                continue
            rows[r], rows[pivot] = rows[pivot], rows[r]
            scale = rows[r][col]
            rows[r] = [x / scale for x in rows[r]]
            for row in range(m):
                if row != r and abs(rows[row][col]) > 1e-10:
                    factor = rows[row][col]
                    rows[row] = [rows[row][j] - factor * rows[r][j] for j in range(n)]
            r += 1
        return r

    def __repr__(self):
        return f"Matrix({self.rows})"


if __name__ == "__main__":
    # ===== 今天必须看懂的部分：向量 + 点积 =====
    a = Vector([1, 2, 3])
    b = Vector([4, 5, 6])
    print("=== 向量与点积（今天要懂）===")
    print(f"a = {a}")
    print(f"b = {b}")
    print(f"a + b = {a + b}          # 可加性：对应位置相加")
    print(f"a * 3 = {a * 3}          # 齐次性：整体放大 3 倍")
    print(f"a · b = {a.dot(b)}          # 点积：结果是一个数！1*4+2*5+3*6")
    print(f"|a|   = {a.magnitude():.4f}     # 模：√(1²+2²+3²)")
    print(f"cos(a,b) = {a.cosine_similarity(b):.4f}  # 余弦相似度")

    # 用余弦相似度验证"点积大 = 方向像"
    x = Vector([1, 0])
    y = Vector([0, 1])
    z = Vector([1, 1])
    print("\n=== 方向像不像（今天要懂）===")
    print(f"x·y = {x.dot(y)}  → 0 表示垂直、完全无关")
    print(f"x·z = {x.dot(z)}  → 正数表示同向、有点像")
    print(f"x 与 y 夹角: {x.angle_between(y):.1f}°")
    print(f"x 与 z 夹角: {x.angle_between(z):.1f}°")
    print(f"x 与 x 夹角: {x.angle_between(x):.1f}°")

    # ===== 今天必须看懂的部分：矩阵 = 变形机器 =====
    print("\n=== 矩阵 = 变形机器（今天要懂）===")
    rotation_90 = Matrix([[0, -1], [1, 0]])  # 逆时针旋转 90° 的矩阵
    point = Vector([3, 1])
    print(f"把 {point} 旋转 90° → {rotation_90 @ point}")

    # ===== 了解级：投影 / 线性无关 / 正交化 / 秩 =====
    print("\n=== 了解级（今天不要求懂）===")
    p = Vector([3, 4])
    base = Vector([1, 0])
    proj = p.project_onto(base)
    print(f"投影：{p} 在 {base} 方向上的影子 = {proj}，残差 = {p - proj}")

    e1, e2, e3 = Vector([1, 0, 0]), Vector([0, 1, 0]), Vector([0, 0, 1])
    dep = Vector([2, 1, 0])
    print(f"{{e1,e2,e3}} 线性无关: {is_independent([e1, e2, e3])}")
    print(f"{{e1,e2,2*e1+e2}} 线性无关: {is_independent([e1, e2, dep])}")

    basis = gram_schmidt([Vector([1, 1, 0]), Vector([1, 0, 1]), Vector([0, 1, 1])])
    print(f"正交化后的三个方向: {basis}")
    print(f"它们两两点积（应为 0）: {basis[0].dot(basis[1]):.6f}")

    print("\n=== 秩（了解级，知道含义即可）===")
    print(f"单位矩阵 rank: {Matrix([[1, 0], [0, 1]]).rank()}          # 满秩，信息不冗余")
    print(f"[[1,2],[2,4]] rank: {Matrix([[1, 2], [2, 4]]).rank()}       # 第2行=第1行×2，压扁成1维")

    # ===== 收尾：神经网络的一层就是这个动作 =====
    print("\n=== 神经网络的一层（今天要懂的一句话）===")
    import random

    random.seed(42)
    weights = Matrix([[random.gauss(0, 0.1) for _ in range(3)] for _ in range(2)])
    input_vec = Vector([1.0, 0.5, -0.3])
    output = weights @ input_vec
    print(f"权重矩阵 shape = {weights.shape}")
    print(f"输入 (3维):  {input_vec}")
    print(f"输出 (2维):  {output}")
    print("^ 神经网络的一层，做的就是这件事：进一个向量，乘一个矩阵，出一个新向量。")