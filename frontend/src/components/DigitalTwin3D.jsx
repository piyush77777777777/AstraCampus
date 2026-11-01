import React, { useState, useEffect, useRef } from 'react';
import { Layers, Eye, RefreshCw, ZoomIn, ZoomOut, Compass, Info, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const BUILDINGS = [
  {
    id: 'ADMIN',
    name: 'Admin Block',
    x: 0,
    y: -120,
    width: 260,
    depth: 140,
    height: 70,
    color: '#1e293b',
    roofColor: '#d97706',
    rooms: ['AUD', 'SH-1', 'SH-2']
  },
  {
    id: 'LHC',
    name: 'Lecture Hall Complex',
    x: -200,
    y: 30,
    width: 220,
    depth: 160,
    height: 60,
    color: '#1e293b',
    roofColor: '#2563eb',
    rooms: ['LH-1', 'LH-2', 'LH-3', 'LH-4', 'LH-5', 'LH-6']
  },
  {
    id: 'CRC',
    name: 'Academic Classrooms',
    x: 180,
    y: 40,
    width: 240,
    depth: 180,
    height: 55,
    color: '#1e293b',
    roofColor: '#059669',
    rooms: ['CR-101', 'CR-102', 'CR-103', 'CR-104', 'CR-105', 'CR-201', 'CR-202', 'CR-203', 'CR-204', 'CR-205']
  },
  {
    id: 'LABS',
    name: 'Science & Engineering Labs',
    x: -80,
    y: 220,
    width: 320,
    depth: 130,
    height: 50,
    color: '#1e293b',
    roofColor: '#9333ea',
    rooms: ['CS-LAB-1', 'CS-LAB-2', 'ELEC-LAB-1', 'ELEC-LAB-2', 'PHY-LAB', 'MECH-WS', 'CIVIL-LAB']
  },
  {
    id: 'OAT',
    name: 'Open-Air Amphitheatre',
    x: 230,
    y: -130,
    width: 140,
    depth: 140,
    height: 25,
    color: '#1e293b',
    roofColor: '#f59e0b',
    rooms: ['OAT']
  }
];

export default function DigitalTwin3D({ rooms = [], scheduleSessions = [], festBookings = [], onSelectRoom }) {
  const canvasRef = useRef(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [viewAngle, setViewAngle] = useState('isometric'); // 'isometric', 'top', 'front'
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(45); // degrees
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState('all');

  // Compute live room status
  const getRoomStatus = (roomId) => {
    // Check if room closed in maintenance
    if (roomId === 'CR-102') return { status: 'maintenance', label: 'Closed / Leak Repair', color: '#ef4444' };
    
    // Check if Spectra fest event
    const festEvent = festBookings.find(b => b.room_id === roomId && (b.status === 'approved' || b.status === 'alternative_offered'));
    if (festEvent) return { status: 'event', label: `Spectra Event (${festEvent.request_id})`, color: '#a855f7' };

    // Check active class
    const activeClass = scheduleSessions.find(s => s.room_id === roomId);
    if (activeClass) return { status: 'occupied', label: `${activeClass.course_id} (${activeClass.kind})`, color: '#3b82f6' };

    return { status: 'free', label: 'Available / Free', color: '#10b981' };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Save state
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);

    // Iso projection helper
    const rad = (rotation * Math.PI) / 180;
    const project = (x, y, z) => {
      if (viewAngle === 'top') {
        const rx = x * Math.cos(rad) - y * Math.sin(rad);
        const ry = x * Math.sin(rad) + y * Math.cos(rad);
        return { x: rx, y: ry };
      }
      if (viewAngle === 'front') {
        const rx = x * Math.cos(rad) - y * Math.sin(rad);
        return { x: rx, y: -z * 1.5 };
      }
      // Isometric 3D
      const rx = x * Math.cos(rad) - y * Math.sin(rad);
      const ry = (x * Math.sin(rad) + y * Math.cos(rad)) * 0.5 - z;
      return { x: rx, y: ry };
    };

    // Draw Ground Grid & Pathways
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = -350; i <= 350; i += 50) {
      const p1 = project(i, -350, 0);
      const p2 = project(i, 350, 0);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project(-350, i, 0);
      const p4 = project(350, i, 0);
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    // Sort buildings by depth
    const sortedBuildings = [...BUILDINGS].sort((a, b) => {
      const depthA = a.x * Math.sin(rad) + a.y * Math.cos(rad);
      const depthB = b.x * Math.sin(rad) + b.y * Math.cos(rad);
      return depthA - depthB;
    });

    // Draw Buildings & Room Markers
    sortedBuildings.forEach(b => {
      const halfW = b.width / 2;
      const halfD = b.depth / 2;

      // Base footprint
      const p0 = project(b.x - halfW, b.y - halfD, 0);
      const p1 = project(b.x + halfW, b.y - halfD, 0);
      const p2 = project(b.x + halfW, b.y + halfD, 0);
      const p3 = project(b.x - halfW, b.y + halfD, 0);

      // Top footprint
      const t0 = project(b.x - halfW, b.y - halfD, b.height);
      const t1 = project(b.x + halfW, b.y - halfD, b.height);
      const t2 = project(b.x + halfW, b.y + halfD, b.height);
      const t3 = project(b.x - halfW, b.y + halfD, b.height);

      // Building shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.moveTo(p0.x + 8, p0.y + 8);
      ctx.lineTo(p1.x + 8, p1.y + 8);
      ctx.lineTo(p2.x + 8, p2.y + 8);
      ctx.lineTo(p3.x + 8, p3.y + 8);
      ctx.closePath();
      ctx.fill();

      // Front / Left faces
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      // Wall 1
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wall 2
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Roof
      ctx.fillStyle = b.roofColor + '33';
      ctx.beginPath();
      ctx.moveTo(t0.x, t0.y);
      ctx.lineTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = b.roofColor;
      ctx.stroke();

      // Building label
      const centerTop = project(b.x, b.y, b.height + 15);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.name, centerTop.x, centerTop.y);

      // Draw Room Nodes inside building
      const numRooms = b.rooms.length;
      b.rooms.forEach((rid, idx) => {
        const rStatus = getRoomStatus(rid);
        // Position rooms across roof
        const offsetX = ((idx % 3) - 1) * (halfW * 0.6);
        const offsetY = (Math.floor(idx / 3) - 0.5) * (halfD * 0.6);
        const pos = project(b.x + offsetX, b.y + offsetY, b.height);

        const isSelected = selectedRoomId === rid;
        const isHovered = hoveredRoom?.id === rid;

        // Glow ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? 12 : (isHovered ? 10 : 7), 0, Math.PI * 2);
        ctx.fillStyle = rStatus.color;
        ctx.shadowColor = rStatus.color;
        ctx.shadowBlur = isSelected ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isSelected ? '#ffffff' : '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Room ID Tag
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = isSelected ? '#fbbf24' : '#cbd5e1';
        ctx.fillText(rid, pos.x, pos.y - 12);
      });
    });

    ctx.restore();
  }, [rotation, zoom, viewAngle, selectedRoomId, hoveredRoom, scheduleSessions, festBookings]);

  // Handle canvas mouse interactions
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    setRotation(prev => (prev + dx * 0.5) % 360);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">
      {/* 3D Header Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-cinzel font-bold text-slate-100 flex items-center gap-2">
              CIT Digital Twin Campus
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-normal border border-emerald-500/30">
                Live 3D Telemetry
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              27 Venue Nodes · 5 Major Blocks · Live Occupancy Heatmap
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewAngle('isometric')}
              className={`px-3 py-1 rounded transition-all ${viewAngle === 'isometric' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Isometric
            </button>
            <button
              onClick={() => setViewAngle('top')}
              className={`px-3 py-1 rounded transition-all ${viewAngle === 'top' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Top-Down
            </button>
            <button
              onClick={() => setViewAngle('front')}
              className={`px-3 py-1 rounded transition-all ${viewAngle === 'front' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Elevation
            </button>
          </div>

          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setRotation(45); setZoom(1); setViewAngle('isometric'); }}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Reset Viewpoint"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 flex justify-center items-center select-none overflow-hidden h-[460px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={460}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-grab active:cursor-grabbing w-full h-full object-contain"
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 backdrop-blur rounded-xl p-3 text-xs flex flex-wrap gap-4 shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300">Free / Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            <span className="text-slate-300">Active Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
            <span className="text-slate-300">Spectra Fest Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-slate-300">Maintenance / Leak</span>
          </div>
        </div>

        {/* Rotation Hint */}
        <div className="absolute top-4 right-4 bg-slate-900/80 border border-slate-800/80 backdrop-blur rounded-lg px-3 py-1.5 text-[11px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          Click & Drag to Rotate 3D Campus
        </div>
      </div>

      {/* Room Quick-Selector Drawer */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            Inspect Campus Venues (27 Rooms)
          </span>
          <span className="text-xs text-slate-400">
            Click any venue to highlight on 3D twin & timetable
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
          {rooms.map(r => {
            const status = getRoomStatus(r.id);
            const isSelected = selectedRoomId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRoomId(r.id);
                  if (onSelectRoom) onSelectRoom(r.id);
                }}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-100">{r.id}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 truncate">{r.name}</div>
                <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">{r.capacity} seats</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
