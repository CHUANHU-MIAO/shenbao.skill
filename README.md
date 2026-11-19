# shenbao.skill

企业荣誉证书、资质认定与政府项目申报的材料助手。给 DSH / Claude Code / Codex 等支持
`SKILL.md` 的 agent 使用。

它不预测申报能不能过，只做三件事：

1. 根据申报网址或申报文件，拆出**材料清单**；
2. 把清单**落盘记住**，下次继续；
3. 逐项核对客户材料，只判断**材料是否符合要求**，最后输出**材料比对清单 + 整改建议**。

## 调用效果

客户说：

> 用 shenbao 帮我申报 2026 年河北省专精特新，网址是 https://...

Agent 会：

1. 建案，读取通知；
2. 输出材料清单（编号、类别、必须性、形式要求、当前状态）；
3. 问「要不要现在开始逐项核对材料？」；
4. 客户上传一份，核对一份，输出「符合要求 / 部分符合 / 不符合 / 无法判断 / 未提供」；
5. 问「还有材料需要一起核对吗？」；
6. 没有更多材料后，输出最终比对表：申报要求、现有材料、是否符合要求、缺口、整改建议。

## 安装

### 方式一：项目级（推荐）

在项目根目录执行：

```bash
mkdir -p .dsh/skills
git clone https://github.com/CHUANHU-MIAO/shenbao.skill.git .dsh/skills/shenbao.skill
```

或者把整个 `shenbao.skill` 目录放到：

```text
<项目>/.dsh/skills/shenbao.skill/
```

### 方式二：用户级

放到：

```text
~/.dsh/skills/shenbao.skill/
```

然后重启 DSH / 重新加载技能列表，在技能里调用 `shenbao`。

> 目录名可以带 `.skill` 后缀；技能名以 `SKILL.md` 的 `name: shenbao` 为准。

## 使用示例

```text
用 shenbao 帮我准备申报材料。
公司：河北某某科技有限公司
事项：2026 年河北省专精特新中小企业
网址：https://...
```

```text
用 shenbao 继续上次的申报。
```

```text
用 shenbao 核对这份审计报告，对应清单 M02。
```

## 命令行工具

建案：

```bash
node scripts/init-case.mjs \
  --company "河北某某科技有限公司" \
  --program "河北省专精特新中小企业" \
  --region "河北省" \
  --year 2026 \
  --deadline "2026-06-30" \
  --source "https://..."
```

查看进度：

```bash
node scripts/summarize-case.mjs "申报事项/2026-河北省-河北省专精特新中小企业-河北某某科技"
```

## 案件目录

```text
申报事项/<年份>-<地区>-<申报事项>-<公司简称>/
├── case.json
├── 01-申报要求.md
├── 02-材料清单.md
├── 03-材料清单.json     # 唯一事实源
├── 04-核对记录.md
├── 05-最终比对.md
├── source/              # 通知、网页另存、附件
└── materials/           # 客户材料，按 M01/M02 命名
```

客户材料不要提交到公开仓库。

## 结构

```text
shenbao.skill/
├── SKILL.md
├── README.md
├── package.json
├── LICENSE
├── references/
│   ├── intake.md
│   ├── checklist-schema.md
│   ├── review-rules.md
│   ├── program-patterns.md
│   └── output-templates.md
└── scripts/
    ├── init-case.mjs
    └── summarize-case.mjs
```

## 边界

- 不编造证书、审计报告、合同、人员、知识产权、财务数据；
- 不替客户伪造盖章、签字、日期；
- 不承诺「包过」「成功率」「内部渠道」；
- 不输出申报成功/不成功的结论；
- 最终结果以主管部门审核为准。

## 版本

- v1.0.0 · 2026-11-19

## License

MIT
