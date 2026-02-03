import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LayoutDashboard, Trash2, Map as MapIcon, BarChart3, Bell, Search, Plus, RotateCcw, Battery, Wifi, Filter, Download, AlertTriangle, CheckCircle, XCircle, MoreVertical, X, Calendar, ChevronDown, MapPin, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { BINS_DATA, CHART_DATA_24H, BIN_TYPE_DATA } from './data';

// --- COMPONENT VẼ ĐƯỜNG ĐI (ROUTING) ---
const CreateRoutineMachineLayer = ({ bins }) => {
  const binsToCollect = bins.filter(b => b.status === 'Fill' || b.fillLevel >= 85);
  const depot = L.latLng(21.0285, 105.8542); // Hồ Gươm

  if (binsToCollect.length === 0) return null;

  const waypoints = [
      depot,
      ...binsToCollect.map(bin => L.latLng(bin.lat, bin.lng)),
      depot
  ];

  const instance = L.Routing.control({
    waypoints: waypoints,
    lineOptions: {
      styles: [{ color: "#3b82f6", weight: 6, opacity: 0.8 }]
    },
    show: false, 
    addWaypoints: false,
    routeWhileDragging: false,
    fitSelectedRoutes: false,
    showAlternatives: false,
    createMarker: function() { return null; }
  });

  return instance;
};

const Routing = createControlComponent(CreateRoutineMachineLayer);

// --- UTILS ---
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// --- SUB-COMPONENTS ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'bins', icon: Trash2, label: 'Bin Management' },
    { id: 'map', icon: MapIcon, label: 'Map View' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 z-[1000]">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
          <Trash2 size={20} />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg">SmartWaste</h1>
          <p className="text-xs text-gray-400">IoT Monitoring</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 m-4 bg-emerald-50 rounded-xl">
        <p className="text-xs text-emerald-600 font-semibold mb-1">Smart City Initiative</p>
        <p className="text-sm font-bold text-gray-800">Green Transition Platform</p>
        <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] rounded font-medium">v1.0.0</span>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, iconBgClass }) => (
  <div className={`p-6 rounded-2xl text-white ${colorClass} relative overflow-hidden shadow-sm transition hover:-translate-y-1`}>
    <div className="relative z-10">
      <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-75">{subtext}</p>
    </div>
    <div className={`absolute top-4 right-4 p-2 rounded-lg ${iconBgClass} bg-opacity-20 backdrop-blur-sm`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <div className={`${color} p-6 rounded-2xl text-white shadow-sm flex justify-between items-start relative overflow-hidden`}>
    <div className="z-10">
       <p className="text-sm font-medium opacity-90 mb-2">{title}</p>
       <h3 className="text-4xl font-bold">{value}</h3>
    </div>
    <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm z-10">
       <Icon size={24} />
    </div>
    <div className="absolute bottom-0 left-0 w-full h-16 opacity-20">
       <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 20 L0 10 Q20 5 40 10 T80 15 T100 5 L100 20 Z" fill="white" />
       </svg>
    </div>
  </div>
);

const AlertStatCard = ({ title, value, color }) => (
  <div className={`${color} p-5 rounded-xl text-white shadow-sm`}>
     <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
     <h3 className="text-3xl font-bold">{value}</h3>
  </div>
);

// 3. Map Component (ĐÃ SỬA LỖI MẤT ĐƯỜNG)
const WasteMap = ({ data, height = "100%", zoom = 13 }) => {
  const center = data.length > 0 ? [data[0].lat, data[0].lng] : [21.0285, 105.8542];

  // --- SỬA Ở ĐÂY: Dùng useMemo để tính toán danh sách thùng cần thu gom ---
  // Mục đích: Chỉ khi nào có thùng mới bị đầy thì mới tính lại, còn refresh bình thường thì bỏ qua.
  const binsToCollect = useMemo(() => {
    return data.filter(b => b.status === 'Fill' || b.fillLevel >= 85);
  }, [JSON.stringify(data.map(b => b.id + b.status))]); // Theo dõi sự thay đổi của ID và Status

  // Tạo một cái "Key" duy nhất cho tuyến đường hiện tại
  const routeKey = binsToCollect.map(b => b.id).sort().join(',');

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: height, width: "100%", zIndex: 0 }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap'
      />
      <MapUpdater center={center} />

      {/* Chỉ vẽ Routing khi có thùng đầy */}
      {binsToCollect.length > 0 && (
        <Routing 
            // QUAN TRỌNG: Dùng routeKey làm key. 
            // Nếu Key không đổi (danh sách thùng đầy vẫn thế) -> React KHÔNG gọi lại API chỉ đường -> Không bị chặn.
            key={routeKey} 
            bins={data} 
        />
      )}

      {data.map((bin) => (
        <CircleMarker 
          key={bin.id} 
          center={[bin.lat, bin.lng]} 
          radius={10}
          pathOptions={{ 
            color: 'white', 
            fillColor: (bin.status === 'Fill' || bin.fillLevel >= 85) ? '#ef4444' : '#10b981', 
            fillOpacity: 1,
            weight: 2
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-sm">{bin.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{bin.id}</p>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${(bin.status === 'Fill' || bin.fillLevel >= 85) ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <span className="text-xs font-semibold">Fill: {bin.fillLevel}%</span>
              </div>
              <p className="text-xs font-bold text-blue-600">
                  Predict: {bin.predictedLevel ? (bin.predictedLevel >= 85 ? 'FULL TOMORROW' : 'SAFE') : 'NO DATA'}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

const AddBinModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onAdd({
      name: formData.get('name'),
      type: formData.get('type'),
      status: formData.get('status'),
      lat: parseFloat(formData.get('lat')),
      lng: parseFloat(formData.get('lng')),
      fillLevel: Math.floor(Math.random() * 30),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Add New Bin</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Bin Name</label><input name="name" required className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
             <div><label className="text-xs font-bold text-gray-500 uppercase">Lat</label><input name="lat" type="number" step="any" defaultValue="21.03" className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
             <div><label className="text-xs font-bold text-gray-500 uppercase">Lng</label><input name="lng" type="number" step="any" defaultValue="105.85" className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
          </div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Type</label><select name="type" className="w-full p-2 border border-gray-200 rounded-lg text-sm"><option value="General">General</option><option value="Recyclable">Recyclable</option><option value="Organic">Organic</option><option value="Hazardous">Hazardous</option></select></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Initial Status</label><select name="status" className="w-full p-2 border border-gray-200 rounded-lg text-sm"><option value="Not Fill">Not Fill</option><option value="Fill">Fill</option></select></div>
          <button type="submit" className="w-full py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition">Create Bin</button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Khởi tạo bins bằng Data giả lập (để lúc đầu vào không bị trắng)
  const initialData = BINS_DATA.map(b => ({
      ...b,
      status: b.fillLevel >= 85 ? 'Fill' : 'Not Fill',
      predictedLevel: null, // Mặc định là null để biết là chưa có data từ model
      lastUpdate: 'Just now'
  }));

  const [bins, setBins] = useState(initialData); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');

  // --- API CALL (ĐÃ BỎ BACKUP) ---
  const fetchBinData = async () => {
    setLoading(true);
    try {
        console.log("Connecting to Python Server...");
        const response = await fetch('https://smart-waste-api-jo59.onrender.com/api/get-bins');
        if (!response.ok) throw new Error('Failed to connect');
        
        const data = await response.json();
        console.log("Data received from Python:", data);
        
        // --- XỬ LÝ DỮ LIỆU TỪ MODEL ---
        const processedData = data.map(b => {
            // QUAN TRỌNG: Lấy đúng predictedLevel từ backend. KHÔNG TỰ CỘNG 5 NỮA.
            const modelPrediction = b.predictedLevel; 
            
            // Nếu backend không gửi predictedLevel (undefined/null), modelPrediction sẽ là undefined/null.
            
            return {
                ...b,
                status: b.status || (b.fillLevel >= 85 ? 'Fill' : 'Not Fill'),
                predictedLevel: modelPrediction 
            };
        });

        setBins(processedData);
    } catch (err) {
        console.error("Lỗi API:", err);
        alert("⚠️ Không kết nối được Server Python. Hiển thị dữ liệu cũ.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Gọi ngay khi vừa vào trang
    fetchBinData();

    // 2. Cài đặt tự động gọi lại sau mỗi 15 giây (15000ms)
    const interval = setInterval(() => {
        fetchBinData();
    }, 10000);

    // 3. Dọn dẹp khi tắt trang (để tránh lỗi)
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    const headers = "ID,Name,Type,Fill Level,Predicted Next Day,Last Reading\n";
    const rows = bins.map(b => `${b.id},${b.name},${b.type},${b.fillLevel}%,${b.predictedLevel || 'N/A'},${b.status}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smart_waste_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBins = bins.filter(bin => {
     const matchesSearch = bin.name.toLowerCase().includes(searchTerm.toLowerCase()) || bin.id.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesType = filterType === 'All Types' || bin.type === filterType;
     let matchesStatus = true;
     if (filterStatus !== 'All Status') matchesStatus = bin.status === filterStatus;
     return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddBin = (newBinData) => {
    const newId = `BIN-00${bins.length + 1}`;
    setBins([{ id: newId, ...newBinData, battery: 100, lastUpdate: 'Just now', status: 'Not Fill' }, ...bins]);
    setIsModalOpen(false);
  };

  const handleDeleteBin = (id) => {
    if(window.confirm('Delete bin?')) setBins(bins.filter(b => b.id !== id));
  };

  // --- VIEWS ---

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div><h2 className="text-2xl font-bold text-gray-800">Smart Waste Monitoring</h2><p className="text-gray-500 text-sm">Real-time IoT dashboard</p></div>
        <div className="flex gap-3">
          <button onClick={fetchBinData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition font-medium shadow-sm"><RotateCcw size={18} /> Refresh</button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm font-medium"><Plus size={18} /> Add Bin</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Bins" value={bins.length} subtext="Active sensors" icon={Trash2} colorClass="bg-blue-500" iconBgClass="bg-blue-400" />
        <KPICard title="Average Fill" value={`${Math.round(bins.reduce((acc, curr) => acc + curr.fillLevel, 0) / (bins.length || 1))}%`} subtext="Real-time avg" icon={BarChart3} colorClass="bg-emerald-500" iconBgClass="bg-emerald-400" />
        <KPICard title="Critical (Fill)" value={bins.filter(b => b.status === 'Fill').length} subtext="Predicted Overflow" icon={AlertTriangle} colorClass="bg-red-500" iconBgClass="bg-red-400" />
        <KPICard title="Low Battery" value={bins.filter(b => b.battery < 20).length} subtext="<20% battery" icon={Battery} colorClass="bg-orange-500" iconBgClass="bg-orange-400" />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4 px-2"><h3 className="font-bold text-gray-700 flex items-center gap-2"><MapIcon size={18} className="text-emerald-500" /> Live Map</h3><span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">{filteredBins.length} bins shown</span></div>
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 relative z-0"><WasteMap data={filteredBins} /></div>
          
          <div className="mt-4 flex gap-3 px-2">
             <div className="flex-1 relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search bins..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition" /></div>
             <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>All Types</option><option>General</option><option>Recyclable</option><option>Organic</option><option>Hazardous</option></select>
             <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>All Status</option><option>Fill</option><option>Not Fill</option></select>
          </div>
        </div>
        <div className="col-span-4 space-y-6 h-[500px] flex flex-col">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1">
            <h3 className="font-bold text-gray-700 mb-4 text-sm">Fill Level Trends (24h)</h3>
            <div className="h-[120px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={CHART_DATA_24H}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" /><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} /><Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" /></AreaChart></ResponsiveContainer></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1">
             <h3 className="font-bold text-gray-700 mb-2 text-sm text-amber-600 flex items-center gap-2"><Bell size={14} /> Predictions Alerts</h3>
             <div className="flex flex-col gap-2 mt-2 overflow-y-auto h-[120px]">
                {bins.filter(b => b.status === 'Fill').map(bin => (
                  <div key={bin.id} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md"><p className="text-xs font-bold text-red-700">Bin Full (Predicted)</p><p className="text-[10px] text-red-600">{bin.name} will overflow tomorrow.</p></div>
                ))}
                {bins.filter(b => b.status === 'Fill').length === 0 && <div className="text-center text-gray-400 text-xs mt-4">All bins are safe for tomorrow.</div>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BinManagementView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-gray-800">Bin Management</h2><p className="text-gray-500 text-sm">Add, edit, and manage all waste bins</p></div>
        <div className="flex gap-2">
            <button onClick={fetchBinData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"><RotateCcw size={18} /> Update Data (Live)</button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"><Plus size={18} /> Add New Bin</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 flex gap-4 items-center">
           <div className="flex-1 relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none" /></div>
           <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>All Types</option><option>General</option><option>Recyclable</option><option>Organic</option><option>Hazardous</option></select>
           <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>All Status</option><option>Fill</option><option>Not Fill</option></select>
        </div>
        <div className="w-full text-left">
           <div className="flex bg-white text-gray-500 text-xs font-semibold border-b border-gray-100 px-4 py-3">
              <div className="w-24">Bin ID</div><div className="flex-1">Name</div><div className="w-24">Type</div>
              <div className="w-32">Fill Level (Now)</div>
              {/* CỘT PREDICTED (ĐÃ SỬA: DÙNG DATA GỐC, KHÔNG CỘNG 5) */}
              <div className="w-40 text-center">Predicted Next Day</div>
              <div className="w-24">Battery</div>
              {/* CỘT LAST READING (ĐÃ KHÔI PHỤC) */}
              <div className="w-32">Last Reading</div>
              <div className="w-16 text-right">Actions</div>
           </div>
           <div className="divide-y divide-gray-100 text-sm text-gray-700">
             {filteredBins.length > 0 ? filteredBins.map((bin) => (
               <div key={bin.id} className="flex items-center hover:bg-gray-50 transition px-4 py-4">
                 <div className="w-24 font-bold text-gray-800">{bin.id}</div>
                 <div className="flex-1 font-medium">{bin.name}</div>
                 <div className="w-24"><span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200">{bin.type}</span></div>
                 <div className="w-32"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${bin.fillLevel >= 85 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${bin.fillLevel}%` }}></div></div><span className="text-xs font-medium">{bin.fillLevel}%</span></div></div>
                 
                 {/* PREDICTED UI (Hiển thị N/A nếu model không trả về) */}
                 <div className="w-40 text-center">
                    {bin.predictedLevel !== undefined && bin.predictedLevel !== null ? (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide 
                            ${bin.predictedLevel >= 85 || bin.status === 'Fill' 
                                ? 'bg-red-50 text-red-600 border-red-200' 
                                : 'bg-green-50 text-green-600 border-green-200'
                            }`}>
                            {bin.predictedLevel >= 85 || bin.status === 'Fill' ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                            {bin.predictedLevel >= 85 || bin.status === 'Fill' ? 'OVERFLOW' : 'SAFE'}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400 italic">N/A (No Model)</span>
                    )}
                 </div>

                 <div className="w-24"><div className="flex items-center gap-1 text-gray-500"><Battery size={14} className={bin.battery < 20 ? 'text-red-500' : 'text-gray-400'} /><span className="text-xs">{bin.battery}%</span></div></div>
                 <div className="w-32 text-xs text-gray-400">{bin.lastUpdate}</div>
                 <div className="w-16 flex justify-end"><button onClick={() => handleDeleteBin(bin.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={16}/></button></div>
               </div>
             )) : (<div className="flex flex-col items-center justify-center py-20 text-gray-400"><Trash2 size={48} className="mb-4 opacity-20" /><p className="text-sm">No bins found.</p></div>)}
           </div>
        </div>
      </div>
    </div>
  );

  const FullMapView = () => (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-4">
            <div className="flex-1 relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search bins on map..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none" /></div>
        </div>
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            <div className="col-span-9 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
                <WasteMap data={filteredBins} height="100%" />
            </div>
            <div className="col-span-3 flex flex-col gap-6 h-full">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4"><MapIcon size={18} className="text-blue-500" /> Map Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Total Bins</span><span className="font-bold text-gray-800">{bins.length}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Need Collection</span><span className="font-bold text-red-500">{filteredBins.filter(b => b.status === 'Fill').length}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const AnalyticsView = () => {
    const [timeRange, setTimeRange] = useState('Last 7 Days');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const [chartData, setChartData] = useState(CHART_DATA_24H);

    useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    const handleTimeChange = (range) => {
        setTimeRange(range);
        setIsDropdownOpen(false);
        const newData = CHART_DATA_24H.map(item => ({
            ...item,
            value: Math.floor(Math.random() * 80) + 10
        }));
        setChartData(newData);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-gray-800">Analytics</h2><p className="text-gray-500 text-sm">Insights and performance metrics</p></div>
                <div className="flex gap-3">
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition min-w-[160px] justify-between">
                            <div className="flex items-center gap-2"><Calendar size={16} /><span>{timeRange}</span></div>
                            <ChevronDown size={14} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in duration-100">
                                {['Last 24 Hours', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days'].map(option => (
                                    <button key={option} onClick={() => handleTimeChange(option)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${timeRange === option ? 'text-emerald-600 font-medium bg-emerald-50' : 'text-gray-600'}`}>{option}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleExport} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition shadow-sm"><Download size={16} /> Export</button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                <AnalyticsCard title="Avg Fill Level" value={`${Math.round(bins.reduce((acc, curr) => acc + curr.fillLevel, 0) / (bins.length || 1))}%`} icon={BarChart3} color="bg-emerald-500" />
                <AnalyticsCard title="Total Bins" value={bins.length} icon={Trash2} color="bg-blue-600" />
                <AnalyticsCard title="Critical Bins" value={bins.filter(b => b.fillLevel >= 80).length} icon={AlertTriangle} color="bg-orange-500" />
                <AnalyticsCard title="Efficiency" value="94%" icon={Wifi} color="bg-purple-600" />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-blue-500"/> Fill Level Trend</h3>
                    <div className="h-[250px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" /><XAxis dataKey="time" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fill="url(#purpleGradient)" /></AreaChart></ResponsiveContainer></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2"><RotateCcw size={18} className="text-emerald-500"/> Fill Level Distribution</h3>
                    <div className="h-[250px] flex flex-col items-center justify-center pb-6">
                         <div className="relative w-48 h-48">
                             <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                 <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                 <path className="text-emerald-500" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                 <path className="text-orange-500" strokeDasharray="20, 100" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                 <path className="text-red-500" strokeDasharray="10, 100" strokeDashoffset="-80" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                             </svg>
                         </div>
                         <div className="flex gap-3 text-[10px] text-gray-500 mt-4"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>0-60%</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>60-80%</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>80%+</span></div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px]">
                    <h3 className="font-bold text-gray-800 mb-4">Bin Types</h3>
                    <div className="h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={BIN_TYPE_DATA} margin={{left: 20}}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f0f0f0" /><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} /><Bar dataKey="count" barSize={20} fill="#cbd5e1" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px]">
                     <h3 className="font-bold text-gray-800 mb-4">Connection Types</h3>
                     <div className="flex flex-col items-center justify-center h-[200px] text-gray-300"></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px]">
                    <h3 className="font-bold text-gray-800 mb-4 text-amber-600 flex gap-2 items-center"><AlertTriangle size={18}/> Top Filled Bins</h3>
                    <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 text-sm">No bins available</div>
                </div>
            </div>
        </div>
    );
  };

  const AlertsView = () => {
      const [filterStatus, setFilterStatus] = useState('All');
      const [alertSearch, setAlertSearch] = useState('');
      const [alertSeverity, setAlertSeverity] = useState('All Severity');

      const generatedAlerts = bins.flatMap(bin => {
          let alerts = [];
          if (bin.fillLevel >= 80) alerts.push({ id: bin.id + 'c', type: 'Critical', msg: `Critical capacity: ${bin.name} is ${bin.fillLevel}% full`, time: '10 mins ago', severity: 'Critical' });
          else if (bin.fillLevel >= 60) alerts.push({ id: bin.id + 'w', type: 'Warning', msg: `High usage: ${bin.name} reached ${bin.fillLevel}%`, time: '1 hour ago', severity: 'Warning' });
          return alerts;
      });

      const filteredAlerts = generatedAlerts.filter(alert => {
          const matchesSearch = alert.msg.toLowerCase().includes(alertSearch.toLowerCase());
          const matchesSeverity = alertSeverity === 'All Severity' || alert.severity === alertSeverity;
          return matchesSearch && matchesSeverity;
      });

      return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-gray-800">Alerts</h2><p className="text-gray-500 text-sm">Monitor and manage system alerts</p></div>
                <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100 flex items-center gap-2"><Bell size={12} /> {generatedAlerts.length} Active</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <AlertStatCard title="Active Alerts" value={generatedAlerts.length} color="bg-orange-500" />
                <AlertStatCard title="Critical" value={generatedAlerts.filter(a => a.severity === 'Critical').length} color="bg-red-500" />
                <AlertStatCard title="Warning" value={generatedAlerts.filter(a => a.severity === 'Warning').length} color="bg-blue-500" />
                <AlertStatCard title="Resolved Today" value="12" color="bg-emerald-500" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                    {['Active', 'Resolved', 'All'].map(tab => (
                        <button key={tab} onClick={() => setFilterStatus(tab)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterStatus === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{tab}</button>
                    ))}
                </div>
                <div className="flex gap-3 flex-1 justify-end">
                    <div className="relative w-64"><Search className="absolute left-3 top-2.5 text-gray-400" size={16} /><input type="text" placeholder="Search alerts..." value={alertSearch} onChange={(e) => setAlertSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" /></div>
                    <select onChange={(e) => setAlertSeverity(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>All Severity</option><option>Critical</option><option>Warning</option></select>
                    <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>All Types</option><option>Capacity</option><option>Battery</option><option>Connection</option></select>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
                 {filteredAlerts.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                         {filteredAlerts.map((alert, idx) => (
                             <div key={idx} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition group">
                                 <div className={`p-2 rounded-full ${alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{alert.severity === 'Critical' ? <XCircle size={20}/> : <AlertTriangle size={20}/>}</div>
                                 <div className="flex-1"><div className="flex justify-between items-start"><h4 className="font-semibold text-gray-800 text-sm">{alert.severity} Alert</h4><span className="text-xs text-gray-400">{alert.time}</span></div><p className="text-sm text-gray-600 mt-1">{alert.msg}</p></div>
                                 <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-white hover:shadow-sm opacity-0 group-hover:opacity-100 transition">Details</button>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-[400px] text-gray-400"><div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Bell size={24} className="opacity-50" /></div><h3 className="font-semibold text-gray-600">No alerts found</h3><p className="text-sm">All systems are running smoothly!</p></div>
                 )}
            </div>
        </div>
      );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'bins': return <BinManagementView />;
      case 'map': return <FullMapView />;
      case 'analytics': return <AnalyticsView />;
      case 'alerts': return <AlertsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
      <AddBinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddBin} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">{renderContent()}</main>
    </div>
  );
}