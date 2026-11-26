window.NEW_WEAPON_DATA = {
  weapons: {
    sg_spas: {base:'sg_spas',recoil:0.388,desc:'ลูกซอง 12 เกจ แรงถีบหนักและยกปากกระบอกชัดเจน'},
    sr_l115: {base:'sr_l115',recoil:1.195,desc:'สไนเปอร์ .338 แรงถีบสูง ต้องคืนแนวหลังยิง'},
    ak47: {base:'ar_aug',name:'AK-47',category:'ไรเฟิลจู่โจม (หนัก)',dmg:38,rpm:600,mag:30,spread:0.018,recoil:0.056,color:0x5a4632,desc:'กระสุนหนัก แรงดีดมากกว่าไรเฟิล 5.56'},
    m4a1: {base:'ar_aug',name:'M4A1',category:'ไรเฟิลจู่โจม (คล่อง)',dmg:30,rpm:750,mag:30,reloadTime:3.0,spread:0.013,recoil:0.028,color:0x2b2f36,desc:'ยิงไว แรงดีดปานกลาง คุมง่าย'},
    thompson: {base:'smg_kriss',name:'Thompson M1928',category:'ปืนกลมือ',dmg:27,rpm:680,mag:30,reloadTime:1.8,spread:0.024,recoil:0.012,color:0x5a4632,desc:'กระสุน .45 หนัก แรงดีดชัดเจน'},
    mp40: {base:'smg_kriss',name:'MP-40',category:'ปืนกลมือ',dmg:26,rpm:920,mag:32,reloadTime:1.9,spread:0.058,recoil:0.020,color:0x3b3f46,desc:'อัตรายิงไม่สูง แรงดีดคุมง่าย'},
    vector: {base:'smg_kriss',name:'Vector .45',category:'ปืนกลมือ (ยิงเร็วสุด)',dmg:20,rpm:950,mag:25,reloadTime:1.4,spread:0.026,recoil:0.014,color:0x1f2937,desc:'ยิงเร็วมาก แรงดีดต่อเนื่องสูงขึ้น'},
    kar98: {base:'sr_l115',name:'Kar98k',category:'สไนเปอร์ลูกเลื่อน',dmg:95,rpm:42,mag:5,boltCycle:1.2,recoil:1.1,color:0x6b4f2d,desc:'ลูกเลื่อน 7.92mm แรงถีบชัด ต้องคืนแนวหลังยิง'},
    m200: {base:'sr_l115',name:'M200 Intervention',category:'สไนเปอร์ระยะไกล',dmg:125,rpm:40,mag:7,recoil:1.3,color:0x3b4a38,desc:'กระสุน .408 แรงถีบสูงมาก'},
    barrett: {base:'sr_l115',name:'Barrett M82',category:'สไนเปอร์ .50 กึ่งอัตโนมัติ',dmg:135,rpm:70,mag:10,boltCycle:1.45,auto:false,recoil:1.0,reloadTime:3.4,moveSpeed:1.78,color:0x4b5563,desc:'กระสุน .50 BMG แรงถีบสูงสุดในกลุ่ม'},
    vector_dual: {base:'smg_kriss',name:'Vector คู่ (Akimbo)',category:'ปืนกลมือ (พกคู่)',dmg:16,rpm:1400,mag:100,reloadTime:2.4,spread:0.05,recoil:0.022,moveSpeed:1.94,dual:true,splitTo:'vector',color:0x1f2937,desc:'ถือ Vector 2 กระบอก กระบอกละ 50 นัด ยิงรัวมาก คุมยากขึ้น'},
    dual_glock: {base:'p_glock',name:'Glock คู่',category:'ปืนพกคู่',dmg:15,rpm:200,mag:36,reloadTime:2.6,spread:0.06,recoil:0.015,moveSpeed:1.0,dual:true,splitTo:'p_glock',color:0x1e293b,desc:'ปืนพก 2 กระบอก แรงดีดและการกระจายสูงขึ้น'},
    spin_usp: {base:'p_usp',name:'USP ซองควง',category:'ปืนพก (ควงซอง)',dmg:31,rpm:320,mag:12,reloadTime:1.8,recoil:0.011,spread:0.011,spin:true,color:0x475569,desc:'ปืนพก 9mm แรงดีดปานกลาง'},
    dual_blades: {base:'m_knife',name:'ดาบคู่',category:'ดาบคู่',dmg:42,heavyDmg:88,range:3.5,rpm:260,moveSpeed:1.2,dual:true,splitTo:'m_knife',color:0xcbd5e1,desc:'ฟันไวสองมือ'},
    revolver: {base:'p_deagle',name:'Magnum Revolver',category:'ปืนลูกโม่',dmg:68,rpm:105,mag:6,reloadTime:3.2,spread:0.018,recoil:0.019,moveSpeed:1.03,color:0x94a3b8,desc:'ลูกโม่ .44 Magnum แรงถีบหนัก ยิงช้า'},
    scar_h: {base:'ar_aug',name:'FN SCAR-H',category:'ไรเฟิลจู่โจม 7.62mm',dmg:44,rpm:550,mag:20,reloadTime:2.7,spread:0.014,recoil:0.045,color:0x44483d,desc:'กระสุน 7.62mm แรงถีบสูงกว่าไรเฟิล 5.56'},
    famas: {base:'ar_aug',name:'FAMAS F1',category:'ไรเฟิลจู่โจมเบา',dmg:29,rpm:800,mag:25,reloadTime:2.4,spread:0.014,recoil:0.030,color:0x4b4638,desc:'ไรเฟิล 5.56 เบา ยิงไว แรงดีดต่อเนื่อง'},
    p90: {base:'smg_kriss',name:'FN P90',category:'ปืนกลมือ 5.7mm',dmg:21,rpm:850,mag:50,reloadTime:2.5,spread:0.018,recoil:0.020,color:0x39404a,desc:'กระสุน 5.7mm แรงถีบต่ำ ยิงไว'},
    m24: {base:'sr_l115',name:'M24 SWS',category:'สไนเปอร์ .308',dmg:100,rpm:48,mag:5,reloadTime:2.4,boltCycle:1.0,spread:0.0007,recoil:1.0,color:0x454b3b,desc:'สไนเปอร์ .308 แรงถีบชัด แต่น้อยกว่า .338'}
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