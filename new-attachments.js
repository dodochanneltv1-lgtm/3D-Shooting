(() => {
  const sights = [
    {id:'iron',label:'ศูนย์เล็งเริ่มต้น',zoom:1.15,price:0},
    {id:'red-dot',label:'เรดด็อท',zoom:1.35,price:60},
    ...[2,3,4,5,6,7,8,10,12,16,20,24,32].map(zoom=>({id:`${zoom}x`,label:`สโคป x${zoom} (ล็อกระยะ)`,zoom,price:zoom<=4?80:zoom<=8?120:zoom<=16?180:240})),
    {id:'v1-4',label:'สโคปซูมได้ x1–4',zoom:1.5,min:1,max:4,price:130},
    {id:'v2-6',label:'สโคปซูมได้ x2–6',zoom:2,min:2,max:6,price:150},
    {id:'v3-9',label:'สโคปซูมได้ x3–9',zoom:3,min:3,max:9,price:170},
    {id:'v4-12',label:'สโคปซูมได้ x4–12',zoom:4,min:4,max:12,price:200},
    {id:'v6-24',label:'สโคปซูมได้ x6–24',zoom:6,min:6,max:24,price:240},
    {id:'v8-32',label:'สโคปซูมได้ x8–32',zoom:8,min:8,max:32,price:280},
    {id:'rangefinder',label:'สโคปวัดระยะ x6',zoom:6,rangefinder:true,price:220},
    {id:'smart-x4',label:'สโคปอัจฉริยะ x4 (คำนวณจุดเล็ง)',zoom:4,smart:true,price:250},
    {id:'smart-x6',label:'สโคปอัจฉริยะ x6 (ปรับซูม x2–12)',zoom:6,min:2,max:12,smart:true,price:270},
    {id:'smart-x8',label:'สโคปอัจฉริยะ x8 (คำนวณจุดเล็ง)',zoom:8,smart:true,price:280},
    {id:'smart-x2-6',label:'สโคปอัจฉริยะ x2–6 (ปรับซูมได้)',zoom:4,min:2,max:6,smart:true,price:240},
    {id:'smart-x4-12',label:'สโคปอัจฉริยะ x4–12 (ปรับซูมได้)',zoom:6,min:4,max:12,smart:true,price:270},
    {id:'smart-x3-9',label:'สโคปอัจฉริยะ x3–9 (ปรับซูมได้)',zoom:4,min:3,max:9,smart:true,price:260},
    {id:'smart-x6-24',label:'สโคปอัจฉริยะ x6–24 (ปรับซูมได้)',zoom:8,min:6,max:24,smart:true,price:300},
    {id:'smart-x8-32',label:'สโคปอัจฉริยะ x8–32 (ระยะไกลพิเศษ)',zoom:10,min:8,max:32,smart:true,price:300}
  ];

  window.NEW_ATTACHMENT_DATA = {
    sights,
    muzzles: {
      suppressor:{label:'Suppressor (-38% ระยะเสียง, -12% แรงดีด, -4% ความเร็ว, -2% คล่องตัว)',sound:0.62,velocity:0.96,recoil:0.88,moveSpeed:0.98,flash:0.35,price:120},
      compensator:{label:'Compensator (-28% แรงดีด, -20% สะบัดข้าง, +5% กระจาย)',recoil:0.72,sway:0.8,spread:1.05,sound:1.12,flash:1,price:90},
      flashHider:{label:'Flash Hider (-75% แสง, -8% แรงดีด)',flash:0.25,recoil:0.92,sound:0.98,price:80}
    },
    barrels: {
      standard:{label:'ลำกล้องมาตรฐาน',price:0},
      range:{label:'ลำกล้องยาว (กระสุนเร็วขึ้นมาก/ตกน้อยลง, -5% คล่องตัว)',barrelMul:1.45,cdMul:0.88,moveSpeed:0.95,price:110},
      damage:{label:'ลำกล้องแรงสูง +P (ดาเมจ/ความเร็วสูงขึ้น, +15% แรงดีด)',chargeMul:1.2,recoil:1.15,price:130},
      precision:{label:'ลำกล้องแม่นยำ (-15% กระจาย, -3% คล่องตัว)',barrelMul:1.2,cdMul:0.88,spread:0.85,moveSpeed:0.97,price:160}
    },
    grips: {
      vertical:{label:'ด้ามตั้ง (-32% แรงดีดแนวตั้ง, -15% สะบัดข้าง)',recoil:0.68,sway:0.85,price:90},
      angled:{label:'ด้ามเฉียง (-18% ดีด, -40% สะบัดข้าง, -8% กระจาย)',recoil:0.82,sway:0.6,spread:0.92,price:100},
      rubber:{label:'ด้ามยาง (-26% แรงดีด, -20% สะบัดข้าง)',recoil:0.74,sway:0.8,price:80},
      handstop:{label:'แฮนด์สต็อป (-12% ดีด, -15% สะบัดข้าง, +3% คล่องตัว)',recoil:0.88,sway:0.85,moveSpeed:1.03,price:75}
    },
    stocks: {
      tactical:{label:'พานท้ายยุทธวิธี (-24% แรงดีด, -15% สะบัดข้าง)',recoil:0.76,sway:0.85,price:100},
      heavy:{label:'พานท้ายหนัก (-34% ดีด, -25% สะบัดข้าง, -6% คล่องตัว)',recoil:0.66,sway:0.75,moveSpeed:0.94,price:120},
      lightweight:{label:'พานท้ายเบา (-12% ดีด, +3% คล่องตัว)',recoil:0.88,moveSpeed:1.03,moveSpeed:1.02,price:90},
      precision:{label:'พานท้ายแม่นยำ (-26% ดีด, -6% กระจาย)',recoil:0.74,spread:0.94,price:130}
    },
    triggers: {
      standard:{label:'ชุดลั่นไกมาตรฐาน',price:0},
      match:{label:'ชุดลั่นไกแม่นยำ (-20% กระจาย)',spread:0.8,price:120},
      rapid:{label:'ชุดลั่นไกตอบสนองไว (+12% อัตรายิง, +18% แรงดีด)',rpm:1.12,recoil:1.18,price:160}
    },
    flashlights: {
      none:{label:'ไม่ติดตั้ง',price:0},
      tactical:{label:'ไฟฉายยุทธวิธี',color:0xfff1c2,intensity:1.5,range:18,price:70},
      highPower:{label:'ไฟฉายกำลังสูง',color:0xffffff,intensity:2.5,range:28,price:110}
    },
    lasers: {
      none:{label:'ไม่ติดตั้ง',price:0},
      red:{label:'เลเซอร์สีแดง (-30% กระจายตอนยิงจากสะโพก)',hipSpread:0.7,color:0xff2020,price:80},
      green:{label:'เลเซอร์สีเขียว (-38% กระจายตอนยิงจากสะโพก)',hipSpread:0.62,color:0x22ff66,price:110}
    },
    ammunition: {
      standard:{label:'กระสุนมาตรฐาน',price:0,damage:1,armorPierce:0},
      hollowPoint:{label:'หัวกลวง (+20% ดาเมจ, เจาะเกราะลดลง, กระสุนตกไวขึ้น)',damage:1.2,armorPierce:-0.2,cdMul:1.15,recoil:1.03,price:130},
      armorPiercing:{label:'เจาะเกราะ (เจาะเกราะเพิ่มมาก, วิถีตรงขึ้น, +5% แรงดีด)',damage:0.94,armorPierce:0.5,cdMul:0.95,recoil:1.05,price:180}
    },
    magazinePrices:{25:40,30:40,35:50,50:70,60:100,90:160,100:200,150:250,200:300}
  };
})();