window.NEW_WEAPON_DATA = {
  weapons: {
    ak47: {base:'ar_aug',name:'AK-47',category:'ไรเฟิลจู่โจม (หนัก)',dmg:42,rpm:600,mag:30,spread:0.016,recoil:0.036,color:0x5a4632,desc:'ดาเมจสูง แรงดีดแรง'},
    m4a1: {base:'ar_aug',name:'M4A1',category:'ไรเฟิลจู่โจม (คล่อง)',dmg:33,rpm:800,mag:30,reloadTime:3.0,spread:0.012,recoil:0.017,color:0x2b2f36,desc:'ยิงไว แรงดีดต่ำ'},
    thompson: {base:'smg_kriss',name:'Thompson M1928',category:'ปืนกลมือ',dmg:27,rpm:700,mag:30,reloadTime:1.8,spread:0.024,recoil:0.02,color:0x5a4632,desc:'ดาเมจดี ยิงรัว'},
    mp40: {base:'smg_kriss',name:'MP-40',category:'ปืนกลมือ',dmg:25,rpm:520,mag:32,reloadTime:1.9,spread:0.018,recoil:0.016,color:0x3b3f46,desc:'แม่นยำ คุมง่าย'},
    vector: {base:'smg_kriss',name:'Vector .45',category:'ปืนกลมือ (ยิงเร็วสุด)',dmg:21,rpm:1100,mag:25,reloadTime:1.3,spread:0.022,recoil:0.01,color:0x1f2937,desc:'ยิงเร็วมาก แรงดีดน้อย'},
    kar98: {base:'sr_l115',name:'Kar98k',category:'สไนเปอร์ลูกเลื่อน',dmg:95,rpm:42,mag:5,boltCycle:1.2,color:0x6b4f2d,desc:'ดาเมจสูง คล่องกว่า'},
    m200: {base:'sr_l115',name:'M200 Intervention',category:'สไนเปอร์ระยะไกล',dmg:125,rpm:40,mag:7,color:0x3b4a38,desc:'ไกลและแม่น'},
    barrett: {base:'sr_l115',name:'Barrett M82',category:'สไนเปอร์ .50 กึ่งอัตโนมัติ',dmg:140,rpm:75,mag:10,boltCycle:0.4,auto:false,recoil:0.12,reloadTime:3.2,moveSpeed:0.78,color:0x4b5563,desc:'ยิงต่อเนื่อง ดาเมจหนัก'},
    vector_dual: {base:'smg_kriss',name:'Vector คู่ (Akimbo)',category:'ปืนกลมือ (พกคู่)',dmg:19,rpm:1900,mag:50,reloadTime:1.6,spread:0.036,recoil:0.014,moveSpeed:0.96,dual:true,splitTo:'vector',color:0x1f2937,desc:'ถือ Vector 2 กระบอก ยิงรัวสุดขีด แต่กระจาย'},
    dual_glock: {base:'p_glock',name:'Glock คู่',category:'ปืนพกคู่',dmg:20,rpm:1300,mag:36,reloadTime:2.2,spread:0.045,recoil:0.02,moveSpeed:1.04,dual:true,splitTo:'p_glock',color:0x1e293b,desc:'ปืนพก 2 กระบอก ยิงถี่'},
    spin_usp: {base:'p_usp',name:'USP ซองควง',category:'ปืนพก (ควงซอง)',dmg:36,rpm:420,mag:12,reloadTime:1.6,spin:true,color:0x475569,desc:'ควงปืนตอนชัก ชักไวเท่ห์'},
    dual_blades: {base:'m_knife',name:'ดาบคู่',category:'ดาบคู่',dmg:42,heavyDmg:88,range:3.5,rpm:260,moveSpeed:1.2,dual:true,splitTo:'m_knife',color:0xcbd5e1,desc:'ฟันไวสองมือ'},
    revolver: {base:'p_deagle',name:'Magnum Revolver',category:'ปืนลูกโม่',dmg:72,rpm:130,mag:6,reloadTime:2.6,recoil:0.07,color:0x94a3b8,desc:'หนักมาก 6 นัด'},
    scar_h: {base:'ar_aug',name:'FN SCAR-H',category:'ไรเฟิลจู่โจม 7.62mm',dmg:47,rpm:580,mag:20,reloadTime:2.7,spread:0.014,recoil:0.038,color:0x44483d,desc:'กระสุนหนัก แรงและแม่นระยะกลาง'},
    famas: {base:'ar_aug',name:'FAMAS F1',category:'ไรเฟิลจู่โจมเบา',dmg:34,rpm:900,mag:25,reloadTime:2.4,spread:0.013,recoil:0.024,color:0x4b4638,desc:'เบา ยิงไว คุมง่าย'},
    p90: {base:'smg_kriss',name:'FN P90',category:'ปืนกลมือ 5.7mm',dmg:25,rpm:900,mag:50,reloadTime:2.5,spread:0.016,recoil:0.013,color:0x39404a,desc:'แม็กกาซีนความจุสูง กระสุนความเร็วสูง'},
    m24: {base:'sr_l115',name:'M24 SWS',category:'สไนเปอร์ .308',dmg:100,rpm:48,mag:5,reloadTime:2.4,boltCycle:1.0,spread:0.0007,recoil:0.075,color:0x454b3b,desc:'สไนเปอร์ .308 สมดุลระยะและแรงถีบ'}
  },
  ammo: {
    '762x51': {name:'7.62×51mm',m:0.0095,d:0.00782,cd:0.30,E:3600,Lc:0.34,twistOpt:12.6},
    '57x28': {name:'5.7×28mm',m:0.0020,d:0.00570,cd:0.31,E:670,Lc:0.18,twistOpt:9}
  },
  guns: {
    scar_h: {ammo:'762x51',L:0.406,twist:11,rif:'groove'},
    famas: {ammo:'556',L:0.488,twist:12,rif:'groove'},
    p90: {ammo:'57x28',L:0.264,twist:9,rif:'groove'},
    m24: {ammo:'762x51',L:0.610,twist:11,rif:'groove'}
  },
  classes: {scar_h:'ar',famas:'ar',p90:'smg',m24:'sr'}
};
