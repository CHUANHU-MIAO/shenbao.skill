# 材料清单 JSON 结构

`03-材料清单.json` 是唯一事实源。每次核对后立即更新，不要只改 Markdown。

## 示例

```json
{
  "case": {
    "company": "河北某某科技有限公司",
    "program": "河北省专精特新中小企业",
    "region": "河北省",
    "year": "2026",
    "batch": "第一批",
    "deadline": "2026-06-30",
    "source_url": "https://example.gov.cn/notice/xxx",
    "source_title": "关于组织开展2026年河北省专精特新中小企业申报工作的通知",
    "source_date": "2026-05-10",
    "accessed_at": "2026-05-20",
    "updated_at": "2026-05-20T10:00:00+08:00"
  },
  "items": [
    {
      "id": "M01",
      "category": "主体资格",
      "requirement": "营业执照副本",
      "requirement_detail": "合法有效，经营范围覆盖申报业务，加盖公章",
      "source_quote": "申报材料第1条：营业执照副本复印件（加盖公章）",
      "source_location": "通知第2页 / 附件1",
      "mandatory": "必须",
      "format": "PDF，加盖公章，彩色扫描",
      "owner": "财务/行政",
      "due": "2026-06-20",
      "status": "未提供",
      "evidence": [],
      "gap": "",
      "remediation": "",
      "notes": ""
    }
  ],
  "summary": {
    "total": 1,
    "met": 0,
    "partial": 0,
    "not_met": 0,
    "unable": 0,
    "missing": 1
  }
}
```

## 字段说明

| 字段 | 说明 |
|---|---|
| `id` | `M01`、`M02`…；按类别连续编号，便于客户沟通 |
| `category` | 主体资格 / 财务 / 研发项目 / 知识产权 / 人员 / 业绩 / 制度体系 / 承诺附件 / 格式 |
| `requirement` | 材料名称，短 |
| `requirement_detail` | 要求要点：有效期、金额、年度、盖章、份数等 |
| `source_quote` | 通知原文，尽量一字不改 |
| `source_location` | 页码、章节、附件名、网址位置 |
| `mandatory` | `必须` / `加分` / `格式` / `待确认` |
| `format` | PDF/纸质/份数/盖章/命名/大小 |
| `owner` | 客户内部负责人（可空） |
| `due` | 内部截止（可空） |
| `status` | 见下 |
| `evidence` | 客户提供的文件名/页码/说明 |
| `gap` | 缺什么 |
| `remediation` | 怎么补 |
| `notes` | 其他 |

## 状态定义

| 状态 | 含义 |
|---|---|
| `未提供` | 客户还没给 |
| `符合要求` | 内容、形式、时间、盖章均满足已写明要求 |
| `部分符合` | 主体/内容对，但缺页、缺章、过期、版本旧、信息不全 |
| `不符合` | 关键要求不满足：主体不一致、证书过期、金额/人数不达标、文件类型错 |
| `无法判断` | 文件模糊、缺页、非中文无翻译、通知要求不明确 |

> 没有「通过 / 不通过」状态。申报是否通过不在本技能判断范围。

## 更新规则

1. 每核对一项，更新 `status`、`evidence`、`gap`、`remediation`、`notes`。
2. 重新计算 `summary`：
   - `met` = 符合要求
   - `partial` = 部分符合
   - `not_met` = 不符合
   - `unable` = 无法判断
   - `missing` = 未提供
3. 更新 `case.updated_at`。
4. 同步 `02-材料清单.md` 的表格和 `04-核对记录.md` 的追加记录。
5. 如果申报要求更新：保留旧清单版本，新增 `清单版本` 字段或在 `01-申报要求.md` 记录变更，不要直接覆盖历史。
