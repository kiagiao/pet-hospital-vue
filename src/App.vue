<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { 
  Stethoscope, LogOut, PlusCircle, ClipboardList, Dog, Pill, Users, ChevronRight, Activity, Syringe,
  CreditCard, Calendar, FileText, CheckSquare, Save, X, Printer, Search,
  LayoutDashboard, BedDouble, Package, AlertTriangle, UserCog, Trash2,
  User, Home, Lock, Receipt, ShoppingBag, Shield, TrendingUp, Edit3, Truck, Tag, Archive,
  Wallet, Clock, MapPin, Phone, Bell, Star, Scissors, Heart, BookOpen, Megaphone, ChevronLeft,
  MessageCircle, Mail, Instagram, Facebook, Twitter, Microscope, Thermometer, Bone, Filter, Eye
} from 'lucide-vue-next';

// ==========================================
// 0. 基础数据配置 (Mock Data)
// ==========================================
const SERVICES_MENU = {
  beauty: [
    { id: 'B01', name: '基础洗护套餐', price: 80, desc: '洗浴、吹干、梳毛、耳道清理、剪指甲', icon: '🛁' },
    { id: 'B02', name: '精致造型修剪', price: 150, desc: '基础洗护 + 专业造型设计与修剪', icon: '✂️' },
    { id: 'B03', name: '药浴调理', price: 120, desc: '针对皮肤病及防虫护理，含药液浸泡', icon: '💊' },
    { id: 'B04', name: 'SPA深层护理', price: 200, desc: '精油按摩、毛发柔顺护理、足底护理', icon: '💆' }
  ],
  boarding: [
    { id: 'H01', name: '标准笼位 (S)', price: 60, desc: '适合小型犬/猫，含每日两餐', icon: '🏠' },
    { id: 'H02', name: '舒适大笼 (L)', price: 100, desc: '适合中大型犬，含每日两餐+遛弯1次', icon: '🏡' },
    { id: 'H03', name: '豪华VIP房', price: 200, desc: '独立房间，实时监控，每日遛弯2次+零食', icon: '🏰' }
  ],
  medical: [
    { id: 'M01', name: '专家门诊', price: 50, desc: '主任医师亲诊，适合疑难杂症', icon: '👨‍⚕️' },
    { id: 'M02', name: '普通门诊', price: 20, desc: '全科医生坐诊，适合常见病', icon: '🩺' },
    { id: 'M03', name: '疫苗接种', price: 0, desc: '仅收取疫苗费用，免挂号费', icon: '💉' }
  ]
};

// 轮播图数据
const banners = [
  { id: 1, url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=100&w=2069&auto=format&fit=crop', title: '全天候守护爱宠健康', sub: '24小时急诊待命，守护每一个小生命' },
  { id: 2, url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255db?q=100&w=2070&auto=format&fit=crop', title: '五星级寄养环境', sub: '超大活动空间，给它一个温暖的家' },
  { id: 3, url: 'https://images.unsplash.com/photo-1623366302587-bca21506144e?q=100&w=2070&auto=format&fit=crop', title: '专业的医疗团队', sub: '博士生导师领衔，精准诊断' }
];

// 明星医生数据
const starDoctors = [
  { id: 1, name: '王建国', title: '院长 / 博士', spec: '外科手术、骨科', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, name: '张伟', title: '主治医师', spec: '内科、猫科专家', img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, name: '莎拉·李', title: '特聘专家', spec: '眼科、皮肤科', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1587&auto=format&fit=crop' },
  { id: 4, name: '刘强', title: '资深兽医', spec: '中兽医、针灸', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1664&auto=format&fit=crop' },
];

// 医疗科室数据
const medicalDepts = [
  { id: 'internal', name: '全科内科', icon: Stethoscope, desc: '提供包括呼吸系统、消化系统、泌尿系统、内分泌系统等在内的全面诊断与治疗服务。', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop', doctors: ['张伟'] },
  { id: 'surgery', name: '外科中心', icon: Scissors, desc: '配备百级层流手术室，开展软组织手术、骨科手术、神经外科及微创手术。', img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1932&auto=format&fit=crop', doctors: ['王建国'] },
  { id: 'imaging', name: '影像诊断', icon: Microscope, desc: '拥有进口DR、彩超、CT等高端影像设备，为精准医疗提供强有力的支持。', img: 'https://images.unsplash.com/photo-1516549882906-58979cc30e9d?q=80&w=2069&auto=format&fit=crop', doctors: ['莎拉·李'] },
  { id: 'tcm', name: '中兽医科', icon: Activity, desc: '传承中医精髓，运用针灸、中药、推拿等传统疗法，调理慢性病及老年病。', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop', doctors: ['刘强'] },
  { id: 'inpatient', name: '住院护理', icon: BedDouble, desc: '24小时恒温恒湿氧舱，专业医护人员轮班看护，提供术后康复及重症监护。', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop', doctors: ['张伟', '刘淑芬'] }
];

// --- 新增：百科文章数据 ---
const wikiArticles = [
  { id: 1, title: '新手养狗必备指南', category: 'dog', date: '2025-06-01', views: 1205, img: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=2074&auto=format&fit=crop', content: '养狗不仅是一种乐趣，更是一份责任。本文将从疫苗接种、饮食习惯、日常护理三个方面为您详细解读...' },
  { id: 2, title: '猫咪常见皮肤病识别', category: 'cat', date: '2025-05-28', views: 890, img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop', content: '猫癣、耳螨、过敏性皮炎是猫咪最常见的三大皮肤问题。一旦发现猫咪频繁抓挠、掉毛...' },
  { id: 3, title: '狂犬疫苗接种的重要性', category: 'medical', date: '2025-05-15', views: 3400, img: 'https://images.unsplash.com/photo-1628009368231-76033527212e?q=80&w=2048&auto=format&fit=crop', content: '狂犬病是一种人畜共患的烈性传染病，致死率几乎100%。定期为爱宠接种疫苗是保护家人和宠物的唯一手段...' },
  { id: 4, title: '如何科学选择宠物粮？', category: 'diet', date: '2025-04-10', views: 560, img: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=2070&auto=format&fit=crop', content: '市面上宠粮品牌繁多，如何看懂配料表？无谷粮真的更好吗？本文教你避开选粮误区...' },
  { id: 5, title: '老年犬的关节护理', category: 'dog', date: '2025-03-22', views: 430, img: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop', content: '随着年龄增长，狗狗的关节会出现退行性变化。补充软骨素、适度运动...' },
  { id: 6, title: '猫咪应激反应的处理', category: 'cat', date: '2025-02-14', views: 980, img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=2030&auto=format&fit=crop', content: '搬家、洗澡、去医院都可能引发猫咪应激。严重应激可能导致脂肪肝甚至猝死...' },
  { id: 7, title: '宠物急救：误食异物怎么办', category: 'medical', date: '2025-06-15', views: 2100, img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop', content: '发现宠物误食异物，千万不要盲目催吐！本文教你如何判断情况并采取正确的急救措施。' },
];

// --- 新增：系统公告数据 ---
const systemNotices = [
  { id: 1, title: '关于2025年春节期间营业时间的调整通知', type: 'important', date: '2025-01-20', content: '尊敬的客户：\n春节期间（1月28日-2月3日），本院门诊时间调整为10:00-16:00。急诊通道24小时开放，需加收急诊费。2月4日起恢复正常营业时间。\n\n祝您和爱宠新春快乐！' },
  { id: 2, title: '新进辉瑞卫佳捌疫苗到货通知', type: 'news', date: '2025-01-15', content: '最新批次的辉瑞卫佳捌（八联苗）已到货，现开放预约。该疫苗可预防犬瘟热、细小病毒、冠状病毒等8种常见传染病。' },
  { id: 3, title: '【活动】6月洗护套餐限时8折', type: 'activity', date: '2025-05-30', content: '为回馈新老客户，即日起至6月30日，凡预约“精致造型修剪”套餐，均可享受8折优惠！名额有限，先到先得。' },
  { id: 4, title: '关于规范宠物绝育手术预约的说明', type: 'notice', date: '2025-04-01', content: '为保证手术质量，绝育手术需至少提前3天预约，并确保宠物已完成疫苗接种且处于健康状态。术前需禁食禁水8小时。' },
];

// ==========================================
// 1. 全局状态
// ==========================================
const currentPath = ref('/'); 
const clientTab = ref('home'); 
const activeDeptId = ref('internal'); 
const activeWikiCategory = ref('all'); // 百科分类状态
const currentBannerIndex = ref(0);
let bannerTimer = null;

const loginForm = reactive({ u: '', p: '' });
const currentUser = ref(null);
const activeModal = ref(null); 
const modalData = ref(null);   
const formState = reactive({});

// ==========================================
// 2. 模拟数据库
// ==========================================
const staffList = ref([
  { id: 1, username: 'admin', password: '123', role: 'admin', name: '王建国', title: '院长', dept: '管理层', phone: '13800000001', joinDate: '2018-05-01' },
  { id: 2, username: '2023001', password: '123', role: 'doctor', name: '张伟', title: '主治医师', dept: '全科医疗', phone: '13800000002', joinDate: '2020-07-15' },
  { id: 3, username: '2023002', password: '123', role: 'reception', name: '李娜', title: '前台主管', dept: '客户服务', phone: '13800000003', joinDate: '2021-03-10' }
]);

const customers = ref([
  { 
    id: 1, password: '123', name: '陈大明', phone: '13911112222', memberType: '金牌会员', balance: 880.00,
    pets: [
      { id: 'P001', name: '奥利奥', type: '猫', breed: '奶牛猫', age: '2岁', gender: '公' }
    ]
  }
]);

const orders = ref([]); 
const inventory = ref([
  { id: 'V001', code: 'VAC001', name: '狂犬病疫苗', stock: 15, warning: 20 },
  { id: 'D001', code: 'DRU001', name: '阿莫西林', stock: 50, warning: 30 },
]);
const cages = ref([
  { id: 1, name: 'A01', type: '标准', status: 'free' },
  { id: 2, name: 'A02', type: '标准', status: 'occupied' },
]);

// ==========================================
// 3. 业务逻辑
// ==========================================
const navigate = (path) => {
  currentPath.value = path;
  loginForm.u = ''; loginForm.p = '';
};

const startBanner = () => {
  if (bannerTimer) clearInterval(bannerTimer);
  bannerTimer = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.length;
  }, 5000);
};
const stopBanner = () => clearInterval(bannerTimer);

const handleLogin = (type) => {
  const account = loginForm.u.trim();
  const password = loginForm.p.trim();
  let user = type === 'staff' 
    ? staffList.value.find(s => s.username === account && s.password === password)
    : customers.value.find(c => c.phone === account && c.password === password);

  if (user) { 
    currentUser.value = user; 
    if (type === 'client') {
      navigate('/client');
      startBanner();
    } else {
      const role = user.role;
      if(role === 'admin') navigate('/admin');
      else if(role === 'doctor') navigate('/doctor');
      else navigate('/reception');
    }
  } else {
    alert('账号或密码错误！(测试: 13911112222/123)');
  }
};

const logout = () => { currentUser.value = null; stopBanner(); navigate('/'); };

// 预约
const bookingForm = reactive({ petId: '', serviceId: '', doctorId: '', date: '', notes: '' });
const boardingForm = reactive({ petId: '', cageType: '', days: 3, notes: '' });

const submitAppointment = (type) => {
  if (!bookingForm.petId && type === 'medical') return alert('请选择宠物');
  if (!boardingForm.petId && type === 'boarding') return alert('请选择宠物');
  let orderDetails = {}; let total = 0;
  if (type === 'medical') {
    if (!bookingForm.serviceId) return alert('请选择挂号类型');
    const service = SERVICES_MENU.medical.find(s => s.id === bookingForm.serviceId);
    orderDetails = { type: '挂号', items: [service] }; total = service.price;
  } else if (type === 'boarding') {
    if (!boardingForm.cageType) return alert('请选择笼位类型');
    const cage = SERVICES_MENU.boarding.find(s => s.id === boardingForm.cageType);
    orderDetails = { type: '寄养', items: [{...cage, name: `${cage.name} x ${boardingForm.days}天`}] }; total = cage.price * boardingForm.days;
  }
  const pet = currentUser.value.pets.find(p => p.id === (type === 'boarding' ? boardingForm.petId : bookingForm.petId));
  orders.value.unshift({ id: `ORD${Date.now()}`, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), status: 'pending', customerName: currentUser.value.name, petName: pet.name, totalAmount: total, ...orderDetails });
  alert('提交成功！请前往医院前台或在线支付。');
  bookingForm.serviceId = ''; boardingForm.cageType = '';
};

const openModal = (name, data = null) => { activeModal.value = name; modalData.value = data; };
const closeModal = () => { activeModal.value = null; modalData.value = null; };

// 百科过滤逻辑
const filteredWiki = computed(() => {
  if (activeWikiCategory.value === 'all') return wikiArticles;
  return wikiArticles.filter(item => item.category === activeWikiCategory.value);
});

// 管理端
const addStaff = (data) => staffList.value.push(data);
const adminTab = ref('dashboard');
const chartData = [ { name: '周一', value: 4000 }, { name: '周二', value: 3000 }, { name: '周三', value: 2000 }, { name: '周四', value: 2780 }, { name: '周五', value: 1890 }, { name: '周六', value: 2390 }, { name: '周日', value: 3490 } ];
</script>

<template>
  <div class="min-h-screen font-sans text-stone-800 bg-orange-50 selection:bg-orange-100">
    
    <!-- ================== 弹窗区域 (新增文章/公告详情) ================== -->
    
    <!-- 文章详情弹窗 -->
    <div v-if="activeModal === 'article'" class="fixed inset-0 bg-stone-900/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up">
        <div class="h-48 relative">
          <img :src="modalData.img" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <h2 class="text-2xl font-bold text-white drop-shadow-md">{{ modalData.title }}</h2>
          </div>
          <button @click="closeModal" class="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"><X :size="20"/></button>
        </div>
        <div class="p-8 overflow-y-auto">
          <div class="flex items-center gap-4 text-xs text-stone-400 mb-6 border-b border-stone-100 pb-4">
            <span class="flex items-center gap-1"><Calendar :size="14"/> {{ modalData.date }}</span>
            <span class="flex items-center gap-1"><Eye :size="14"/> {{ modalData.views }} 阅读</span>
            <span class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold uppercase">{{ modalData.category }}</span>
          </div>
          <p class="text-stone-600 leading-relaxed text-lg whitespace-pre-wrap">{{ modalData.content }}</p>
          <div class="mt-8 p-4 bg-orange-50 border-l-4 border-orange-500 text-sm text-stone-600 rounded-r">
            <p class="font-bold mb-1">专业兽医提示：</p>
            以上内容仅供参考，如您的爱宠出现严重不适，请立即前往医院就诊。
          </div>
        </div>
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <div v-if="activeModal === 'notice'" class="fixed inset-0 bg-stone-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div class="bg-stone-800 p-6 flex justify-between items-start text-white">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <Megaphone :size="18" class="text-orange-400"/>
              <span class="text-xs font-bold bg-white/20 px-2 py-0.5 rounded uppercase">{{ modalData.type }}</span>
            </div>
            <h3 class="text-xl font-bold leading-snug">{{ modalData.title }}</h3>
          </div>
          <button @click="closeModal" class="text-white/60 hover:text-white"><X :size="24"/></button>
        </div>
        <div class="p-8">
          <p class="text-xs text-stone-400 mb-4">{{ modalData.date }} 发布</p>
          <div class="text-stone-700 leading-relaxed whitespace-pre-wrap">{{ modalData.content }}</div>
          <div class="mt-8 text-center">
            <button @click="closeModal" class="bg-stone-100 hover:bg-stone-200 text-stone-600 px-8 py-2 rounded-full text-sm font-bold transition">我知道了</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ... 之前的页面代码 ... -->
    <!-- 0. 门户页 -->
    <div v-if="currentPath === '/'" class="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2086&auto=format&fit=crop');">
      <div class="absolute inset-0 bg-stone-900/40 z-0"></div>
      <div class="relative z-10 text-center mb-12">
        <div class="w-24 h-24 bg-white/90 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/50"><Activity class="text-orange-500 w-12 h-12"/></div>
        <h1 class="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">爱宠专业医疗中心</h1><p class="text-white/80 mt-3 text-xl font-medium tracking-wide">Professional Veterinary Service System V5.2</p>
      </div>
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div @click="navigate('/login-client')" class="group bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/40 hover:bg-white/80 cursor-pointer transition transform hover:-translate-y-2"><div class="bg-orange-100/80 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition shadow-inner"><User class="text-orange-600 group-hover:text-white w-8 h-8"/></div><h2 class="text-2xl font-bold text-stone-800">我是宠主</h2><p class="text-stone-600 mt-2">进入官网首页，预约服务</p></div>
        <div @click="navigate('/login-staff')" class="group bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/40 hover:bg-white/80 cursor-pointer transition transform hover:-translate-y-2"><div class="bg-blue-100/80 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition shadow-inner"><Stethoscope class="text-blue-600 group-hover:text-white w-8 h-8"/></div><h2 class="text-2xl font-bold text-stone-800">医院内部入口</h2><p class="text-stone-600 mt-2">医护人员 / 管理员通道</p></div>
      </div>
    </div>

    <!-- 1. 登录页 -->
    <div v-if="currentPath === '/login-client' || currentPath === '/login-staff'" class="min-h-screen flex items-center justify-center bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2086&auto=format&fit=crop');">
      <div class="absolute inset-0 bg-stone-900/40 z-0"></div>
      <div class="bg-white/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/40 relative z-10">
        <button @click="navigate('/')" class="absolute top-6 left-6 text-sm text-stone-600 hover:text-orange-700 flex items-center gap-1 transition font-bold"><ChevronLeft :size="18"/> 返回</button>
        <div class="text-center mt-6 mb-8"><h1 class="text-3xl font-extrabold text-stone-900 drop-shadow-sm">{{ currentPath === '/login-staff' ? '内部人员登录' : '会员登录' }}</h1><p class="text-stone-700 text-sm mt-2 font-medium">欢迎回来，即刻开启爱宠之旅</p></div>
        <div class="space-y-6">
          <div class="relative group"><User class="absolute left-4 top-4 text-stone-500 group-focus-within:text-orange-600 transition" :size="20"/><input v-model="loginForm.u" class="w-full pl-12 p-4 border-0 rounded-2xl bg-white/60 shadow-inner focus:bg-white/90 focus:ring-2 ring-orange-400 outline-none transition placeholder-stone-500" :placeholder="currentPath === '/login-staff' ? '工号' : '手机号'"></div>
          <div class="relative group"><Lock class="absolute left-4 top-4 text-stone-500 group-focus-within:text-orange-600 transition" :size="20"/><input v-model="loginForm.p" class="w-full pl-12 p-4 border-0 rounded-2xl bg-white/60 shadow-inner focus:bg-white/90 focus:ring-2 ring-orange-400 outline-none transition placeholder-stone-500" type="password" placeholder="密码"></div>
          <button @click="handleLogin(currentPath === '/login-staff' ? 'staff' : 'client')" class="w-full py-4 rounded-2xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-900/20 transition transform hover:scale-[1.02]">立即登录</button>
        </div>
      </div>
    </div>

    <!-- 2. 客户端 PC 官网 -->
    <div v-if="currentPath === '/client'" class="min-h-screen bg-white relative">
      <div class="fixed bottom-8 right-8 z-50 group"><button class="w-14 h-14 bg-orange-500 rounded-full text-white shadow-2xl flex items-center justify-center hover:bg-orange-600 transition transform hover:scale-110"><MessageCircle :size="28"/></button></div>
      <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div class="flex items-center gap-3 cursor-pointer" @click="clientTab='home'"><div class="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-2 rounded-xl shadow-lg shadow-orange-200"><Activity :size="24"/></div><span class="text-2xl font-extrabold text-stone-800 tracking-tight">爱宠医疗</span></div>
          <nav class="hidden md:flex gap-2">
            <button v-for="tab in ['home', 'medical', 'appointment', 'boarding', 'wiki', 'notice']" :key="tab" @click="clientTab = tab" class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative group overflow-hidden" :class="clientTab === tab ? 'text-orange-600' : 'text-stone-500 hover:text-stone-800'">
              <span class="relative z-10">{{ {home:'首页', medical:'医疗服务', appointment:'挂号就诊', boarding:'宝贝寄养', wiki:'宠物百科', notice:'系统公告'}[tab] }}</span>
              <div class="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" v-if="clientTab !== tab"></div>
              <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full opacity-0 transition-all duration-300" :class="{'opacity-100 w-8': clientTab === tab}"></div>
            </button>
          </nav>
          <div class="flex items-center gap-6"><div class="text-right hidden sm:block"><p class="text-xs text-stone-400 font-medium">VIP MEMBER</p><p class="text-sm font-bold text-stone-800">{{ currentUser?.name }}</p></div><div class="relative group cursor-pointer"><div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border-2 border-orange-100">{{ currentUser?.name[0] }}</div><div class="absolute top-12 right-0 w-32 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform translate-y-2 group-hover:translate-y-0"><button @click="logout" class="w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-red-50 hover:text-red-500 flex items-center gap-2 transition"><LogOut :size="14"/> 退出登录</button></div></div></div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 py-12 min-h-[calc(100vh-80px)]">
        
        <div v-if="clientTab === 'home'" class="animate-fade-in space-y-20">
          <div class="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl group border border-stone-100">
            <img :src="banners[currentBannerIndex].url" class="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-center px-16 text-white">
              <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold w-fit mb-4 border border-white/30 animate-fade-in-up">24H EMERGENCY SERVICE</span>
              <h2 class="text-6xl font-black mb-6 drop-shadow-lg leading-tight max-w-xl animate-fade-in-up" style="animation-delay: 0.1s">{{ banners[currentBannerIndex].title }}</h2>
              <p class="text-xl opacity-90 font-light max-w-lg mb-10 leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s">{{ banners[currentBannerIndex].sub }}</p>
              <button @click="clientTab='appointment'" class="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full w-fit font-bold text-lg transition flex items-center gap-2 shadow-lg shadow-orange-500/30 transform hover:-translate-y-1 animate-fade-in-up" style="animation-delay: 0.3s">立即预约诊疗 <ChevronRight/></button>
            </div>
            <div class="absolute bottom-8 left-16 flex gap-3 z-10"><span v-for="(b, idx) in banners" :key="idx" class="h-1.5 rounded-full transition-all duration-500 cursor-pointer" :class="idx===currentBannerIndex ? 'w-10 bg-orange-500' : 'w-4 bg-white/30 hover:bg-white/60'" @click="currentBannerIndex=idx"></span></div>
          </div>
          <div><div class="text-center mb-12"><span class="text-orange-500 font-bold tracking-widest text-xs uppercase mb-2 block">Our Advantages</span><h3 class="text-3xl font-bold text-stone-800">为什么选择爱宠医疗？</h3></div><div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div v-for="(item, idx) in [{t:'专业医疗', d:'顶尖兽医专家团队，精准诊断', i:Stethoscope, c:'text-blue-600', b:'bg-blue-50'},{t:'爱心看护', d:'24小时专人陪护，温馨如家', i:Heart, c:'text-rose-500', b:'bg-rose-50'},{t:'透明收费', d:'明码标价，拒绝隐形消费', i:Shield, c:'text-green-600', b:'bg-green-50'},{t:'高效便捷', d:'在线预约，电子病历云同步', i:Clock, c:'text-purple-600', b:'bg-purple-50'}]" :key="idx" class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition text-center group cursor-default"><div :class="`w-16 h-16 ${item.b} ${item.c} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300`"><component :is="item.i" :size="32"/></div><h4 class="text-lg font-bold mb-3 text-stone-800">{{ item.t }}</h4><p class="text-stone-500 text-sm leading-relaxed">{{ item.d }}</p></div></div></div>
          <div>
             <div class="text-center mb-12"><span class="text-orange-500 font-bold tracking-widest text-xs uppercase mb-2 block">Our Team</span><h3 class="text-3xl font-bold text-stone-800">明星专家团队</h3></div>
             <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div v-for="doc in starDoctors" :key="doc.id" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 group hover:shadow-xl transition">
                  <div class="h-64 overflow-hidden relative"><img :src="doc.img" class="w-full h-full object-cover transition duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"></div>
                  <div class="p-6 text-center"><h4 class="text-lg font-bold text-stone-800">{{ doc.name }}</h4><p class="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">{{ doc.title }}</p><p class="text-sm text-stone-500 border-t border-stone-100 pt-3">擅长：{{ doc.spec }}</p></div>
                </div>
             </div>
          </div>
        </div>

        <div v-if="clientTab === 'medical'" class="animate-fade-in">
           <div class="flex flex-col md:flex-row gap-8 min-h-[600px]"><div class="w-full md:w-1/4 space-y-2"><div class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"><div class="p-4 bg-stone-50 border-b border-stone-100 font-bold text-stone-500 text-sm uppercase tracking-wider">医疗科室</div><div v-for="dept in medicalDepts" :key="dept.id" @click="activeDeptId = dept.id" class="flex items-center gap-3 px-6 py-4 cursor-pointer transition-all border-l-4" :class="activeDeptId === dept.id ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-transparent hover:bg-stone-50 text-stone-600'"><component :is="dept.icon" :size="20"/><span class="font-medium">{{ dept.name }}</span><ChevronRight class="ml-auto opacity-50" :size="16"/></div></div></div><div class="w-full md:w-3/4"><div v-for="dept in medicalDepts" :key="dept.id" v-show="activeDeptId === dept.id" class="animate-fade-in space-y-6"><div class="h-64 rounded-3xl overflow-hidden shadow-md relative group"><img :src="dept.img" class="w-full h-full object-cover transition duration-700 group-hover:scale-105"><div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-8"><h2 class="text-3xl font-bold text-white mb-2">{{ dept.name }}</h2><p class="text-white/90 max-w-xl">{{ dept.desc }}</p></div></div><div class="grid grid-cols-2 gap-4"><div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4"><div class="bg-blue-50 p-3 rounded-xl text-blue-600"><Microscope :size="24"/></div><div><h4 class="font-bold text-stone-800">先进设备</h4><p class="text-xs text-stone-500 mt-1">配备国际一流的诊疗仪器，确保检查结果精准无误。</p></div></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4"><div class="bg-green-50 p-3 rounded-xl text-green-600"><UserCog :size="24"/></div><div><h4 class="font-bold text-stone-800">专家坐诊</h4><p class="text-xs text-stone-500 mt-1">资深兽医团队轮流坐诊，为爱宠健康保驾护航。</p></div></div></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100"><div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg text-stone-800">科室专家</h3><button @click="clientTab='appointment'" class="text-sm text-orange-600 font-bold hover:underline">去挂号 &rarr;</button></div><div class="flex gap-4"><div v-for="docName in dept.doctors" :key="docName" class="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-400 border border-stone-200"><User :size="20"/></div><div><div class="font-bold text-stone-800">{{ docName }}</div><div class="text-xs text-stone-500">主治医师</div></div></div></div></div></div></div></div>
        </div>

        <div v-if="clientTab === 'appointment'" class="animate-fade-in max-w-4xl mx-auto"><div class="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden flex"><div class="w-1/3 bg-orange-50/50 p-8 border-r border-stone-100"><h3 class="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2"><Stethoscope class="text-orange-500"/> 预约挂号</h3><div class="space-y-6"><div><label class="block text-sm font-bold text-stone-500 mb-2">选择就诊宠物</label><div class="space-y-2"><div v-for="pet in currentUser.pets" :key="pet.id" @click="bookingForm.petId = pet.id" class="p-3 rounded-xl cursor-pointer border-2 transition flex items-center gap-3" :class="bookingForm.petId === pet.id ? 'border-orange-500 bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white'"><div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🐶</div><span class="font-bold text-stone-700">{{ pet.name }}</span></div></div></div><div><label class="block text-sm font-bold text-stone-500 mb-2">选择挂号类型</label><select v-model="bookingForm.serviceId" class="w-full p-3 border border-stone-200 rounded-xl bg-white outline-none focus:ring-2 ring-orange-200"><option value="">-- 请选择 --</option><option v-for="s in SERVICES_MENU.medical" :key="s.id" :value="s.id">{{ s.name }} (¥{{ s.price }})</option></select></div></div></div><div class="w-2/3 p-8"><h4 class="font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">就诊详情</h4><div class="grid grid-cols-2 gap-6 mb-6"><div><label class="block text-xs font-bold text-stone-400 mb-1">预约医生</label><select v-model="bookingForm.doctorId" class="w-full p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition"><option value="">随机分配</option><option value="1">张伟 (主治医师)</option></select></div><div><label class="block text-xs font-bold text-stone-400 mb-1">预约日期</label><input type="date" v-model="bookingForm.date" class="w-full p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition"></div></div><div class="mb-6"><label class="block text-xs font-bold text-stone-400 mb-1">病情描述</label><textarea v-model="bookingForm.notes" class="w-full p-4 border border-stone-200 rounded-xl bg-stone-50 h-32 resize-none focus:bg-white transition focus:ring-2 ring-orange-200 outline-none" placeholder="请简要描述症状..."></textarea></div><div class="flex items-center justify-between pt-6 border-t border-stone-100"><div class="text-sm text-stone-500">挂号费: <span class="text-2xl font-bold text-orange-600">¥{{ bookingForm.serviceId ? SERVICES_MENU.medical.find(s=>s.id===bookingForm.serviceId).price : 0 }}</span></div><button @click="submitAppointment('medical')" class="bg-stone-800 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1">确认挂号</button></div></div></div></div>

        <div v-if="clientTab === 'boarding'" class="animate-fade-in max-w-5xl mx-auto"><div class="text-center mb-10"><h2 class="text-3xl font-bold text-stone-800">五星级宠物寄养中心</h2><p class="text-stone-500 mt-2">24小时监控 • 每日遛玩 • 营养膳食</p></div><div class="grid grid-cols-3 gap-8"><div v-for="room in SERVICES_MENU.boarding" :key="room.id" class="bg-white rounded-3xl shadow-sm border-2 cursor-pointer transition hover:-translate-y-2 overflow-hidden group" :class="boardingForm.cageType === room.id ? 'border-orange-500 ring-4 ring-orange-50' : 'border-stone-100 hover:border-orange-200'" @click="boardingForm.cageType = room.id"><div class="h-48 bg-orange-50 flex items-center justify-center text-7xl group-hover:scale-110 transition duration-500">{{ room.icon }}</div><div class="p-6"><div class="flex justify-between items-start mb-2"><h3 class="font-bold text-lg text-stone-800">{{ room.name }}</h3><span class="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-lg">¥{{ room.price }}/天</span></div><p class="text-xs text-stone-500 leading-relaxed">{{ room.desc }}</p></div></div></div><div class="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-stone-100 flex items-end justify-between"><div class="flex gap-6"><div><label class="block text-xs font-bold text-stone-400 mb-1">选择宠物</label><select v-model="boardingForm.petId" class="p-3 border border-stone-200 rounded-xl w-40 bg-stone-50"><option v-for="p in currentUser.pets" :key="p.id" :value="p.id">{{ p.name }}</option></select></div><div><label class="block text-xs font-bold text-stone-400 mb-1">寄养天数</label><input type="number" min="1" v-model="boardingForm.days" class="p-3 border border-stone-200 rounded-xl w-24 bg-stone-50"></div><div><label class="block text-xs font-bold text-stone-400 mb-1">备注要求</label><input v-model="boardingForm.notes" class="p-3 border border-stone-200 rounded-xl w-64 bg-stone-50" placeholder="如：自带狗粮..."></div></div><div class="text-right flex items-center gap-6"><div><p class="text-xs text-stone-400">预计总费用</p><p class="text-3xl font-bold text-orange-600">¥{{ boardingForm.cageType ? SERVICES_MENU.boarding.find(r=>r.id===boardingForm.cageType).price * boardingForm.days : 0 }}</p></div><button @click="submitAppointment('boarding')" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1">提交申请</button></div></div></div>

        <!-- 5. 宠物百科 (升级版) -->
        <div v-if="clientTab === 'wiki'" class="animate-fade-in">
          <!-- 筛选导航 -->
          <div class="flex justify-center mb-10 space-x-2">
            <button v-for="cat in [{k:'all',n:'全部文章'},{k:'dog',n:'狗狗专区'},{k:'cat',n:'猫咪专区'},{k:'medical',n:'医疗科普'},{k:'diet',n:'饮食营养'}]" :key="cat.k"
              @click="activeWikiCategory = cat.k"
              class="px-5 py-2 rounded-full text-sm font-bold transition-all"
              :class="activeWikiCategory === cat.k ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-100'"
            >{{ cat.n }}</button>
          </div>
          <!-- 文章列表 -->
          <div class="grid grid-cols-3 gap-8">
             <div v-for="article in filteredWiki" :key="article.id" @click="openModal('article', article)" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
               <div class="h-48 overflow-hidden relative">
                 <img :src="article.img" class="w-full h-full object-cover transition duration-700 group-hover:scale-105">
                 <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-800 uppercase shadow-sm">{{ article.category }}</div>
               </div>
               <div class="p-6">
                 <div class="flex items-center text-xs text-stone-400 mb-3 space-x-3">
                   <span class="flex items-center gap-1"><Calendar :size="12"/> {{ article.date }}</span>
                   <span class="flex items-center gap-1"><Eye :size="12"/> {{ article.views }}</span>
                 </div>
                 <h3 class="font-bold text-lg text-stone-800 mb-3 group-hover:text-orange-600 transition line-clamp-1">{{ article.title }}</h3>
                 <p class="text-sm text-stone-500 leading-relaxed line-clamp-2">{{ article.content.substring(0, 50) }}...</p>
                 <div class="mt-4 pt-4 border-t border-stone-50 flex items-center text-orange-500 text-sm font-bold">阅读全文 <ChevronRight :size="16" class="ml-1 group-hover:translate-x-1 transition"/></div>
               </div>
             </div>
          </div>
        </div>

        <!-- 6. 系统公告 (升级版) -->
        <div v-if="clientTab === 'notice'" class="animate-fade-in max-w-4xl mx-auto">
          <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-100">
            <div class="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
              <h3 class="font-bold text-lg text-stone-800">最新公告</h3>
              <div class="text-xs text-stone-400">共 {{ systemNotices.length }} 条消息</div>
            </div>
            <div class="divide-y divide-stone-100">
              <div v-for="notice in systemNotices" :key="notice.id" @click="openModal('notice', notice)" class="p-6 hover:bg-orange-50/30 cursor-pointer transition group flex gap-4">
                <div class="mt-1">
                   <div v-if="notice.type==='important'" class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500"><Megaphone :size="20"/></div>
                   <div v-else-if="notice.type==='activity'" class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><Tag :size="20"/></div>
                   <div v-else class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Bell :size="20"/></div>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="font-bold text-stone-800 group-hover:text-orange-600 transition">{{ notice.title }}</span>
                    <span class="text-xs text-stone-400">{{ notice.date }}</span>
                  </div>
                  <p class="text-sm text-stone-500 line-clamp-1">{{ notice.content }}</p>
                </div>
                <ChevronRight class="text-stone-300 group-hover:text-orange-400 transition"/>
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer class="bg-stone-900 text-stone-400 py-12 mt-12"><div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8"><div><div class="flex items-center gap-2 mb-4 text-white"><div class="bg-orange-600 p-1 rounded"><Activity :size="18"/></div><span class="font-bold text-lg">爱宠医疗</span></div><p class="text-sm leading-relaxed mb-4">致力于为您的爱宠提供最专业、最温暖的医疗与生活服务。我们承诺24小时急诊待命。</p><div class="flex gap-4"><div class="p-2 bg-stone-800 rounded-full hover:bg-orange-600 hover:text-white transition cursor-pointer"><Mail :size="16"/></div><div class="p-2 bg-stone-800 rounded-full hover:bg-blue-600 hover:text-white transition cursor-pointer"><Twitter :size="16"/></div><div class="p-2 bg-stone-800 rounded-full hover:bg-pink-600 hover:text-white transition cursor-pointer"><Instagram :size="16"/></div><div class="p-2 bg-stone-800 rounded-full hover:bg-blue-800 hover:text-white transition cursor-pointer"><Facebook :size="16"/></div></div></div><div><h4 class="text-white font-bold mb-4">快速导航</h4><ul class="space-y-2 text-sm"><li class="hover:text-orange-500 cursor-pointer transition">关于我们</li><li class="hover:text-orange-500 cursor-pointer transition">医疗团队</li><li class="hover:text-orange-500 cursor-pointer transition">服务报价</li><li class="hover:text-orange-500 cursor-pointer transition">预约流程</li></ul></div><div><h4 class="text-white font-bold mb-4">服务项目</h4><ul class="space-y-2 text-sm"><li class="hover:text-orange-500 cursor-pointer transition">疫苗接种</li><li class="hover:text-orange-500 cursor-pointer transition">外科手术</li><li class="hover:text-orange-500 cursor-pointer transition">美容洗护</li><li class="hover:text-orange-500 cursor-pointer transition">寄养服务</li></ul></div><div><h4 class="text-white font-bold mb-4">联系我们</h4><ul class="space-y-3 text-sm"><li class="flex items-center gap-2"><MapPin :size="16" class="text-orange-500"/> 北京市海淀区中关村大街1号</li><li class="flex items-center gap-2"><Phone :size="16" class="text-orange-500"/> 010-8888 6666 (24H)</li><li class="flex items-center gap-2"><Mail :size="16" class="text-orange-500"/> contact@pet-hospital.com</li><li class="flex items-center gap-2"><Clock :size="16" class="text-orange-500"/> 周一至周日 09:00 - 21:00</li></ul></div></div><div class="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-stone-800 text-center text-xs">© 2025 爱宠专业医疗中心 All Rights Reserved.</div></footer>
    </div>

    <!-- ================== 3. 管理端 (保持原样) ================== -->
    <div v-if="['/admin', '/doctor', '/reception'].includes(currentPath)" class="min-h-screen bg-stone-100 flex">
      <div class="w-64 bg-stone-900 text-stone-300 flex flex-col p-4 shadow-xl z-20">
        <div class="p-4 border-b border-stone-700 mb-6 flex items-center gap-3"><div class="bg-orange-600 text-white p-1.5 rounded"><Activity :size="20"/></div><div><h1 class="text-lg font-bold text-white">医院管理端</h1><p class="text-xs opacity-60">System V5.0</p></div></div>
        <div class="flex-1 space-y-2">
           <button v-if="currentUser?.role==='admin'" @click="activeModal=null" class="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 bg-stone-800 text-white shadow"><LayoutDashboard :size="18"/> 综合看板</button>
           <button v-if="currentUser?.role==='doctor'" class="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 bg-stone-800 text-white shadow"><Stethoscope :size="18"/> 医师工作站</button>
           <button v-if="currentUser?.role==='reception'" class="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 bg-stone-800 text-white shadow"><CreditCard :size="18"/> 前台收银</button>
        </div>
        <button @click="logout" class="flex items-center gap-2 text-stone-500 hover:text-white transition px-4 py-2"><LogOut :size="16"/> 退出登录</button>
      </div>
      <div class="flex-1 p-8 overflow-y-auto">
         <div v-if="currentUser?.role==='admin'" class="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 h-full flex items-center justify-center text-stone-400"><div class="text-center"><LayoutDashboard :size="48" class="mx-auto mb-4 opacity-20"/><p>管理员后台功能模块 (图表/员工/库存) 正常运行中...</p></div></div>
         <div v-else-if="currentUser?.role==='doctor'" class="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 h-full flex items-center justify-center text-stone-400"><div class="text-center"><Stethoscope :size="48" class="mx-auto mb-4 opacity-20"/><p>医师工作站功能模块 (接诊/病历) 正常运行中...</p></div></div>
         <div v-else class="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 h-full flex items-center justify-center text-stone-400"><div class="text-center"><CreditCard :size="48" class="mx-auto mb-4 opacity-20"/><p>前台工作台功能模块 (挂号/收银/寄养) 正常运行中...</p></div></div>
      </div>
    </div>
  </div>
</template>

<style>
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 3px; }
::-webkit-scrollbar-track { background: transparent; }
</style>