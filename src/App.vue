<script setup>
import { ref, reactive } from 'vue';
import { 
  Stethoscope, LogOut, PlusCircle, ClipboardList, Dog, Pill, Users, ChevronRight, Activity, Syringe,
  CreditCard, Calendar, FileText, CheckSquare, Save, X, Printer, Search,
  LayoutDashboard, BedDouble, Package, AlertTriangle, UserCog, Trash2,
  User, Home, Lock, Receipt, ShoppingBag, Shield, TrendingUp, Edit3, Truck, Tag, Archive
} from 'lucide-vue-next';

// 基础数据
const SERVICES_MENU = {
  beauty: [
    { id: 'B01', name: '基础洗护', price: 80, desc: '洗浴、吹干、梳毛、剪指甲' },
    { id: 'B02', name: '精致造型', price: 150, desc: '基础洗护 + 造型设计' },
    { id: 'B03', name: '药浴调理', price: 120, desc: '针对皮肤病及防虫' },
    { id: 'B04', name: 'SPA护理', price: 200, desc: '精油按摩、毛发柔顺' }
  ],
  boarding: [
    { id: 'H01', name: '标准笼 (S)', price: 60, desc: '小型犬/猫，含两餐' },
    { id: 'H02', name: '舒适笼 (L)', price: 100, desc: '中大型犬，含两餐+遛弯' },
    { id: 'H03', name: '豪华VIP', price: 200, desc: '独立房，实时监控，遛弯2次' }
  ]
};

// 全局状态
const currentPath = ref('/');
const pathParams = ref({}); 
const adminTab = ref('dashboard');

const navigate = (path, params = {}) => {
  currentPath.value = path;
  pathParams.value = params;
  loginForm.u = '';
  loginForm.p = '';
};

const loginForm = reactive({ u: '', p: '' });
const currentUser = ref(null);
const activeModal = ref(null); 
const modalData = ref(null);   
const formState = reactive({});

// 模拟数据库
const staffList = ref([
  { id: 1, username: 'admin', password: '123', role: 'admin', name: '王建国', title: '院长', dept: '管理层', phone: '13800000001', joinDate: '2018-05-01', salary: 25000, gender: '男' },
  { id: 2, username: '2023001', password: '123', role: 'doctor', name: '张伟', title: '主治医师', dept: '全科医疗', phone: '13800000002', joinDate: '2020-07-15', salary: 18000, gender: '男' },
  { id: 3, username: '2023002', password: '123', role: 'reception', name: '李娜', title: '前台主管', dept: '客户服务', phone: '13800000003', joinDate: '2021-03-10', salary: 8000, gender: '女' }
]);

const customers = ref([
  { 
    id: 1, password: '123', name: '陈大明', phone: '13911112222', idCard: '1101011988XXXX', address: '幸福小区1号', memberType: '金牌会员', balance: 880.00, regTime: '2023-05-01',
    pets: [
      { id: 'P001', name: '奥利奥', type: '猫', breed: '奶牛猫', age: '2岁', gender: '公', birthday: '2021-06-01', vaccineHistory: '猫三联(24.06)', sterilized: '是', allergies: '海鲜' },
      { id: 'P002', name: '大黄', type: '狗', breed: '田园犬', age: '3岁', gender: '公', birthday: '2020-03-15', vaccineHistory: '狂犬(24.03)', sterilized: '否', allergies: '无' }
    ]
  },
  { 
    id: 2, password: '123', name: '刘淑芬', phone: '13900139000', idCard: '3201021990XXXX', address: '阳光花园3-201', memberType: '普通会员', balance: 0.00, regTime: '2024-01-15',
    pets: [{ id: 'P003', name: '雪球', type: '猫', breed: '英短', age: '1岁', gender: '母', birthday: '2023-02-01', vaccineHistory: '无', sterilized: '否', allergies: '无' }]
  }
]);

const orders = ref([]); 
const inventory = ref([
  { id: 'V001', code: 'VAC001', name: '狂犬病疫苗', type: '疫苗', stock: 15, warning: 20, validity: '2025-12-31', price: 80, supplier: '辉瑞', batch: 'PF202309' },
  { id: 'V002', code: 'VAC002', name: '犬瘟热疫苗', type: '疫苗', stock: 2, warning: 10, validity: '2025-06-30', price: 120, supplier: '硕腾', batch: 'ZT202301' },
  { id: 'D001', code: 'DRU001', name: '阿莫西林', type: '药品', stock: 50, warning: 30, validity: '2026-01-01', price: 35, supplier: '白云山', batch: 'BY202311' },
]);
const cages = ref([
  { id: 1, name: 'A01', type: '标准', status: 'free', cleanStatus: 'clean', note: '' },
  { id: 2, name: 'A02', type: '标准', status: 'occupied', cleanStatus: 'clean', pet: '雪球', owner: '刘淑芬', inTime: '2025-06-01' },
  { id: 3, name: 'B01', type: '豪华', status: 'dirty', cleanStatus: 'dirty', note: '待清理' },
  { id: 4, name: 'B02', type: '豪华', status: 'maintenance', cleanStatus: 'clean', note: '门锁维修' },
]);

// 业务逻辑
const initForm = (initial = {}) => {
  Object.keys(formState).forEach(key => delete formState[key]);
  Object.assign(formState, initial);
};

const bookingStep = ref(1);
const bookingData = reactive({ petId: '', type: 'beauty', items: [], tempCustomer: null });
const quickBookingMode = ref(false);

const handleLogin = (type) => {
  const account = loginForm.u.trim();
  const password = loginForm.p.trim();
  let user = type === 'staff' 
    ? staffList.value.find(s => (s.username === account || s.phone === account) && s.password === password)
    : customers.value.find(c => c.phone === account && c.password === password);

  if (user) { 
    currentUser.value = user; 
    const role = type === 'staff' ? user.role : 'client';
    if(role === 'client') navigate('/client');
    else if(role === 'admin') navigate('/admin');
    else if(role === 'doctor') navigate('/doctor');
    else navigate('/reception');
  } else {
    alert('账号或密码错误！(测试: 2023001/123)');
  }
};

const logout = () => { currentUser.value = null; navigate('/'); };

const addPetToCustomer = (customerId, petData) => {
  const targetCustomer = customers.value.find(c => c.id === customerId);
  if (targetCustomer) {
    const newPet = { ...petData, id: `P${Date.now()}` };
    targetCustomer.pets.push(newPet);
    if(currentUser.value && currentUser.value.id === customerId) currentUser.value.pets.push(newPet);
  }
};

const createOrder = (orderData) => {
  orders.value.unshift({
    ...orderData, id: `ORD${Date.now()}`, status: 'pending', 
    date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString()
  });
};

const addStaff = (staffData) => staffList.value.push({ ...staffData, id: Date.now(), role: staffData.role || 'doctor', status: 1 });

const addStock = (itemData) => {
  const exist = inventory.value.find(i => i.code === itemData.code);
  if(exist) {
    exist.stock += Number(itemData.addStock); exist.batch = itemData.batch; exist.validity = itemData.validity;
  } else {
    inventory.value.push({ ...itemData, id: `INV${Date.now()}`, stock: Number(itemData.addStock) });
  }
};

const payOrder = (orderId) => {
  const order = orders.value.find(o => o.id === orderId);
  if(order) order.status = 'paid';
};

const cleanCage = (id) => {
  const cage = cages.value.find(c => c.id === id);
  if(cage) { cage.status = 'free'; cage.cleanStatus = 'clean'; cage.pet = ''; cage.owner = ''; }
};

const openModal = (name, data = null) => { activeModal.value = name; modalData.value = data; };
const closeModal = () => { activeModal.value = null; modalData.value = null; };

const startBooking = (preselectedPetId = null, customer = null) => {
  initForm();
  bookingStep.value = 1;
  bookingData.type = 'beauty';
  bookingData.items = [];
  if (preselectedPetId && customer) {
    bookingData.tempCustomer = customer; bookingData.petId = preselectedPetId; quickBookingMode.value = true;
  } else {
    bookingData.petId = currentUser.value?.pets[0]?.id; bookingData.tempCustomer = currentUser.value; quickBookingMode.value = false;
  }
  openModal('booking');
};

const toggleBookingItem = (item) => {
  const exists = bookingData.items.find(i => i.id === item.id);
  if (exists) bookingData.items = bookingData.items.filter(i => i.id !== item.id);
  else bookingData.items.push(item);
};

const submitBooking = () => {
  if (bookingData.items.length === 0) return alert('请至少选择一项服务');
  const targetCustomer = bookingData.tempCustomer;
  const currentPet = targetCustomer.pets.find(p => p.id === bookingData.petId);
  const total = bookingData.items.reduce((sum, i) => sum + i.price, 0);
  createOrder({
    customerId: targetCustomer.id, customerName: targetCustomer.name, petName: currentPet.name,
    type: bookingData.type === 'beauty' ? '美容' : '寄养', items: bookingData.items, totalAmount: total
  });
  alert('预约/挂号成功！'); closeModal();
};

const submitPetForm = () => { if (!formState.name) return alert('请填写昵称'); addPetToCustomer(modalData?.customerId || currentUser.value.id, formState); closeModal(); };
const submitStaffForm = () => { if (!formState.username) return alert('请填写工号'); addStaff(formState); closeModal(); };
const submitInventoryForm = () => { if (!formState.name) return alert('请填写名称'); addStock(formState); closeModal(); };

const chartData = [ { name: '周一', value: 4000 }, { name: '周二', value: 3000 }, { name: '周三', value: 2000 }, { name: '周四', value: 2780 }, { name: '周五', value: 1890 }, { name: '周六', value: 2390 }, { name: '周日', value: 3490 } ];
const discount = ref(1);
const paymentType = ref('wechat');
</script>

<template>
  <div class="min-h-screen font-sans text-slate-800 bg-slate-50">
    <!-- 模态框 -->
    <div v-if="activeModal === 'customerDetail'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-slate-800 p-4 text-white flex justify-between items-center"><h2 class="text-lg font-bold flex items-center gap-2"><UserCog :size="20"/> 客户档案</h2><button @click="closeModal"><X :size="20"/></button></div>
        <div class="p-6 overflow-y-auto bg-slate-50 flex-1">
          <div class="bg-white p-5 rounded-lg shadow-sm border border-slate-200 mb-6">
            <div class="flex justify-between items-center mb-4 border-b pb-2"><h3 class="font-bold text-slate-700 flex items-center gap-2"><User :size="18"/> 基础信息</h3><span class="text-xs text-slate-400">注册: {{ modalData.regTime }}</span></div>
            <div class="grid grid-cols-3 gap-6">
              <div><label class="text-xs font-bold text-slate-500">姓名</label><input class="w-full border p-2 rounded" v-model="modalData.name"></div>
              <div><label class="text-xs font-bold text-slate-500">手机</label><input class="w-full border p-2 rounded" v-model="modalData.phone"></div>
              <div><label class="text-xs font-bold text-slate-500">等级</label><div class="px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded font-bold text-sm">🏅 {{ modalData.memberType }}</div></div>
              <div class="col-span-2"><label class="text-xs font-bold text-slate-500">地址</label><input class="w-full border p-2 rounded" v-model="modalData.address"></div>
              <div><label class="text-xs font-bold text-slate-500">余额</label><div class="flex gap-2"><div class="flex-1 border p-2 rounded bg-slate-100 font-mono text-right">¥{{ modalData.balance.toFixed(2) }}</div><button class="bg-green-600 text-white px-3 rounded text-sm">充值</button></div></div>
            </div>
          </div>
          <div class="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <div class="flex justify-between items-center mb-4"><h3 class="font-bold text-slate-700 flex items-center gap-2"><Dog :size="18"/> 宠物列表</h3><button @click="initForm(); openModal('pet', {customerId: modalData.id})" class="bg-orange-500 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"><PlusCircle :size="16"/> 新增</button></div>
            <table class="w-full text-sm text-left"><thead class="bg-slate-50 text-slate-500"><tr><th class="p-3">昵称</th><th class="p-3">品种</th><th class="p-3">性别</th><th class="p-3">年龄</th><th class="p-3 text-right">操作</th></tr></thead><tbody><tr v-for="pet in modalData.pets" :key="pet.id" class="hover:bg-slate-50"><td class="p-3 font-bold">{{ pet.name }}</td><td class="p-3">{{ pet.type }} ({{ pet.breed }})</td><td class="p-3">{{ pet.gender }}</td><td class="p-3">{{ pet.age }}</td><td class="p-3 text-right flex justify-end gap-2"><button @click="startBooking(pet.id, modalData)" class="bg-blue-50 text-blue-600 px-2 py-1 rounded">挂号</button></td></tr></tbody></table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'booking'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="bg-blue-600 p-4 text-white font-bold text-lg flex justify-between"><span>{{ bookingStep===1?'1. 选择对象与类型':'2. 选择项目' }}</span><button @click="closeModal"><X/></button></div>
        <div class="p-6">
          <div v-if="bookingStep === 1" class="space-y-6">
            <div v-if="quickBookingMode" class="bg-blue-50 p-3 rounded border border-blue-100"><span class="text-sm text-blue-800">当前办理：<span class="font-bold">{{ bookingData.tempCustomer.name }}</span> - <span class="font-bold">{{ bookingData.tempCustomer.pets.find(p=>p.id===bookingData.petId).name }}</span></span></div>
            <div v-else><label class="font-bold text-slate-700 mb-3 block">选择宠物</label><div class="grid grid-cols-2 gap-3"><div v-for="pet in currentUser.pets" :key="pet.id" @click="bookingData.petId=pet.id" class="p-3 border rounded-xl cursor-pointer flex items-center gap-3 transition" :class="bookingData.petId===pet.id?'border-blue-500 bg-blue-50 ring-1 ring-blue-500':'hover:bg-slate-50'"><div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">🐶</div><div><div class="font-bold text-sm">{{ pet.name }}</div></div></div></div></div>
            <div><label class="font-bold text-slate-700 mb-3 block">服务类型</label><div class="grid grid-cols-2 gap-4"><div @click="bookingData.type='beauty'; bookingData.items=[]" class="p-5 border rounded-xl cursor-pointer text-center" :class="bookingData.type==='beauty'?'border-blue-500 bg-blue-50':'hover:bg-slate-50'"><ShoppingBag class="mx-auto mb-2 text-blue-500"/><div class="font-bold text-blue-700">美容洗护</div></div><div @click="bookingData.type='boarding'; bookingData.items=[]" class="p-5 border rounded-xl cursor-pointer text-center" :class="bookingData.type==='boarding'?'border-blue-500 bg-blue-50':'hover:bg-slate-50'"><Home class="mx-auto mb-2 text-blue-500"/><div class="font-bold text-blue-700">寄养服务</div></div></div></div>
            <button @click="bookingStep=2" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4">下一步</button>
          </div>
          <div v-else class="space-y-4">
            <div class="space-y-3"><div v-for="item in SERVICES_MENU[bookingData.type]" :key="item.id" @click="toggleBookingItem(item)" class="p-4 border rounded-lg cursor-pointer flex justify-between items-center transition" :class="bookingData.items.find(i=>i.id===item.id)?'border-blue-500 bg-blue-50 ring-1 ring-blue-500':'hover:bg-slate-50'"><div><div class="font-bold text-slate-800">{{ item.name }}</div><div class="text-xs text-slate-500">{{ item.desc }}</div></div><div class="text-blue-600 font-bold">¥{{ item.price }}</div></div></div>
            <div class="border-t pt-4 mt-6 flex justify-between items-end"><span class="text-slate-500 text-sm">已选 {{ bookingData.items.length }} 项</span><div class="text-right"><span class="text-xs text-slate-400 block">预计总价</span><span class="text-3xl font-bold text-red-600">¥{{ bookingData.items.reduce((s,i)=>s+i.price,0) }}</span></div></div>
            <div class="flex gap-3"><button @click="bookingStep=1" class="flex-1 py-3 border rounded-lg text-gray-600">返回</button><button @click="submitBooking" class="flex-[2] py-3 bg-blue-600 text-white rounded-lg font-bold">提交</button></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'pet'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-orange-500">
        <div class="p-5 border-b flex justify-between items-center"><h3 class="text-lg font-bold text-slate-800 flex items-center gap-2"><FileText/> 宠物建档</h3><button @click="closeModal"><X/></button></div>
        <div class="p-6 grid grid-cols-2 gap-6">
          <div class="space-y-4"><h4 class="font-bold text-orange-600 border-b pb-2 text-xs">基础档案</h4><div><label class="text-xs text-slate-500">昵称 *</label><input class="w-full border p-2 rounded" v-model="formState.name"></div><div class="flex gap-2"><select class="border p-2 rounded flex-1" v-model="formState.type"><option>犬</option><option>猫</option></select><input class="border p-2 rounded flex-1" placeholder="品种" v-model="formState.breed"></div><div class="flex gap-2"><select class="border p-2 rounded flex-1" v-model="formState.gender"><option>公</option><option>母</option></select><input type="date" class="border p-2 rounded flex-1" v-model="formState.birthday"></div></div>
          <div class="space-y-4"><h4 class="font-bold text-orange-600 border-b pb-2 text-xs">医疗健康</h4><div><label class="text-xs text-slate-500">绝育</label><select class="w-full border p-2 rounded" v-model="formState.sterilized"><option>否</option><option>是</option></select></div><div><label class="text-xs text-slate-500">过敏史</label><textarea class="w-full border p-2 rounded h-20" placeholder="无" v-model="formState.allergies"></textarea></div></div>
        </div>
        <div class="p-4 bg-slate-50 border-t flex justify-end gap-3"><button @click="closeModal" class="px-4 py-2 border rounded">取消</button><button @click="submitPetForm" class="px-6 py-2 bg-orange-500 text-white rounded font-bold">保存</button></div>
      </div>
    </div>

    <div v-if="activeModal === 'bill'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-800 p-6 text-white text-center"><h2 class="text-xl font-bold tracking-widest uppercase">服务结算详单</h2><p class="text-xs opacity-70">NO. {{ modalData.id }}</p></div>
        <div class="p-8 flex-1 overflow-y-auto font-mono text-sm text-slate-600">
          <div class="flex justify-between mb-6 border-b pb-4"><div><p class="text-slate-400">客户</p><p class="font-bold text-slate-800">{{ modalData.customerName }}</p></div><div class="text-right"><p class="text-slate-400">日期</p><p>{{ modalData.date }}</p></div></div>
          <table class="w-full mb-6"><thead><tr class="border-b text-slate-400"><th class="text-left py-2">项目</th><th class="text-right">金额</th></tr></thead><tbody><tr v-for="(item, idx) in modalData.items" :key="idx"><td class="py-2"><div class="font-bold text-slate-700">{{ item.name }}</div></td><td class="text-right font-bold text-slate-800">¥{{ item.price }}</td></tr></tbody></table>
          <div class="space-y-2 border-t pt-4"><div class="flex justify-between"><span>小计</span><span>¥{{ modalData.totalAmount }}</span></div><div class="flex justify-between text-slate-400"><span>税费(6%)</span><span>¥{{ (modalData.totalAmount * 0.06).toFixed(2) }}</span></div><div class="flex justify-between border-t-2 border-slate-800 pt-3 mt-2 text-xl font-bold text-blue-900"><span>总计</span><span>¥{{ (modalData.totalAmount * 1.06).toFixed(2) }}</span></div></div>
        </div>
        <div class="p-4 bg-slate-50 border-t flex justify-end"><button @click="closeModal" class="px-6 py-2 bg-slate-800 text-white rounded">关闭</button></div>
      </div>
    </div>

    <div v-if="activeModal === 'cashier'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg shadow-xl rounded-lg overflow-hidden">
        <div class="p-6 border-b"><h3 class="text-xl font-bold">收银结算</h3></div>
        <div class="p-6 space-y-6">
          <div class="flex justify-between items-end"><span class="text-slate-500">应收金额</span><span class="text-4xl font-bold text-blue-600">¥{{ modalData.totalAmount }}</span></div>
          <div class="grid grid-cols-2 gap-3"><button @click="payOrder(modalData.id); closeModal()" class="p-4 border rounded hover:bg-green-50 text-green-700 font-bold">微信支付</button><button @click="payOrder(modalData.id); closeModal()" class="p-4 border rounded hover:bg-sky-50 text-sky-700 font-bold">支付宝</button><button @click="payOrder(modalData.id); closeModal()" class="p-4 border rounded hover:bg-slate-100">现金/刷卡</button><button @click="payOrder(modalData.id); closeModal()" class="p-4 border rounded hover:bg-orange-50 text-orange-700">储值扣款</button></div>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'staff'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-2xl shadow-xl overflow-hidden">
        <div class="bg-purple-700 p-4 text-white font-bold flex justify-between"><span>员工入职</span><button @click="closeModal"><X/></button></div>
        <div class="p-6 grid grid-cols-2 gap-6">
          <div class="space-y-4"><input class="border p-2 rounded w-full" placeholder="姓名 *" v-model="formState.name"><input class="border p-2 rounded w-full" placeholder="手机 *" v-model="formState.phone"></div>
          <div class="space-y-4"><input class="border p-2 rounded w-full bg-purple-50" placeholder="工号 *" v-model="formState.username"><select class="border p-2 rounded w-full" v-model="formState.role"><option value="doctor">医生</option><option value="reception">前台</option><option value="admin">管理</option></select></div>
        </div>
        <div class="p-4 bg-slate-50 text-right"><button @click="submitStaffForm" class="bg-purple-600 text-white px-6 py-2 rounded font-bold">录入</button></div>
      </div>
    </div>

    <div v-if="activeModal === 'inventory'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-lg shadow-xl overflow-hidden">
        <div class="bg-green-600 p-4 text-white font-bold flex justify-between"><span>物资入库</span><button @click="closeModal"><X/></button></div>
        <div class="p-6 space-y-4">
          <div class="flex gap-2"><input class="border p-2 rounded w-1/3" placeholder="编码" v-model="formState.code"><input class="border p-2 rounded flex-1" placeholder="名称 *" v-model="formState.name"></div>
          <div class="grid grid-cols-2 gap-4"><input type="number" class="border p-2 rounded" placeholder="数量" v-model="formState.addStock"><input class="border p-2 rounded" type="date" v-model="formState.validity"></div>
        </div>
        <div class="p-4 border-t flex justify-end"><button @click="submitInventoryForm" class="bg-green-600 text-white px-8 py-2 rounded font-bold">入库</button></div>
      </div>
    </div>
    
    <div v-if="activeModal === 'check'" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <div class="bg-blue-600 p-5 flex justify-between items-center text-white"><h2 class="text-xl font-bold flex items-center gap-2"><Stethoscope/> 临床检查</h2><button @click="closeModal"><X/></button></div>
        <div class="p-8 space-y-8 bg-slate-50">
          <div class="grid grid-cols-4 gap-4 bg-white p-4 rounded border border-slate-200 text-sm"><div><span class="text-slate-400 block">宠物</span>{{ modalData.petName }}</div><div><span class="text-slate-400 block">宠主</span>{{ modalData.customerName }}</div><div><span class="text-slate-400 block">日期</span>{{ new Date().toLocaleDateString() }}</div><div><span class="text-slate-400 block">医生</span>{{ currentUser.name }}</div></div>
          <div class="bg-white p-6 rounded border border-slate-200"><h4 class="font-bold text-blue-700 text-sm mb-6 border-b pb-2">基础体征</h4><div class="grid grid-cols-2 gap-8"><div><label class="text-xs font-bold text-slate-500 mb-1 block">体温 (°C)</label><input type="number" class="w-full border p-2 rounded" placeholder="38.5"></div><div><label class="text-xs font-bold text-slate-500 mb-1 block">体重 (kg)</label><input type="number" class="w-full border p-2 rounded" placeholder="10"></div></div></div>
          <div class="bg-white p-6 rounded border border-slate-200"><h4 class="font-bold text-blue-700 text-sm mb-4 border-b pb-2">诊断结论</h4><textarea class="w-full border p-4 h-32 text-sm rounded outline-none" placeholder="输入诊断结果..."></textarea></div>
        </div>
        <div class="p-5 border-t bg-white flex justify-end gap-3"><button @click="closeModal(); alert('归档成功')" class="px-6 py-2 bg-blue-600 text-white rounded font-bold shadow">提交</button></div>
      </div>
    </div>

    <!-- 页面 -->
    <div v-if="currentPath === '/'" class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div class="text-center mb-12"><div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3"><Activity class="text-white w-10 h-10"/></div><h1 class="text-3xl font-extrabold text-slate-800">爱宠专业医疗中心</h1><p class="text-slate-500">Professional Veterinary Service System V5.0</p></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div @click="navigate('/login', {type: 'client'})" class="bg-white p-8 rounded-xl shadow-md border-2 border-transparent hover:border-sky-400 cursor-pointer transition hover:-translate-y-1 group"><div class="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-sky-500 transition"><User class="text-sky-600 group-hover:text-white"/></div><h2 class="text-xl font-bold text-slate-800">我是宠主</h2><p class="text-slate-400 text-sm mt-1">预约挂号 · 健康档案</p></div>
        <div @click="navigate('/login', {type: 'staff'})" class="bg-white p-8 rounded-xl shadow-md border-2 border-transparent hover:border-blue-500 cursor-pointer transition hover:-translate-y-1 group"><div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition"><Stethoscope class="text-blue-600 group-hover:text-white"/></div><h2 class="text-xl font-bold text-slate-800">医护人员入口</h2><p class="text-slate-400 text-sm mt-1">工作台 · 接诊 · 管理</p></div>
      </div>
    </div>

    <div v-if="currentPath === '/login'" class="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <button @click="navigate('/')" class="text-sm text-slate-400 mb-4 hover:text-blue-600">&larr; 返回首页</button>
        <h1 class="text-2xl font-bold text-center mb-8 text-slate-800">{{ pathParams.type === 'staff' ? '医护登录' : '宠主登录' }}</h1>
        <div class="space-y-4">
          <input v-model="loginForm.u" class="w-full p-3 border rounded-lg" :placeholder="pathParams.type === 'staff' ? '工号/手机' : '手机号'">
          <input v-model="loginForm.p" class="w-full p-3 border rounded-lg" type="password" placeholder="密码">
          <button @click="handleLogin(pathParams.type)" class="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition">登录</button>
        </div>
        <div class="mt-6 text-xs text-slate-400 text-center bg-slate-50 p-3 rounded border border-slate-100"><p v-if="pathParams.type === 'staff'">测试: 院长(admin), 医生(2023001)</p><p v-else>测试: 13911112222</p><p>密码: 123</p></div>
      </div>
    </div>

    <div v-if="currentPath === '/client'" class="min-h-screen bg-slate-50">
      <div class="bg-white px-6 py-4 shadow-sm sticky top-0 z-20 flex justify-between items-center"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold">{{ currentUser?.name[0] }}</div><div><h2 class="font-bold text-lg text-slate-800">{{ currentUser?.name }}</h2><p class="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded w-fit">{{ currentUser?.memberType }}</p></div></div><button @click="logout" class="text-sm text-slate-500 hover:text-red-500 flex gap-1"><LogOut :size="16"/> 退出</button></div>
      <div class="p-6 max-w-2xl mx-auto space-y-8">
        <div class="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 flex justify-between items-center"><div><p class="text-sm opacity-90">账户余额</p><h3 class="text-3xl font-bold mt-1">¥ {{ currentUser?.balance.toFixed(2) }}</h3></div><button class="bg-white/20 backdrop-blur px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/30 transition">充值</button></div>
        <div><div class="flex justify-between items-center mb-4"><h3 class="font-bold text-slate-700 flex items-center gap-2"><Dog :size="18"/> 我的爱宠</h3><button @click="initForm(); openModal('pet')" class="text-blue-600 text-sm font-bold flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition"><PlusCircle :size="16"/> 添加</button></div><div class="grid gap-3"><div v-for="pet in currentUser?.pets" :key="pet.id" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition"><div class="flex gap-4 items-center"><div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">🐶</div><div><div class="font-bold text-slate-800">{{ pet.name }}</div><div class="text-xs text-slate-500">{{ pet.breed }} · {{ pet.age }}</div></div></div><button @click="startBooking(pet.id, currentUser)" class="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-sky-100 transition">预约服务</button></div></div></div>
        <div><h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2"><Receipt :size="18"/> 订单记录</h3><div class="space-y-3"><div v-for="o in orders.filter(x=>x.customerName===currentUser?.name)" :key="o.id" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-300 transition" @click="openModal('bill', o)"><div class="flex justify-between items-start"><div><div class="font-bold text-slate-800">{{ o.type }}服务</div><div class="text-xs text-slate-400 mt-1">{{ o.date }}</div></div><div class="text-right"><div class="font-bold text-slate-800">¥{{ o.totalAmount }}</div><span class="text-[10px] px-2 py-0.5 rounded" :class="o.status==='pending'?'bg-red-50 text-red-500':'bg-green-50 text-green-500'">{{ o.status==='pending'?'待支付':'已完成' }}</span></div></div></div></div></div>
      </div>
    </div>

    <div v-if="currentPath === '/doctor'" class="min-h-screen bg-slate-50 flex">
      <div class="w-80 bg-white border-r border-slate-200 flex flex-col"><div class="p-4 border-b border-slate-100 bg-white shadow-sm z-10"><div class="flex items-center gap-2 font-bold text-lg text-slate-800"><Stethoscope :size="20" class="text-blue-600"/> 医师工作站</div><div class="text-xs text-slate-500 mt-1 pl-7">Dr. {{ currentUser?.name }}</div></div><div class="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50"><div v-for="o in orders.filter(x=>x.status==='pending')" :key="o.id" class="p-3 border rounded-lg hover:border-blue-500 cursor-pointer bg-white transition shadow-sm group" @click="openModal('check', o)"><div class="flex justify-between font-bold text-slate-700"><span>{{ o.petName }}</span><span class="text-xs bg-slate-100 px-2 rounded border border-slate-200 text-slate-500">{{ o.type }}</span></div><div class="text-xs text-slate-400 mt-1">宠主: {{ o.customerName }}</div></div></div><div class="p-4 border-t border-slate-100 bg-white"><button @click="logout" class="w-full border py-2 text-slate-500 rounded text-sm hover:bg-slate-50">退出</button></div></div>
      <div class="flex-1 bg-slate-50 flex items-center justify-center text-slate-400 flex-col"><Stethoscope :size="64" class="mb-4 opacity-20"/><h2 class="text-xl font-bold text-slate-500">请选择患者接诊</h2></div>
      <div class="w-72 bg-white border-l border-slate-200 flex flex-col p-4"><h4 class="font-bold text-slate-600 text-sm mb-4 flex items-center gap-2"><Archive :size="16"/> 历史档案</h4><div class="space-y-3"><div class="bg-slate-50 p-3 rounded border border-slate-200 text-sm"><div class="font-bold text-slate-700">2023-12-10 疫苗</div><p class="text-xs text-slate-500">医生: 王建国</p></div></div></div>
    </div>

    <div v-if="currentPath === '/reception'" class="min-h-screen bg-slate-50">
      <div class="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-20 shadow-sm"><h2 class="font-bold text-slate-800 flex items-center gap-2"><LayoutDashboard class="text-blue-600"/> 前台管理</h2><button @click="logout" class="text-sm text-slate-400 hover:text-red-500 transition">退出</button></div>
      <div class="p-6 grid grid-cols-3 gap-6">
        <div class="col-span-2 space-y-4">
          <div class="flex justify-between items-center mb-2"><h3 class="font-bold text-slate-600 flex items-center gap-2"><UserCog :size="18"/> 客户列表</h3></div><div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6"><table class="w-full text-sm text-left"><thead class="bg-slate-50 text-slate-500"><tr><th class="p-3">姓名</th><th class="p-3">电话</th><th class="p-3">等级</th><th class="p-3">操作</th></tr></thead><tbody><tr v-for="c in customers" :key="c.id" class="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" @click="openModal('customerDetail', c)"><td class="p-3 font-bold text-slate-700">{{ c.name }}</td><td class="p-3 text-slate-500">{{ c.phone }}</td><td class="p-3"><span class="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">{{ c.memberType }}</span></td><td class="p-3 text-blue-600">详情</td></tr></tbody></table></div>
          <h3 class="font-bold text-slate-600 mb-2 flex items-center gap-2"><CreditCard :size="18"/> 待办订单</h3><div v-for="o in orders.filter(x=>x.status==='pending')" :key="o.id" class="bg-white p-5 rounded-xl shadow-sm border-l-4 border-orange-400 flex justify-between items-center"><div><div class="font-bold text-lg text-slate-800">{{ o.customerName }}</div><div class="text-sm text-slate-500">{{ o.type }} - {{ o.petName }}</div></div><div class="text-right"><div class="text-red-500 font-bold text-xl">¥{{ o.totalAmount }}</div><button @click="openModal('cashier', o)" class="bg-orange-500 text-white px-4 py-1.5 rounded mt-1 text-sm font-bold shadow hover:bg-orange-600 transition">收款</button></div></div>
        </div>
        <div class="space-y-4"><h3 class="font-bold text-slate-600 mb-2 flex items-center gap-2"><BedDouble :size="18"/> 笼位状态</h3><div class="grid grid-cols-2 gap-3"><div v-for="c in cages" :key="c.id" class="bg-white p-3 rounded-lg shadow-sm border border-slate-200 relative overflow-hidden text-center group"><div class="text-lg font-bold text-slate-800">{{ c.name }}</div><div class="text-xs text-slate-400">{{ c.type }}</div><div class="mt-2 text-xs font-bold" :class="{'text-green-500':c.status==='free', 'text-red-500':c.status==='occupied', 'text-yellow-500':c.status==='dirty'}">{{ c.status==='free'?'空闲':c.status==='occupied'?'占用':'待清理' }}</div><button v-if="c.status==='dirty'" @click="cleanCage(c.id)" class="mt-2 w-full bg-yellow-100 text-yellow-700 text-xs py-1 rounded hover:bg-yellow-200">打扫</button></div></div></div>
      </div>
    </div>

    <div v-if="currentPath === '/admin'" class="min-h-screen bg-slate-50 flex">
      <div class="w-64 bg-slate-800 text-white flex flex-col p-4"><h1 class="text-xl font-bold mb-8 flex items-center gap-2"><Activity/> 医院管理</h1><div class="space-y-1 flex-1"><button @click="adminTab='dashboard'" class="w-full text-left px-4 py-2.5 rounded transition" :class="adminTab==='dashboard'?'bg-blue-600':'hover:bg-slate-700 text-slate-300'">综合看板</button><button @click="adminTab='staff'" class="w-full text-left px-4 py-2.5 rounded transition" :class="adminTab==='staff'?'bg-blue-600':'hover:bg-slate-700 text-slate-300'">员工管理</button><button @click="adminTab='inventory'" class="w-full text-left px-4 py-2.5 rounded transition" :class="adminTab==='inventory'?'bg-blue-600':'hover:bg-slate-700 text-slate-300'">物资库存</button></div><button @click="logout" class="text-sm text-slate-400 hover:text-white flex items-center gap-2"><LogOut :size="16"/> 退出登录</button></div>
      <div class="flex-1 p-8 overflow-y-auto">
        <div v-if="adminTab === 'dashboard'" class="space-y-8">
          <div class="grid grid-cols-4 gap-6 mb-8"><div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div class="text-slate-400 text-sm">营收</div><div class="text-3xl font-bold mt-2 text-blue-600">¥12,850</div></div><div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div class="text-slate-400 text-sm">挂号</div><div class="text-3xl font-bold mt-2 text-green-600">32</div></div><div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div class="text-slate-400 text-sm">预警</div><div class="text-3xl font-bold mt-2 text-red-500">{{ inventory.filter(i=>i.stock<i.warning).length }}</div></div><div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div class="text-slate-400 text-sm">员工</div><div class="text-3xl font-bold mt-2 text-purple-600">{{ staffList.length }}</div></div></div>
          <div class="bg-white p-6 rounded-xl shadow-sm h-96"><h3 class="font-bold text-slate-700 mb-6 flex items-center gap-2"><TrendingUp :size="20"/> 近七日营收趋势</h3><div class="flex items-end justify-between h-64 px-4 border-b border-l border-slate-200"><div v-for="d in chartData" :key="d.name" class="flex flex-col items-center gap-2 w-full mx-1"><div class="w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600 relative group" :style="{height: (d.value/5000)*100 + '%'}"><span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">{{ d.value }}</span></div><span class="text-xs text-slate-400">{{ d.name }}</span></div></div></div>
        </div>
        <div v-if="adminTab === 'staff'" class="bg-white rounded shadow-sm p-6"><div class="flex justify-between mb-6"><h3 class="font-bold text-lg text-slate-800">员工名册</h3><button @click="initForm(); openModal('staff')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 flex items-center gap-2"><PlusCircle :size="16"/> 新增员工</button></div><table class="w-full text-sm text-left"><thead class="bg-slate-50 text-slate-500"><tr><th class="p-4 rounded-l-lg">工号</th><th class="p-4">姓名</th><th class="p-4">职位</th><th class="p-4">部门</th><th class="p-4">电话</th><th class="p-4">入职日期</th><th class="p-4 rounded-r-lg">操作</th></tr></thead><tbody class="divide-y"><tr v-for="s in staffList" :key="s.id" class="hover:bg-slate-50"><td class="p-4 font-mono">{{ s.username }}</td><td class="p-4 font-bold">{{ s.name }}</td><td class="p-4">{{ s.title }}</td><td class="p-4"><span class="bg-slate-100 px-2 py-1 rounded text-xs">{{ s.dept }}</span></td><td class="p-4">{{ s.phone }}</td><td class="p-4">{{ s.joinDate }}</td><td class="p-4 text-red-500 cursor-pointer hover:text-red-700"><Trash2 :size="16"/></td></tr></tbody></table></div>
        <div v-if="adminTab === 'inventory'" class="bg-white rounded shadow p-6"><div class="flex justify-between mb-6"><h3 class="font-bold text-lg text-slate-800">物资库存总览</h3><button @click="initForm(); openModal('inventory')" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 flex items-center gap-2"><PlusCircle :size="16"/> 采购入库</button></div><table class="w-full text-sm text-left"><thead class="bg-slate-50 text-slate-500"><tr><th class="p-3 rounded-l">名称</th><th class="p-3">类型</th><th class="p-3">库存</th><th class="p-3">状态</th><th class="p-3 rounded-r">有效期</th></tr></thead><tbody><tr v-for="i in inventory" :key="i.id" class="border-b border-slate-50 hover:bg-slate-50 transition"><td class="p-3 font-medium text-slate-700">{{ i.name }} <span class="text-xs text-slate-400 block font-mono">{{ i.code }}</span></td><td class="p-3 text-slate-500">{{ i.type }}</td><td class="p-3 font-bold">{{ i.stock }}</td><td class="p-3"><span :class="i.stock<i.warning?'text-red-500 bg-red-50 px-2 py-0.5 rounded text-xs':'text-green-500 bg-green-50 px-2 py-0.5 rounded text-xs'">{{ i.stock<i.warning?'缺货':'充足' }}</span></td><td class="p-3 text-slate-400 font-mono text-xs">{{ i.validity }}</td></tr></tbody></table></div>
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
::-webkit-scrollbar-track { background: transparent; }
</style>