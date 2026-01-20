// --- MOCK DATA (Dữ liệu giả lập tại Hà Nội) ---

export const BINS_DATA = [
  { id: "BIN-001", name: "Hoan Kiem Lake", lat: 21.0285, lng: 105.8542, fillLevel: 85, type: "General", status: "Critical", battery: 45, lastUpdate: "10 mins ago" },
  { id: "BIN-002", name: "Old Quarter Center", lat: 21.0333, lng: 105.8500, fillLevel: 45, type: "Recyclable", status: "Normal", battery: 90, lastUpdate: "2 mins ago" },
  { id: "BIN-003", name: "St. Joseph's Cathedral", lat: 21.0288, lng: 105.8489, fillLevel: 72, type: "Organic", status: "Warning", battery: 65, lastUpdate: "1 hour ago" },
  { id: "BIN-004", name: "Hanoi Opera House", lat: 21.0254, lng: 105.8575, fillLevel: 20, type: "General", status: "Normal", battery: 95, lastUpdate: "5 mins ago" },
  { id: "BIN-005", name: "Ba Dinh Square", lat: 21.0368, lng: 105.8347, fillLevel: 92, type: "Hazardous", status: "Critical", battery: 12, lastUpdate: "Just now" },
];

export const CHART_DATA_24H = [
  { time: '00:00', value: 30 }, { time: '04:00', value: 45 },
  { time: '08:00', value: 35 }, { time: '12:00', value: 65 },
  { time: '16:00', value: 55 }, { time: '20:00', value: 80 },
];

export const BIN_TYPE_DATA = [
  { name: 'General', count: 120 },
  { name: 'Recyclable', count: 86 },
  { name: 'Organic', count: 45 },
  { name: 'Hazardous', count: 12 },
];