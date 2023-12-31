import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// 表单校验
export const rules = reactive({
  sourceName: [required],
  sourceCode: [required],
  status: [required]
})
// CrudSchema
const crudSchemas = reactive<VxeCrudSchema>({
  action: true,
  actionWidth: '300px',
  columns: [
    {
      title: '线索来源名称',
      field: 'sourceName',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    },
    {
      title: '线索来源编码',
      field: 'sourceCode',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    }
    // {
    //   title: 'OA线索来源',
    //   field: 'status',
    //   form: {
    //     colProps: {
    //       span: 24
    //     }
    //   },
    //   disabled: true
    // }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)

export const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          },
          {
            value: 'controllability',
            label: 'Controllability'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation'
          },
          {
            value: 'top nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  }
]

export const oa_source_res = {
  data: [
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '官网活动',
              clueSourceId: '1670003',
              parentId: '1670002'
            },
            {
              children: [],
              clueName: '官网试驾',
              clueSourceId: '1670004',
              parentId: '1670002'
            },
            {
              children: [],
              clueName: '官网在线客服',
              clueSourceId: '1670005',
              parentId: '1670002'
            }
          ],
          clueName: '厂家官网',
          clueSourceId: '1670002',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '金融-官网',
              clueSourceId: '1670007',
              parentId: '1670006'
            },
            {
              children: [],
              clueName: '金融-微信',
              clueSourceId: '1670008',
              parentId: '1670006'
            }
          ],
          clueName: '长城金融',
          clueSourceId: '1670006',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '400语音自助',
              clueSourceId: '1670010',
              parentId: '1670009'
            },
            {
              children: [],
              clueName: '厂家400咨询',
              clueSourceId: '1670011',
              parentId: '1670009'
            }
          ],
          clueName: '厂家400',
          clueSourceId: '1670009',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: 'APP在线客服',
              clueSourceId: '1670013',
              parentId: '1670012'
            }
          ],
          clueName: 'APP',
          clueSourceId: '1670012',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '天猫优惠活动',
              clueSourceId: '1670015',
              parentId: '1670014'
            },
            {
              children: [],
              clueName: '天猫订单',
              clueSourceId: '1670016',
              parentId: '1670014'
            },
            {
              children: [],
              clueName: '天猫精品',
              clueSourceId: '1670017',
              parentId: '1670014'
            }
          ],
          clueName: '天猫',
          clueSourceId: '1670014',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '网上4S店-活动',
              clueSourceId: '1670019',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-置换',
              clueSourceId: '1670020',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城在线客服',
              clueSourceId: '1670021',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城配件',
              clueSourceId: '1670022',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城精品',
              clueSourceId: '1670023',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '网上4S店-置换',
              clueSourceId: '1670024',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-询价',
              clueSourceId: '1670025',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-400',
              clueSourceId: '1670026',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-试驾',
              clueSourceId: '1670027',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-预售',
              clueSourceId: '1670028',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: 'ECP订单',
              clueSourceId: '1670029',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '微店-订单',
              clueSourceId: '1670030',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '微店-活动',
              clueSourceId: '1670031',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '微店-试驾',
              clueSourceId: '1670032',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城优惠活动',
              clueSourceId: '1670033',
              parentId: '1670018'
            }
          ],
          clueName: '商城',
          clueSourceId: '1670018',
          parentId: '1670001'
        }
      ],
      clueName: '厂家线索',
      clueSourceId: '1670001',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '老客户介绍',
              clueSourceId: '1670036',
              parentId: '1670035'
            },
            {
              children: [],
              clueName: '亲友介绍',
              clueSourceId: '1670037',
              parentId: '1670035'
            }
          ],
          clueName: '主动开发',
          clueSourceId: '1670035',
          parentId: '1670034'
        }
      ],
      clueName: '主动开发',
      clueSourceId: '1670034',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '老客户介绍',
              clueSourceId: '1670040',
              parentId: '1670039'
            }
          ],
          clueName: '老客户介绍',
          clueSourceId: '1670039',
          parentId: '1670038'
        }
      ],
      clueName: '老客户介绍',
      clueSourceId: '1670038',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '市场活动',
              clueSourceId: '1670043',
              parentId: '1670042'
            },
            {
              children: [],
              clueName: '万达类商超定展',
              clueSourceId: '1670044',
              parentId: '1670042'
            }
          ],
          clueName: '市场活动',
          clueSourceId: '1670042',
          parentId: '1670041'
        }
      ],
      clueName: '市场活动',
      clueSourceId: '1670041',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '其他',
              clueSourceId: '1670047',
              parentId: '1670046'
            }
          ],
          clueName: '其他',
          clueSourceId: '1670046',
          parentId: '1670045'
        }
      ],
      clueName: '其他',
      clueSourceId: '1670045',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '自然进店',
              clueSourceId: '1670050',
              parentId: '1670049'
            }
          ],
          clueName: '自然进店',
          clueSourceId: '1670049',
          parentId: '1670048'
        }
      ],
      clueName: '自然进店',
      clueSourceId: '1670048',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '易车网-置换',
              clueSourceId: '1670053',
              parentId: '1670052'
            },
            {
              children: [],
              clueName: '易车网-试驾',
              clueSourceId: '1670054',
              parentId: '1670052'
            },
            {
              children: [],
              clueName: '易车网-询价',
              clueSourceId: '1670055',
              parentId: '1670052'
            },
            {
              children: [],
              clueName: '易车网-400',
              clueSourceId: '1670056',
              parentId: '1670052'
            }
          ],
          clueName: '易车网',
          clueSourceId: '1670052',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '优信车伯乐',
              clueSourceId: '1670058',
              parentId: '1670057'
            }
          ],
          clueName: '优信车伯乐',
          clueSourceId: '1670057',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '爱卡汽车-询价',
              clueSourceId: '1670060',
              parentId: '1670059'
            },
            {
              children: [],
              clueName: '爱卡汽车-400',
              clueSourceId: '1670061',
              parentId: '1670059'
            }
          ],
          clueName: '爱卡汽车',
          clueSourceId: '1670059',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '汽车之家-试驾',
              clueSourceId: '1670063',
              parentId: '1670062'
            },
            {
              children: [],
              clueName: '汽车之家-400',
              clueSourceId: '1670064',
              parentId: '1670062'
            },
            {
              children: [],
              clueName: '汽车之家-询价',
              clueSourceId: '1670065',
              parentId: '1670062'
            }
          ],
          clueName: '汽车之家',
          clueSourceId: '1670062',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '太平洋-400',
              clueSourceId: '1670067',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-询价',
              clueSourceId: '1670068',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-试驾',
              clueSourceId: '1670069',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-促销',
              clueSourceId: '1670070',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-置换',
              clueSourceId: '1670071',
              parentId: '1670066'
            }
          ],
          clueName: '太平洋汽车网',
          clueSourceId: '1670066',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '懂车帝-询价',
              clueSourceId: '1670073',
              parentId: '1670072'
            },
            {
              children: [],
              clueName: '懂车帝-400',
              clueSourceId: '1670074',
              parentId: '1670072'
            }
          ],
          clueName: '懂车帝',
          clueSourceId: '1670072',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '腾讯汽车',
              clueSourceId: '1670076',
              parentId: '1670075'
            }
          ],
          clueName: '腾讯汽车',
          clueSourceId: '1670075',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '新浪汽车',
              clueSourceId: '1670078',
              parentId: '1670077'
            }
          ],
          clueName: '新浪汽车',
          clueSourceId: '1670077',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '行圆-置换',
              clueSourceId: '1670080',
              parentId: '1670079'
            },
            {
              children: [],
              clueName: '行圆智慧云',
              clueSourceId: '1670081',
              parentId: '1670079'
            },
            {
              children: [],
              clueName: '行圆-新车',
              clueSourceId: '1670082',
              parentId: '1670079'
            },
            {
              children: [
                {
                  children: [],
                  clueName: '行圆-试驾-test',
                  clueSourceId: '1670090',
                  parentId: '1670083'
                }
              ],
              clueName: '行圆-试驾',
              clueSourceId: '1670083',
              parentId: '1670079'
            }
          ],
          clueName: '行圆',
          clueSourceId: '1670079',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '百度有驾-询价',
              clueSourceId: '1670085',
              parentId: '1670084'
            }
          ],
          clueName: '百度有驾',
          clueSourceId: '1670084',
          parentId: '1670051'
        }
      ],
      clueName: '垂直媒体',
      clueSourceId: '1670051',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '电话预约',
              clueSourceId: '1670088',
              parentId: '1670087'
            },
            {
              children: [],
              clueName: '销售热线',
              clueSourceId: '1670089',
              parentId: '1670087'
            }
          ],
          clueName: '销售热线',
          clueSourceId: '1670087',
          parentId: '1670086'
        }
      ],
      clueName: '销售热线',
      clueSourceId: '1670086',
      parentId: '0'
    }
  ],
  message: 'SUCCESS',
  sign: '',
  status: 200,
  timestamp: 0
}
