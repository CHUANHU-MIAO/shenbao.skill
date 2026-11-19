#!/usr/bin/env node
/**
 * 初始化一个申报案件目录。
 * 用法：
 *   node scripts/init-case.mjs --company "公司全称" --program "申报事项" --region "河北" --year 2026 --deadline "2026-06-30" --source "https://..."
 */
import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback = '') {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

function safe(s) {
  return String(s || '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40) || '未命名'
}

const company = arg('company')
const program = arg('program', '未命名申报')
const region = arg('region', '')
const year = arg('year', String(new Date().getFullYear()))
const batch = arg('batch', '')
const deadline = arg('deadline', '')
const source = arg('source', '')
const now = new Date().toISOString()

const shortCompany = safe(company).slice(0, 12)
const dirName = [year, region, program, shortCompany].filter(Boolean).map(safe).join('-')
const root = process.cwd()
const base = path.join(root, '申报事项')
const caseDir = path.join(base, dirName)

if (fs.existsSync(caseDir)) {
  console.log(`案件已存在：${caseDir}`)
  console.log('请先读取 03-材料清单.json，不要覆盖。')
  process.exit(0)
}

fs.mkdirSync(path.join(caseDir, 'source'), { recursive: true })
fs.mkdirSync(path.join(caseDir, 'materials'), { recursive: true })

const caseData = {
  case: {
    company,
    program,
    region,
    year,
    batch,
    deadline,
    source_url: /^https?:\/\//.test(source) ? source : '',
    source_title: /^https?:\/\//.test(source) ? '' : source,
    source_date: '',
    accessed_at: '',
    updated_at: now
  },
  items: [],
  summary: { total: 0, met: 0, partial: 0, not_met: 0, unable: 0, missing: 0 }
}

const json = JSON.stringify(caseData, null, 2)
fs.writeFileSync(path.join(caseDir, 'case.json'), json)
fs.writeFileSync(path.join(caseDir, '03-材料清单.json'), json)

fs.writeFileSync(path.join(caseDir, '01-申报要求.md'), `# 申报要求

- 公司：${company || '（待补充）'}
- 申报事项：${program}
- 地区：${region || '（待补充）'}
- 年份/批次：${year}${batch ? ' / ' + batch : ''}
- 截止时间：${deadline || '（待确认）'}
- 来源：${source || '（待客户提供网址或通知文件）'}
- 读取日期：

## 原文摘录

> 将申报通知正文、附件目录、材料清单原文粘贴到这里，保留页码/章节。

## 关键条件

- [ ] 主体资格
- [ ] 财务指标
- [ ] 研发/项目
- [ ] 知识产权
- [ ] 人员
- [ ] 业绩
- [ ] 制度/体系
- [ ] 承诺/附件
- [ ] 格式/份数/截止

## 待确认

- 通知未写明或页面无法读取的内容：
`)

fs.writeFileSync(path.join(caseDir, '02-材料清单.md'), `# 材料清单

> 本文件从 \`03-材料清单.json\` 同步；每次核对后更新 JSON，再同步这里。

| 编号 | 类别 | 材料 | 必须性 | 形式要求 | 状态 | 缺口/整改 |
|---|---|---|---|---|---|---|
| — | — | 尚未录入 | — | — | — | 先读取申报要求 |
`)

fs.writeFileSync(path.join(caseDir, '04-核对记录.md'), `# 核对记录

- 案件：${program} / ${company || '（待补充）'}
- 创建时间：${now}

## 记录

（每核对一项追加一条：时间、编号、结论、依据、缺口、整改）
`)

fs.writeFileSync(path.join(caseDir, '05-最终比对.md'), `# 材料比对清单

- 公司：${company || '（待补充）'}
- 申报事项：${program}
- 要求来源：${source || '（待补充）'}
- 核对日期：

| 编号 | 申报要求 | 要求要点 | 现有材料 | 是否符合要求 | 缺口与整改建议 |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

> 以上只核对材料是否符合申报要求，不代表申报是否通过；最终以主管部门审核为准。
`)

fs.writeFileSync(path.join(caseDir, 'materials', 'README.md'), `# 材料文件命名

建议按清单编号命名，便于核对：

- \`M01-营业执照.pdf\`
- \`M02-2025年度审计报告.pdf\`
- \`M03-发明专利证书.pdf\`

不要把身份证、财务报表、合同等敏感文件提交到公开仓库。
`)

console.log(`已创建案件：${caseDir}`)
console.log('下一步：读取 source/ 下的申报通知，写入 01-申报要求.md，再生成 03-材料清单.json。')
