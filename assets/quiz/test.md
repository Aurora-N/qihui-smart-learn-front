一、基础题（记忆/理解层面）
1. [HTML5] 语义化标签的作用是？
A) 提升SEO效果
B) 使页面更美观
C) 增加动画效果
D) 替代div标签
✅答案：A
📝解析：section/article等语义标签帮助爬虫理解内容结构

2. [CSS3] Flex布局主轴对齐属性是？
A) align-items
B) justify-content
C) flex-direction
D) flex-wrap
✅答案：B
📝解析：justify-content控制主轴对齐，align-items控制交叉轴

3. [JavaScript] 下列哪个会触发变量提升？
A) let
B) const
C) var
D) class
✅答案：C
📝解析：var声明会提升到作用域顶部

4. [TypeScript] 类型注解符号是？
A) :
B) =>
C) <>
D) !
✅答案：A
📝解析：TS使用let age: number语法

二、中等题（应用/分析层面）
5. [Vue3] Composition API核心函数是？
A) data()
B) setup()
C) methods
D) computed
✅答案：B
📝解析：setup()是组合式API的入口函数

6. [React] useEffect(()=>{}, [])等效于？
A) componentDidMount
B) componentDidUpdate
C) componentWillUnmount
D) shouldComponentUpdate
✅答案：A
📝解析：空依赖数组表示只执行一次

7. [Angular] 服务注入的正确方式是？
A) @Injectable()装饰器
B) providers数组注册
C) 两者都需要
D) 都不需要
✅答案：C
📝解析：需要装饰器声明+模块/组件注册

8. [CSS3] 实现垂直居中的最佳方案：
A) position: absolute + margin
B) Flex布局align-items
C) Grid布局place-items
D) vertical-align
✅答案：B/C
📝解析：B和C都是现代方案，B兼容性更好

三、进阶题（分析/评价层面）
9. [Vue3] 响应式原理基于：
A) Object.defineProperty
B) Proxy
C) Value setter
D) Dirty checking
✅答案：B
📝解析：Vue3使用Proxy实现响应式

10. [React] React Fiber架构主要解决：
A) 组件通信
B) 异步渲染
C) 状态管理
D) 样式隔离
✅答案：B
📝解析：Fiber实现可中断的异步渲染

三、进阶题（分析/评价层面）（续）
11. [Angular] 变更检测策略OnPush的触发条件是？
A) 输入属性变化
B) 事件触发
C) 异步操作完成
D) 以上所有
✅答案：D
📝解析：OnPush策略在输入变更、事件触发或异步流时触发检测

12. [TypeScript] 泛型<T>的主要作用是？
A) 限制变量类型
B) 提高运行时性能
C) 创建可复用组件
D) 替代接口声明
✅答案：C
📝解析：泛型用于创建灵活且类型安全的可复用代码结构

13. [React] 使用useMemo优化的是？
A) 网络请求延迟
B) 复杂计算缓存
C) DOM渲染速度
D) 事件处理函数
✅答案：B
📝解析：useMemo缓存计算结果，避免重复执行昂贵运算

四、高阶题（评价/创造层面）
14. [Vue3] 对比Options API，Composition API的核心优势是？
A) 减少代码量
B) 逻辑关注点聚合
C) 更好的TypeScript支持
D) 更高的性能
✅答案：B
📝解析：组合式API可将相关逻辑组织在一起，解决选项式API的碎片化问题

15. [CSS3] 使用Grid布局时，grid-template-areas的作用是？
A) 定义隐式网格
B) 控制网格间距
C) 可视化布局结构
D) 设置响应式断点
✅答案：C
📝解析：通过命名区域直观描述布局结构，增强代码可读性

16. [JavaScript] Promise.allSettled()与Promise.all()的关键区别是？
A) 处理异步任务顺序
B) 是否捕获异常
C) 返回结果格式
D) 全部任务必须成功
✅答案：B/D
📝解析：all()需要全部成功，allSettled()始终返回每个promise结果（修正：正确答案为D）

五、综合应用题（创造层面）
17. [框架对比] 需要在大型企业级项目中选择框架，最应优先考虑：
A) Vue3的灵活生态
B) React的社区规模
C) Angular的全套解决方案
D) 团队现有技术栈
✅答案：C/D
📝解析：企业级项目通常需要完整解决方案（C），但实际决策需结合团队能力（D）

18. [TypeScript] 实现类型安全的深拷贝函数需要：
A) 递归处理对象属性
B) 使用JSON.parse/stringify
C) 类型谓词校验
D) 以上所有
✅答案：D
📝解析：完整方案需要递归处理+类型校验，JSON方式会丢失函数等数据类型

19. [性能优化] 列表渲染出现卡顿，首先应检查：
A) 虚拟滚动实现
B) 组件卸载逻辑
C) 不必要的重新渲染
D) CSS图层合成
✅答案：C
📝解析：React.memo/Vue v-memo等可优先解决重复渲染问题

20. [架构设计] 微前端方案qiankun的核心原理是？
A) Web Components隔离
B) iframe通信
C) JS沙箱与样式隔离
D) 服务端模板聚合
✅答案：C
📝解析：通过Proxy实现JS沙箱，CSS scoped隔离样式