#!/usr/bin/env node
/**
 * 读取 03-材料清单.json，输出统计和未完成项。
 * 用法：node scripts/summarize-case.mjs [案件目录或 03-材料清单.json]
 */
import fs from 'node:fs'
import path from 'node:path'

function findCase(input) {
  if (input) {
    const p = path.resolve(input)
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) return path.join(p, '03-材料清单.json')
    return p
  }
  const base = path.join(process.cwd(), '申报事项')
  if (!fs.existsSync(base)) return ''
  for (const name of fs.readdirSync(base)) {
    const p = path.join(base, name, '03-材料清单.json')
    if (fs.existsSync(p)) return p
  }
  return ''
}

const file = findCase(process.argv[2])
if (!file || !fs.existsSync(file)) {
  console.error('没有找到 03-材料清单.json；请先运行 init-case.mjs 或传入案件目录。')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'))
const items = Array.isArray(data.items) ? data.items : []
const count = (s) => items.filter((x) => x.status === s).length
const summary = {
  total: items.length,
  met: count('符合要求'),
  partial: count('部分符合'),
  not_met: count('不符合'),
  unable: count('无法判断'),
  missing: count('未提供')
}

console.log(`# ${data.case?.program || '申报事项'} / ${data.case?.company || '（未填公司）'}`)
console.log(`- 地区/年份：${data.case?.region || '—'} / ${data.case?.year || '—'}`)
console.log(`- 截止：${data.case?.deadline || '—'}`)
console.log(`- 来源：${data.case?.source_url || data.case?.source_title || '—'}`)
console.log(`- 清单文件：${file}`)
console.log('')
console.log(`共 ${summary.total} 项：符合 ${summary.met}、部分符合 ${summary.partial}、不符合 ${summary.not_met}、无法判断 ${summary.unable}、未提供 ${summary.missing}`)

const pending = items.filter((x) => x.status !== '符合要求')
if (pending.length) {
  console.log('')
  console.log('| 编号 | 材料 | 状态 | 缺口 | 整改 |')
  console.log('|---|---|---|---|---|')
  for (const x of pending) {
    console.log(`| ${x.id || ''} | ${x.requirement || ''} | ${x.status || '未提供'} | ${(x.gap || '').replace(/\|/g, '\\|')} | ${(x.remediation || '').replace(/\|/g, '\\|')} |`)
  }
}
